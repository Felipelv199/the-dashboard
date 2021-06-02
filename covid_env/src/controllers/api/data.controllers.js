import { Workbook } from 'exceljs';
import DataPiece from '../../models/DataPiece';
import dataPieceModelKeys from '../../static/api/dataPieceModelKeys.json';

export const uploadFile = async (req, res) => {
  const { file } = req.files;
  const workbook = new Workbook();
  let workbookFile;
  try {
    workbookFile = await workbook.xlsx.load(file.data);
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Internal Server Error', message: error.message });
    return;
  }
  const sheet = workbookFile.worksheets[0];
  let sheetHeaders = {};
  let docsUploadedCounter = 0;
  let validColumns = true;
  sheet.getRows(1, 1).forEach((row) =>
    row.eachCell((cell, colNumber) => {
      const valueParsed = cell.value.split('_').join('');
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
    res
      .status(400)
      .send({
        error: 'Bad Request',
        message: 'Some columns are missing inside the first sheet',
      })
      .end();
    return;
  }
  const rows = sheet.getRows(2, sheet.rowCount);
  await Promise.all(
    rows.map(async (row) => {
      let doc = {};
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

export const getData = async (req, res) => {
  const queryDocs = await DataPiece.find();
  res.send(queryDocs);
};

export const getDataByAgeRange = async (req, res) => {
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

const querysex = async (sex) => {
  return await DataPiece.find({ sexo: { $eq: sex } }).sort({ edad: 'asc' });
};

export const getBySex = async (req, res) => {
  const sex = req.query.sex.toUpperCase();
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

export const getDecease = async (req, res) => {
  const queryDecease = await DataPiece.find({ fechaDef: { $ne: null } }, [
    'diabetes',
    'epoc',
    'asma',
    'inmusupr',
    'hipertension',
    'cardiovascular',
    'obesidad',
    'renalCronica',
    'tabaquismo',
    'fechaDef',
    'tipoPaciente',
    'sexo',
  ]);
  res.send(queryDecease);
};

export const getPatients = async (req, res) => {
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
    {
      $project: {
        data: [
          {
            sex: MUJER,
            type: AMBULATORY,
            count: { $arrayElemAt: ['$MujeresAmbulatorias.num', 0] },
          },
          {
            sex: MUJER,
            type: HOSPITALIZED,
            count: { $arrayElemAt: ['$MujeresHospitalizadas.num', 0] },
          },
        ],
      },
    },
  ]);

  console.log(query);
  res.status(200).json(query[0].data);

  /*res.status(200).json( {
    hospitalizados: numHospitalized,
    ambulatorios: numAmbulatory,

  })*/
};
