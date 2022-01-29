import * as Alexa from 'ask-sdk-core';
import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from 'ask-sdk-core';
import {
    Response,
    SessionEndedRequest,
} from 'ask-sdk-model';
import { getSignVideo, getAssocatedImage } from './getSign';
import { CONSTANTS } from './constants'

const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Welcome to Show Sign, ask me how to sign a word or phrase';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Welcome to Show Sign, ask me how to sign a word or phrase', speechText)
            .getResponse();
    },
};
const SelectIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.SelectIntent';
    },
    async handle(handlerInput): Promise<Response> {
        const request = handlerInput.requestEnvelope.request
        console.log("REQUEST HERE", request);
        //TODO Let user select list items with voice...stuck on getting data from user select.
        return handlerInput.responseBuilder
            .speak("Select Intent Fired")
            .getResponse();
    }
}
const TouchIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const request = handlerInput.requestEnvelope.request
        // @ts-ignore TODO figure out a better way to handle request.arguments not existing on type from aws.
        const requestedWordUrl = request.arguments[0]
        //@ts-ignore TODO figure out a better way to handle request.arguments not existing on type from aws.
        const requestedWord = request.arguments[1]
        const videoData = await getSignVideo(requestedWordUrl)
        const signPhoto = await getAssocatedImage(requestedWord);
        const speechText = "Here is the sign for " + requestedWord
        if (supportsAPL(handlerInput)) {
            handlerInput.responseBuilder
                .addDirective({
                    "type": "Alexa.Presentation.APL.RenderDocument",
                    "document": CONSTANTS.APL.videoDoc,
                    datasources: {
                        launchData: {
                            properties: {
                                requestedWord,
                                videoUrl: videoData.videoUrl ? videoData.videoUrl : "",
                                variantUrls: videoData.variantUrls ? videoData.variantUrls : "",
                                backgroundUrl: signPhoto
                            }
                        }
                    }
                })
                .speak(speechText)
        } else {
            handlerInput.responseBuilder
                .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
        }
        return handlerInput.responseBuilder
            .getResponse();
    },

}

const ShowMeSignIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'ShowMeSignIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const requestedWord = Alexa.getSlotValue(handlerInput.requestEnvelope, "sign");
        const videoData = await getSignVideo(requestedWord)
        const signPhoto = await getAssocatedImage(requestedWord);
        const searchData = videoData.searchResults;
        const searchListItems = searchData ? searchData.map(listItem => {
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
            }
        }) : null
        const speechText = searchListItems ? "There are a couple options for that word, which would you like?" : "Here is the sign for " + requestedWord
        if (supportsAPL(handlerInput)) {
            handlerInput.responseBuilder
                .addDirective({
                    "type": "Alexa.Presentation.APL.RenderDocument",
                    "document": videoData.searchResults ? CONSTANTS.APL.wordSelect : CONSTANTS.APL.videoDoc,
                    datasources: {
                        launchData: {
                            properties: {
                                requestedWord,
                                videoUrl: videoData.videoUrl ? videoData.videoUrl : "",
                                variantUrls: videoData.variantUrls ? videoData.variantUrls : "",
                                searchResults: searchData ? searchListItems : "",
                                backgroundUrl: signPhoto
                            }
                        }
                    }
                })
                .speak(speechText)
        } else {
            handlerInput.responseBuilder
                .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
        }
        return handlerInput.responseBuilder
            .getResponse();
    },
};
const HelpIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'You can ask me how to sign I Love You';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('You can ask me the weather!', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Goodbye!', speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const SessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        console.log(`Session ended with reason: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(handlerInput: HandlerInput, error: Error): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I don\'t understand your command. Please say it again.')
            .reprompt('Sorry, I don\'t understand your command. Please say it again.')
            .getResponse();
    }
};

const supportsAPL = (handlerInput: HandlerInput) => {
    const { supportedInterfaces } = handlerInput.requestEnvelope.context.System.device;
    console.log(supportedInterfaces);
    return !!supportedInterfaces['Alexa.Presentation.APL'];
}

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        TouchIntentHandler,
        ShowMeSignIntentHandler,
        SelectIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
