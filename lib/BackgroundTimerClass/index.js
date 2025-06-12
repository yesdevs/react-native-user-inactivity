"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var RNBackgroundTimer = react_native_1.NativeModules.RNBackgroundTimer;
var Emitter = new react_native_1.NativeEventEmitter(RNBackgroundTimer);
var BackgroundTimer = /** @class */ (function () {
    function BackgroundTimer() {
        var _this = this;
        this.uniqueId = 0;
        this.callbacks = {};
        Emitter.addListener('backgroundTimer.timeout', function (id) {
            if (_this.callbacks[id]) {
                var callbackById = _this.callbacks[id];
                var callback = callbackById.callback;
                if (!_this.callbacks[id].interval) {
                    delete _this.callbacks[id];
                }
                else {
                    RNBackgroundTimer.setTimeout(id, _this.callbacks[id].timeout);
                }
                callback();
            }
        });
    }
    // Original API
    BackgroundTimer.prototype.start = function (delay) {
        if (delay === void 0) { delay = 0; }
        return RNBackgroundTimer.start(delay);
    };
    BackgroundTimer.prototype.stop = function () {
        return RNBackgroundTimer.stop();
    };
    BackgroundTimer.prototype.runBackgroundTimer = function (callback, delay) {
        var _this = this;
        if (react_native_1.Platform === undefined || react_native_1.Platform.select === undefined) {
            throw new Error('Callback must be a function');
        }
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        if (typeof delay !== 'number') {
            throw new Error('Delay must be a number');
        }
        var EventFunction = react_native_1.Platform.select({
            ios: function () { return react_native_1.NativeAppEventEmitter; },
            android: function () { return react_native_1.DeviceEventEmitter; },
        });
        if (EventFunction === undefined) {
            throw new Error('EventFunction is not available on this platform.');
        }
        var EventEmitter = EventFunction();
        if (EventEmitter === undefined || EventEmitter.addListener === undefined) {
            throw new Error('EventEmitter is not available on this platform.');
        }
        this.start(0);
        this.backgroundListener = EventEmitter.addListener('backgroundTimer', function () {
            _this.backgroundListener.remove();
            _this.backgroundClockMethod(callback, delay);
        });
    };
    BackgroundTimer.prototype.backgroundClockMethod = function (callback, delay) {
        var _this = this;
        this.backgroundTimer = this.setTimeout(function () {
            callback();
            _this.backgroundClockMethod(callback, delay);
        }, delay);
    };
    BackgroundTimer.prototype.stopBackgroundTimer = function () {
        this.stop();
        this.clearTimeout(this.backgroundTimer);
    };
    // New API, allowing for multiple timers
    BackgroundTimer.prototype.setTimeout = function (callback, timeout) {
        this.uniqueId += 1;
        var timeoutId = this.uniqueId;
        this.callbacks[timeoutId] = {
            callback: callback,
            interval: false,
            timeout: timeout,
        };
        RNBackgroundTimer.setTimeout(timeoutId, timeout);
        return timeoutId;
    };
    BackgroundTimer.prototype.clearTimeout = function (timeoutId) {
        if (this.callbacks[timeoutId]) {
            delete this.callbacks[timeoutId];
            // RNBackgroundTimer.clearTimeout(timeoutId);
        }
    };
    BackgroundTimer.prototype.setInterval = function (callback, timeout) {
        this.uniqueId += 1;
        var intervalId = this.uniqueId;
        this.callbacks[intervalId] = {
            callback: callback,
            interval: true,
            timeout: timeout,
        };
        RNBackgroundTimer.setTimeout(intervalId, timeout);
        return intervalId;
    };
    BackgroundTimer.prototype.clearInterval = function (intervalId) {
        if (this.callbacks[intervalId]) {
            delete this.callbacks[intervalId];
            // RNBackgroundTimer.clearTimeout(intervalId);
        }
    };
    return BackgroundTimer;
}());
exports.default = new BackgroundTimer();
