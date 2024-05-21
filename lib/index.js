"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var useTimeout_1 = require("./useTimeout");
var defaultTimeForInactivity = 10000;
var defaultStyle = {
    flex: 1,
};
var UserInactivity = function (_a) {
    var children = _a.children, isActive = _a.isActive, onAction = _a.onAction, skipKeyboard = _a.skipKeyboard, style = _a.style, timeForInactivity = _a.timeForInactivity, timeoutHandler = _a.timeoutHandler;
    var actualStyle = style || defaultStyle;
    /**
     * If the user has provided a custom timeout handler, it is used directly,
     * otherwise it defaults to the default timeout handler (setTimeout/clearTimeout).
     */
    var actualTimeoutHandler = timeoutHandler || useTimeout_1.defaultTimeoutHandler;
    var timeout = timeForInactivity || defaultTimeForInactivity;
    /**
     * If the `isActive` prop is manually changed to `true`, call `resetTimerDueToActivity`
     * to reset the timer and set the current state to active until the timeout expires.
     * If the `isActive` is changed to `false`, nothing is done.
     * Note however that toggling `isActive` manually is discouraged for normal use.
     * It should only be used in those cases where React Native doesnt't seem to
     * inform the `PanResponder` instance about touch events, such as when tapping
     * over the keyboard.
     */
    var initialActive = isActive === undefined ? true : isActive;
    var _b = (0, react_1.useState)(initialActive), active = _b[0], setActive = _b[1];
    (0, react_1.useEffect)(function () {
        if (isActive) {
            resetTimerDueToActivity();
        }
    }, [isActive]);
    var _c = (0, react_1.useState)(Date.now()), date = _c[0], setDate = _c[1];
    /**
     * The timeout is reset when either `date` or `timeout` change.
     */
    var cancelTimer = (0, useTimeout_1.useTimeout)(function () {
        setActive(false);
        onAction(false);
        // @ts-ignore
    }, timeout, actualTimeoutHandler, [date, timeout]);
    var isFirstRender = (0, react_1.useRef)(true);
    /**
     * Triggers `onAction` each time the `active` state turns true
     * after the initial render.
     */
    (0, react_1.useEffect)(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            if (active) {
                onAction(true);
            }
        }
    }, [active]);
    /**
     * Resets the timer every time the keyboard appears or disappears,
     * unless skipKeyboard is true.
     */
    (0, react_1.useEffect)(function () {
        if (skipKeyboard) {
            return;
        }
        var hideEvent = react_native_1.Keyboard.addListener('keyboardDidHide', resetTimerDueToActivity);
        var showEvent = react_native_1.Keyboard.addListener('keyboardDidShow', resetTimerDueToActivity);
        // release event listeners on destruction
        return function () {
            hideEvent.remove();
            showEvent.remove();
        };
    }, []);
    /**
     * This method is called whenever a touch is detected. If no touch is
     * detected after `this.props.timeForInactivity` milliseconds, then
     * `this.state.inactive` turns to true.
     */
    function resetTimerDueToActivity() {
        cancelTimer();
        setActive(true);
        /**
         * Causes `useTimeout` to restart.
         */
        setDate(Date.now());
    }
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    function resetTimerForPanResponder( /* event: GestureResponderEvent */) {
        // const { identifier: touchID } = event.nativeEvent;
        resetTimerDueToActivity();
        return false;
    }
    /**
     * The PanResponder instance is initialized only once.
     */
    var _d = (0, react_1.useState)(react_native_1.PanResponder.create({
        onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
        onPanResponderTerminationRequest: resetTimerForPanResponder,
        onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
    })), panResponder = _d[0], _ = _d[1];
    return (<react_native_1.View style={actualStyle} collapsable={false} {...panResponder.panHandlers}>
      {children}
    </react_native_1.View>);
};
exports.default = UserInactivity;
