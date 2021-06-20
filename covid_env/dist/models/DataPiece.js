"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var DataPieceSchema = new mongoose_1.Schema({
    idRegistro: String,
    origen: String,
    sector: String,
    entidadUm: String,
    sexo: String,
    entidadNac: String,
    entidadRes: String,
    municipioRes: String,
    tipoPaciente: String,
    fechaIngreso: Date,
    fechaSintomas: Date,
    fechaDef: Date,
    intubado: String,
    neumonia: String,
    edad: Number,
    nacionalidad: String,
    embarazo: String,
    hablaLenguaIndig: String,
    indigena: String,
    diabetes: String,
    epoc: String,
    asma: String,
    inmusupr: String,
    hipertension: String,
    otraCom: String,
    cardiovascular: String,
    obesidad: String,
    renalCronica: String,
    tabaquismo: String,
    otroCaso: String,
    tomaMuestraLab: String,
    resultadoLab: String,
    tomaMuestraAntigeno: String,
    resultadoAntigeno: String,
    clasificacionFinal: String,
    migrante: String,
    paisNacionalidad: String,
    paisOrigen: String,
    uci: String,
    fechaIngresoYr: Number,
    fechaIngresoMt: Number,
    fechaIngresoDy: Number,
    fechaIngresoWk: Number,
    fechaSintomasYr: Number,
    fechaSintomasMt: Number,
    fechaSintomasDy: Number,
    fechaSintomasWk: Number,
    fechaDefYR: Number,
    fechaDefMt: Number,
    fechaDefDy: Number,
    fechaDefWk: Number,
});
exports.default = mongoose_1.model('data', DataPieceSchema, 'data');
