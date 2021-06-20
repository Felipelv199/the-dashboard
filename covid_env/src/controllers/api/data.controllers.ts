import { Request, Response } from 'express';
import { Row, Workbook } from 'exceljs';
import DataPiece, { Document } from '../../models/DataPiece';
import dataPieceModelKeys from '../../static/api/dataPieceModelKeys.json';
import { UploadedFile } from 'express-fileupload';

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  const { files } = req;
  if (typeof files === 'undefined' || files === null) {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Not file provided',
    });
    return;
  }
  const uploadedFile = files.file as UploadedFile;
  if (uploadedFile.name === 'undefined') {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Upload only one file',
    });
    return;
  }
  const workbook = new Workbook();
  let workbookFile: Workbook;
  try {
    workbookFile = await workbook.xlsx.load(uploadedFile.data);
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Internal Server Error', message: error.message });
    return;
  }
  const sheet = workbookFile.worksheets[0];
  let sheetHeaders: any = {};
  let docsUploadedCounter = 0;
  let validColumns = true;
  let rows = sheet.getRows(1, 1);
  if (typeof rows === 'undefined') {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Excel file missing sheets',
    });
    return;
  }
  rows.forEach((row: Row) =>
    row.eachCell((cell, colNumber) => {
      const cellValue = cell.value as string;
      const valueParsed = cellValue.split('_').join('');
      if (
        valueParsed.toLowerCase() !==
        dataPieceModelKeys[colNumber - 1].toLowerCase()
      ) {
        validColumns = validColumns && false;
      }
      sheetHeaders = {
        ...sheetHeaders,
        [colNumber]: dataPieceModelKeys[colNumber - 1],
      };
    })
  );
  if (!validColumns) {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Some columns are missing inside the first sheet',
    });
    return;
  }
  rows = sheet.getRows(2, sheet.rowCount);
  if (typeof rows === 'undefined') {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Missing data bellow the headers',
    });
    return;
  }
  await Promise.all(
    rows.map(async (row) => {
      let doc: Document = {};
      row.eachCell(
        { includeEmpty: true },
        (cell) =>
          (doc = {
            ...doc,
            [sheetHeaders[cell.col]]: cell.value,
          })
      );
      let queryDoc;
      try {
        queryDoc = await DataPiece.findOne({
          idRegistro: doc['idRegistro'],
        });
      } catch (error) {
        res
          .status(500)
          .send({ error: 'Internal Server Error', message: error.message });
        return;
      }
      if (queryDoc === null) {
        try {
          await DataPiece.create(doc);
          docsUploadedCounter += 1;
        } catch (error) {
          res
            .status(500)
            .send({ error: 'Internal Server Error', message: error.message });
          return;
        }
      }
    })
  );
  res.send({ message: 'Files uploaded', docsUploaded: docsUploadedCounter });
};

export const getData = async (req: Request, res: Response) => {
  try {
    const queryDocs = await DataPiece.find();
    res.send(queryDocs);
  } catch (error) {
    res.status(400).send({
      error: 'Internal Server Error',
      message: error.message,
    });
    return;
  }
};

export const getDataByAgeRange = async (req: Request, res: Response) => {
  const firstAge = Number(req.query.firstAge);
  const lastAge = Number(req.query.lastAge);
  if (isNaN(firstAge) || isNaN(lastAge)) {
    res.status(400).send({
      error: 'Bad Request',
      message: "The query parameters given don't have the format required",
    });
    return;
  }
  if (firstAge < 0 || lastAge < 0 || firstAge > 100 || lastAge > 100) {
    res.status(400).send({
      error: 'Bad Request',
      message: "The query parameters given don't have the format required",
    });
    return;
  }
  if (firstAge > lastAge) {
    res.status(400).send({
      error: 'Bad Request',
      message: 'First age, cannot be greater than lastAge',
    });
    return;
  }
  const queryDocs = await DataPiece.find(
    {
      $and: [{ edad: { $gte: firstAge } }, { edad: { $lte: lastAge } }],
    },
    'edad diabetes hipertension obesidad'
  ).sort('edad');
  res.send({
    data: queryDocs,
    diseases: ['diabetes', 'hypertension', 'obesity'],
  });
};

