"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalized = exports.decease = exports.patient = exports.age = exports.graphs = exports.uploadFile = exports.home = void 0;
var home = function (request, response) {
    response.render('index', {});
};
exports.home = home;
var uploadFile = function (request, response) {
    response.render('upload', {});
};
exports.uploadFile = uploadFile;
var graphs = function (request, response) {
    response.render('graphs', {});
};
exports.graphs = graphs;
var age = function (request, response) {
    var _a = request.query, firstAge = _a.firstAge, lastAge = _a.lastAge;
    response.render('graphs/age', {
        firstAge: firstAge ? firstAge : 0,
        lastAge: lastAge ? lastAge : 100,
    });
};
exports.age = age;
var patient = function (request, response) {
    response.render('graphs/patient', {});
};
exports.patient = patient;
var decease = function (request, response) {
    response.render('graphs/decease', {});
};
exports.decease = decease;
var hospitalized = function (request, response) {
    response.render('graphs/hospitalized', {});
};
exports.hospitalized = hospitalized;
