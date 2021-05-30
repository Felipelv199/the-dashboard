import { Workbook } from 'exceljs';
import DataPiece from '../../models/DataPiece';
import dataPieceModelKeys from '../../static/api/dataPieceModelKeys.json';

export const createDataPiece = (req, res) => {
  const {
    idRegistro,
    origen,
    sector,
    entidadUm,
    sexo,
    entidadNac,
    entidadRes,
    municipioRes,
    tipoPaciente,
    fechaIngreso,
    fechaSintomas,
    fechaDef,
    intubado,
    neumonia,
    edad,
    nacionalidad,
    embarazo,
    hablaLenguaIndig,
    indigena,
    diabetes,
    epoc,
    asma,
    inmusupr,
    hipertension,
    otraCom,
    cardiovascular,
    obesidad,
    renalCronica,
    tabaquismo,
    otroCaso,
    tomaMuestraLab,
    resultadoLab,
    tomaMuestraAntigeno,
    resultadoAntigeno,
    clasificacionFinal,
    migrante,
    paisNacionalidad,
    paisOrigen,
    uci,
  } = req.body;
  if (
    !idRegistro ||
    !origen ||
    !sector ||
    !entidadUm ||
    !sexo ||
    !entidadNac ||
    !entidadRes ||
    !municipioRes ||
    !tipoPaciente ||
    !fechaIngreso ||
    !fechaSintomas ||
    !fechaDef ||
    !intubado ||
    !neumonia ||
    !edad ||
    !nacionalidad ||
    !embarazo ||
    !hablaLenguaIndig ||
    !indigena ||
    !diabetes ||
    !epoc ||
    !asma ||
    !inmusupr ||
    !hipertension ||
    !otraCom ||
    !cardiovascular ||
    !obesidad ||
    !renalCronica ||
    !tabaquismo ||
    !otroCaso ||
    !tomaMuestraLab ||
    !resultadoLab ||
    !tomaMuestraAntigeno ||
    !resultadoAntigeno ||
    !clasificacionFinal ||
    !migrante ||
    !paisNacionalidad ||
    !paisOrigen ||
    !uci
  ) {
    res.status(400).send({
      error: 'Bad Request',
      message: "You don't provide all the data needed",
    });
    return;
  }
  res.send({ message: 'Piece of data created' });
};

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
  sheet.getRows(0, 1).forEach((row) =>
    row.eachCell(
      (_, colNumber) =>
        (sheetHeaders = {
          ...sheetHeaders,
          [colNumber]: dataPieceModelKeys[colNumber - 1],
        })
    )
  );
  const rows = sheet.getRows(2, sheet.rowCount);
  await Promise.all(
    rows.map(async (row, rowNumber) => {
      let doc = {};
      row.eachCell(
        { includeEmpty: true },
        (cell) => (doc = { ...doc, [sheetHeaders[cell.col]]: cell.value })
      );
      const queryDoc = await DataPiece.findOne({
        idRegistro: doc['idRegistro'],
      });
      if (queryDoc === null) {
        try {
          await DataPiece.create(doc);
          docsUploadedCounter += 1;
        } catch (error) {
          res.status(500).send({
            error: 'Internal Server Error',
            message: error.message,
          });
          return;
        }
      }
    })
  );
  res.send({ message: 'Files uploaded', docsUploaded: docsUploadedCounter });
};
