/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
import {lambaForecast} from './services/alexaService';
const Alexa = require('alexa-sdk');
const phrases = {stop: "GoodBy", help: "You can ask me for todays, tomorrows, or a seven day forecast of near earth objects."};
const APP_ID:any = process.env.ALEXA_SKILL_ID;

const handlers = {
    'SevenDayForecast': function () {
        lambaForecast(0, 7, this);
    },
    'TodaysForecast': function () {
        lambaForecast(0, 0, this);
    },
    'TomorrowsForecast': function () {
        lambaForecast(1, 1, this);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', phrases.help);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', phrases.stop);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', phrases.stop);
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', phrases.stop);
    },
};

exports.handler = (event:any, context:any) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
