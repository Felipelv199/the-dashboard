"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var uri = process.env.MONGOOSE_URI_DEV;
if (typeof uri !== 'undefined') {
    mongoose_1.default.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    var db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () { return console.log('Database connected'); });
}
else {
    console.log('"URI" not found inside .env file');
}
