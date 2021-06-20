"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientsHospitalizedIntubated = exports.getPatients = exports.getDecease = exports.getBySex = exports.getDataByAgeRange = exports.getData = exports.uploadFile = void 0;
var exceljs_1 = require("exceljs");
var DataPiece_1 = __importDefault(require("../../models/DataPiece"));
var dataPieceModelKeys_json_1 = __importDefault(require("../../static/api/dataPieceModelKeys.json"));
var uploadFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var files, uploadedFile, workbook, workbookFile, error_1, sheet, sheetHeaders, docsUploadedCounter, validColumns, rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = req.files;
                if (typeof files === 'undefined' || files === null) {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'Not file provided',
                    });
                    return [2 /*return*/];
                }
                uploadedFile = files.file;
                if (uploadedFile.name === 'undefined') {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'Upload only one file',
                    });
                    return [2 /*return*/];
                }
                workbook = new exceljs_1.Workbook();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, workbook.xlsx.load(uploadedFile.data)];
            case 2:
                workbookFile = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res
                    .status(500)
                    .send({ error: 'Internal Server Error', message: error_1.message });
                return [2 /*return*/];
            case 4:
                sheet = workbookFile.worksheets[0];
                sheetHeaders = {};
                docsUploadedCounter = 0;
                validColumns = true;
                rows = sheet.getRows(1, 1);
                if (typeof rows === 'undefined') {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'Excel file missing sheets',
                    });
                    return [2 /*return*/];
                }
                rows.forEach(function (row) {
                    return row.eachCell(function (cell, colNumber) {
                        var _a;
                        var cellValue = cell.value;
                        var valueParsed = cellValue.split('_').join('');
                        if (valueParsed.toLowerCase() !==
                            dataPieceModelKeys_json_1.default[colNumber - 1].toLowerCase()) {
                            validColumns = validColumns && false;
                        }
                        sheetHeaders = __assign(__assign({}, sheetHeaders), (_a = {}, _a[colNumber] = dataPieceModelKeys_json_1.default[colNumber - 1], _a));
                    });
                });
                if (!validColumns) {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'Some columns are missing inside the first sheet',
                    });
                    return [2 /*return*/];
                }
                rows = sheet.getRows(2, sheet.rowCount);
                if (typeof rows === 'undefined') {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'Missing data bellow the headers',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Promise.all(rows.map(function (row) { return __awaiter(void 0, void 0, void 0, function () {
                        var doc, queryDoc, error_2, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    doc = {};
                                    row.eachCell({ includeEmpty: true }, function (cell) {
                                        var _a;
                                        return (doc = __assign(__assign({}, doc), (_a = {}, _a[sheetHeaders[cell.col]] = cell.value, _a)));
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, DataPiece_1.default.findOne({
                                            idRegistro: doc['idRegistro'],
                                        })];
                                case 2:
                                    queryDoc = _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    res
                                        .status(500)
                                        .send({ error: 'Internal Server Error', message: error_2.message });
                                    return [2 /*return*/];
                                case 4:
                                    if (!(queryDoc === null)) return [3 /*break*/, 8];
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, DataPiece_1.default.create(doc)];
                                case 6:
                                    _a.sent();
                                    docsUploadedCounter += 1;
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_3 = _a.sent();
                                    res
                                        .status(500)
                                        .send({ error: 'Internal Server Error', message: error_3.message });
                                    return [2 /*return*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                _a.sent();
                res.send({ message: 'Files uploaded', docsUploaded: docsUploadedCounter });
                return [2 /*return*/];
        }
    });
}); };
exports.uploadFile = uploadFile;
var getData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryDocs, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, DataPiece_1.default.find()];
            case 1:
                queryDocs = _a.sent();
                res.send(queryDocs);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).send({
                    error: 'Internal Server Error',
                    message: error_4.message,
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getData = getData;
var getDataByAgeRange = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstAge, lastAge, queryDocs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstAge = Number(req.query.firstAge);
                lastAge = Number(req.query.lastAge);
                if (isNaN(firstAge) || isNaN(lastAge)) {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: "The query parameters given don't have the format required",
                    });
                    return [2 /*return*/];
                }
                if (firstAge < 0 || lastAge < 0 || firstAge > 100 || lastAge > 100) {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: "The query parameters given don't have the format required",
                    });
                    return [2 /*return*/];
                }
                if (firstAge > lastAge) {
                    res.status(400).send({
                        error: 'Bad Request',
                        message: 'First age, cannot be greater than lastAge',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, DataPiece_1.default.find({
                        $and: [{ edad: { $gte: firstAge } }, { edad: { $lte: lastAge } }],
                    }, 'edad diabetes hipertension obesidad').sort('edad')];
            case 1:
                queryDocs = _a.sent();
                res.send({
                    data: queryDocs,
                    diseases: ['diabetes', 'hypertension', 'obesity'],
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getDataByAgeRange = getDataByAgeRange;
var getBySex = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sex, queryBysex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sex = req.query.sex;
                if (typeof sex !== 'string') {
                    return [2 /*return*/];
                }
                sex = sex.toUpperCase();
                if (!sex) return [3 /*break*/, 4];
                if (!(sex === 'HOMBRE' || sex === 'MUJER')) return [3 /*break*/, 2];
                return [4 /*yield*/, querysex(sex)];
            case 1:
                queryBysex = _a.sent();
                res.send(queryBysex);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'sex option invalid. Only valid sexes: "HOMBRE" & "MUJER"',
                });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'sex parameter not indicated',
                });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getBySex = getBySex;
var getDecease = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryDecease;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, DataPiece_1.default.find({ fechaDef: { $ne: null } }, { sector: 1, sexo: 1, _id: 0 })];
            case 1:
                queryDecease = _a.sent();
                res.send(queryDecease);
                return [2 /*return*/];
        }
    });
}); };
exports.getDecease = getDecease;
var querysex = function (sex) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, DataPiece_1.default.find({ sexo: { $eq: sex } }, { edad: 1, sexo: 1, _id: 0 }).sort({ edad: 'asc' })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getPatients = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var HOSPITALIZED, AMBULATORY, HOMBRE, MUJER, query;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                HOSPITALIZED = 'HOSPITALIZADO';
                AMBULATORY = 'AMBULATORIO';
                HOMBRE = 'HOMBRE';
                MUJER = 'MUJER';
                return [4 /*yield*/, DataPiece_1.default.aggregate([
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
                    ])];
            case 1:
                query = _a.sent();
                console.log(query);
                res.status(200).json(query[0].data);
                return [2 /*return*/];
        }
    });
}); };
exports.getPatients = getPatients;
var getPatientsHospitalizedIntubated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryDocs, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queryDocs = undefined;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, DataPiece_1.default.find({ tipoPaciente: { $eq: 'HOSPITALIZADO' } }, 'edad tipoPaciente intubado neumonia entidadRes').sort('edad')];
            case 2:
                queryDocs = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res
                    .status(500)
                    .send({ error: 'Internal Server Error', message: error_5.message });
                return [2 /*return*/];
            case 4:
                res.send(queryDocs);
                return [2 /*return*/];
        }
    });
}); };
exports.getPatientsHospitalizedIntubated = getPatientsHospitalizedIntubated;
