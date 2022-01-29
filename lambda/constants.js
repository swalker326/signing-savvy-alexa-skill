"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
var videoDoc_json_1 = __importDefault(require("./documents/videoDoc.json"));
var wordSelectDoc_json_1 = __importDefault(require("./documents/wordSelectDoc.json"));
exports.CONSTANTS = {
    APL: {
        videoDoc: videoDoc_json_1.default,
        wordSelect: wordSelectDoc_json_1.default
    }
};
