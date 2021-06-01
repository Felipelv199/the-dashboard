import { Workbook } from 'exceljs';
import DataPiece from '../../models/DataPiece';
import dataPieceModelKeys from '../../static/api/dataPieceModelKeys.json';

export const uploadFile = async (req, res) => {
  const { files } = req.files;
  const workbook = new Workbook();
  let workbookFile;
  try {
    workbookFile = await workbook.xlsx.load(files.data);
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
        (cell) => (doc = { ...doc, [sheetHeaders[cell.col]]: cell.value })
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
  const queryDocs = await DataPiece.find({
    $and: [{ edad: { $gte: firstAge } }, { edad: { $lte: lastAge } }],
  });
  res.send(queryDocs);
};

export const getBySex = async (req, res ) => {
  const sex = (req.query.sex).toUpperCase();
  console.log(`Request sex: ${sex}`)
  if ( sex ){
    if ( sex === "HOMBRE" || sex === "MUJER"){
      const queryBySex = await DataPiece.find(
        { sexo : { $eq: sex } 
      });
      res.send( queryBySex );
    }
    else{
      res.status(400).json({
        error: 'Bad Request',
        message: 'Sex option invalid. Only valid sexes: "HOMBRE" & "MUJER"',
      });
    }
  }
  else{
    res.status(400).json({
      error: 'Bad Request',
      message: 'Sex parameter not indicated',
    });
  }
}

export const getDecease = async (req, res) => {
  const queryDecease = await DataPiece.find( { fechaDef: { $ne: null} }, ['diabetes', 'epoc', 'asma', 'inmusupr', 'hipertension', 'cardiovascular', 'obesidad', 'renalCronica', 'tabaquismo','fechaDef']);
  res.send( queryDecease );
}


