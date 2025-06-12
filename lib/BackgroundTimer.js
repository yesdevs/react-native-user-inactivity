"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBackgroundTimer = void 0;
var tslib_1 = require("tslib");
var BackgroundTimerClass_1 = tslib_1.__importDefault(require("./BackgroundTimerClass"));
/**
 * defaultBackgroundTimer implements the TimeoutHandler interface with the native timer
 * functions available in the 'react-native-background-timer' package.
 * This timer works in foreground as well as background, and should overcome
 * the standard setTimeout/clearTimeout shortcomings.
 */
exports.defaultBackgroundTimer = {
    clearTimeout: function (_) {
        BackgroundTimerClass_1.default.stopBackgroundTimer();
    },
    setTimeout: function (fn, timeout) {
        BackgroundTimerClass_1.default.runBackgroundTimer(fn, timeout);
    },
};
exports.default = exports.defaultBackgroundTimer;
