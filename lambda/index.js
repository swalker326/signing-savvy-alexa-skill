"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
var Alexa = __importStar(require("ask-sdk-core"));
var ask_sdk_core_1 = require("ask-sdk-core");
var getSign_1 = require("./getSign");
var constants_1 = require("./constants");
var LaunchRequestHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle: function (handlerInput) {
        var speechText = 'Welcome to Show Sign, ask me how to sign a word or phrase';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Welcome to Show Sign, ask me how to sign a word or phrase', speechText)
            .getResponse();
    },
};
var SelectIntentHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.SelectIntent';
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = handlerInput.requestEnvelope.request;
                console.log("REQUEST HERE", request);
                //TODO Let user select list items with voice...stuck on getting data from user select.
                return [2 /*return*/, handlerInput.responseBuilder
                        .speak("Select Intent Fired")
                        .getResponse()];
            });
        });
    }
};
var TouchIntentHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var request, requestedWordUrl, requestedWord, videoData, signPhoto, speechText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = handlerInput.requestEnvelope.request;
                        requestedWordUrl = request.arguments[0];
                        requestedWord = request.arguments[1];
                        return [4 /*yield*/, (0, getSign_1.getSignVideo)(requestedWordUrl)];
                    case 1:
                        videoData = _a.sent();
                        return [4 /*yield*/, (0, getSign_1.getAssocatedImage)(requestedWord)];
                    case 2:
                        signPhoto = _a.sent();
                        speechText = "Here is the sign for " + requestedWord;
                        if (supportsAPL(handlerInput)) {
                            handlerInput.responseBuilder
                                .addDirective({
                                "type": "Alexa.Presentation.APL.RenderDocument",
                                "document": constants_1.CONSTANTS.APL.videoDoc,
                                datasources: {
                                    launchData: {
                                        properties: {
                                            requestedWord: requestedWord,
                                            videoUrl: videoData.videoUrl ? videoData.videoUrl : "",
                                            variantUrls: videoData.variantUrls ? videoData.variantUrls : "",
                                            backgroundUrl: signPhoto
                                        }
                                    }
                                }
                            })
                                .speak(speechText);
                        }
                        else {
                            handlerInput.responseBuilder
                                .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
                        }
                        return [2 /*return*/, handlerInput.responseBuilder
                                .getResponse()];
                }
            });
        });
    },
};
var ShowMeSignIntentHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'ShowMeSignIntent';
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var requestedWord, videoData, signPhoto, searchData, searchListItems, speechText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestedWord = Alexa.getSlotValue(handlerInput.requestEnvelope, "sign");
                        return [4 /*yield*/, (0, getSign_1.getSignVideo)(requestedWord)];
                    case 1:
                        videoData = _a.sent();
                        return [4 /*yield*/, (0, getSign_1.getAssocatedImage)(requestedWord)];
                    case 2:
                        signPhoto = _a.sent();
                        searchData = videoData.searchResults;
                        searchListItems = searchData ? searchData.map(function (listItem) {
                            return {
                                type: "AlexaTextListItem",
                                primaryText: listItem.wordDescription,
                                primaryAction: [
                                    {
                                        "type": "SendEvent",
                                        componentId: "wordList",
                                        arguments: [listItem.wordUrl, requestedWord]
                                    }
                                ]
                            };
                        }) : null;
                        speechText = searchListItems ? "There are a couple options for that word, which would you like?" : "Here is the sign for " + requestedWord;
                        if (supportsAPL(handlerInput)) {
                            handlerInput.responseBuilder
                                .addDirective({
                                "type": "Alexa.Presentation.APL.RenderDocument",
                                "document": videoData.searchResults ? constants_1.CONSTANTS.APL.wordSelect : constants_1.CONSTANTS.APL.videoDoc,
                                datasources: {
                                    launchData: {
                                        properties: {
                                            requestedWord: requestedWord,
                                            videoUrl: videoData.videoUrl ? videoData.videoUrl : "",
                                            variantUrls: videoData.variantUrls ? videoData.variantUrls : "",
                                            searchResults: searchData ? searchListItems : "",
                                            backgroundUrl: signPhoto
                                        }
                                    }
                                }
                            })
                                .speak(speechText);
                        }
                        else {
                            handlerInput.responseBuilder
                                .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
                        }
                        return [2 /*return*/, handlerInput.responseBuilder
                                .getResponse()];
                }
            });
        });
    },
};
var HelpIntentHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle: function (handlerInput) {
        var speechText = 'You can ask me how to sign I Love You';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('You can ask me the weather!', speechText)
            .getResponse();
    },
};
var CancelAndStopIntentHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle: function (handlerInput) {
        var speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Goodbye!', speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};
var SessionEndedRequestHandler = {
    canHandle: function (handlerInput) {
        var request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle: function (handlerInput) {
        console.log("Session ended with reason: ".concat(handlerInput.requestEnvelope.request.reason));
        return handlerInput.responseBuilder.getResponse();
    },
};
var ErrorHandler = {
    canHandle: function (handlerInput, error) {
        return true;
    },
    handle: function (handlerInput, error) {
        console.log("Error handled: ".concat(error.message));
        return handlerInput.responseBuilder
            .speak('Sorry, I don\'t understand your command. Please say it again.')
            .reprompt('Sorry, I don\'t understand your command. Please say it again.')
            .getResponse();
    }
};
var supportsAPL = function (handlerInput) {
    var supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
    console.log(supportedInterfaces);
    return !!supportedInterfaces['Alexa.Presentation.APL'];
};
exports.handler = ask_sdk_core_1.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, TouchIntentHandler, ShowMeSignIntentHandler, SelectIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