export const getBySex = async (req: Request, res: Response) => {
  let sex = req.query.sex;
  if (typeof sex !== 'string') {
    return;
  }
  sex = sex.toUpperCase();
  if (sex) {
    if (sex === 'HOMBRE' || sex === 'MUJER') {
      const queryBysex = await querysex(sex);
      res.send(queryBysex);
    } else {
      res.status(400).json({
        error: 'Bad Request',
        message: 'sex option invalid. Only valid sexes: "HOMBRE" & "MUJER"',
      });
    }
  } else {
    res.status(400).json({
      error: 'Bad Request',
      message: 'sex parameter not indicated',
    });
  }
};

export const getDecease = async (req: Request, res: Response) => {
  const queryDecease = await DataPiece.find(
    { fechaDef: { $ne: null } },
    { sector: 1, sexo: 1, _id: 0 }
  );

  res.send(queryDecease);
};

const querysex = async (sex: string) => {
  return await DataPiece.find(
    { sexo: { $eq: sex } },
    { edad: 1, sexo: 1, _id: 0 }
  ).sort({ edad: 'asc' });
};

export const getPatients = async (req: Request, res: Response) => {
  const HOSPITALIZED = 'HOSPITALIZADO';
  const AMBULATORY = 'AMBULATORIO';
  const HOMBRE = 'HOMBRE';
  const MUJER = 'MUJER';

  const query = await DataPiece.aggregate([
    {
      $facet: {
        HombresHospitalizados: [
          {
            $match: {
              $and: [
                { tipoPaciente: { $exists: true, $eq: HOSPITALIZED } },
                { sexo: { $eq: HOMBRE } },
              ],
            },
          },
          { $count: 'num' },
        ],
        MujeresHospitalizadas: [
          {
            $match: {
              $and: [
                { tipoPaciente: { $exists: true, $eq: HOSPITALIZED } },
                { sexo: { $eq: MUJER } },
              ],
            },
          },
          { $count: 'num' },
        ],
        HombresAmbulatorios: [
          {
            $match: {
              $and: [
                { tipoPaciente: { $exists: true, $eq: AMBULATORY } },
                { sexo: { $eq: HOMBRE } },
              ],
            },
          },
          { $count: 'num' },
        ],
        MujeresAmbulatorias: [
          {
            $match: {
              $and: [
                { tipoPaciente: { $exists: true, $eq: AMBULATORY } },
                { sexo: { $eq: MUJER } },
              ],
            },
          },
          { $count: 'num' },
        ],
      },
    },
    {
      $project: {
        data: [
          {
            mujer: { $arrayElemAt: ['$MujeresAmbulatorias.num', 0] },
            hombre: { $arrayElemAt: ['$HombresAmbulatorios.num', 0] },
            state: AMBULATORY,
          },
          {
            mujer: { $arrayElemAt: ['$MujeresHospitalizadas.num', 0] },
            hombre: { $arrayElemAt: ['$HombresHospitalizados.num', 0] },
            state: HOSPITALIZED,
          },
        ],
      },
    },
  ]);

  console.log(query);
  res.status(200).json(query[0].data);
};

export const getPatientsHospitalizedIntubated = async (
  req: Request,
  res: Response
) => {
  let queryDocs = undefined;
  try {
    queryDocs = await DataPiece.find(
      { tipoPaciente: { $eq: 'HOSPITALIZADO' } },
      'edad tipoPaciente intubado neumonia entidadRes'
    ).sort('edad');
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Internal Server Error', message: error.message });
    return;
  }
  res.send(queryDocs);
};
