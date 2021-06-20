"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
require("dotenv/config");
require("./db");
app_1.default.listen(process.env.PORT, function () {
    return console.log('Litening on port', process.env.PORT);
});
