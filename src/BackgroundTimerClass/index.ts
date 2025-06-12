import {
  DeviceEventEmitter,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

const { RNBackgroundTimer } = NativeModules;
const Emitter = new NativeEventEmitter(RNBackgroundTimer);

class BackgroundTimer {
  uniqueId: number;
  callbacks: any;
  backgroundListener: any;
  backgroundTimer: any;

  constructor() {
    this.uniqueId = 0;
    this.callbacks = {};

    Emitter.addListener('backgroundTimer.timeout', (id) => {
      if (this.callbacks[id]) {
        const callbackById = this.callbacks[id];
        const { callback } = callbackById;
        if (!this.callbacks[id].interval) {
          delete this.callbacks[id];
        } else {
          RNBackgroundTimer.setTimeout(id, this.callbacks[id].timeout);
        }
        callback();
      }
    });
  }

  // Original API
  start(delay = 0) {
    return RNBackgroundTimer.start(delay);
  }

  stop() {
    return RNBackgroundTimer.stop();
  }

  runBackgroundTimer(callback: any, delay: number) {
    if (Platform === undefined || Platform.select === undefined) {
      throw new Error('Callback must be a function');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (typeof delay !== 'number') {
      throw new Error('Delay must be a number');
    }

    const EventFunction = Platform.select({
      ios: () => NativeAppEventEmitter,
      android: () => DeviceEventEmitter,
    });

    if (EventFunction === undefined) {
      throw new Error('EventFunction is not available on this platform.');
    }

    const EventEmitter = EventFunction();

    if (EventEmitter === undefined || EventEmitter.addListener === undefined) {
      throw new Error('EventEmitter is not available on this platform.');
    }

    this.start(0);

    this.backgroundListener = EventEmitter.addListener(
      'backgroundTimer',
      () => {
        this.backgroundListener.remove();
        this.backgroundClockMethod(callback, delay);
      }
    );
  }

  backgroundClockMethod(callback: any, delay: number) {
    this.backgroundTimer = this.setTimeout(() => {
      callback();
      this.backgroundClockMethod(callback, delay);
    }, delay);
  }

  stopBackgroundTimer() {
    this.stop();
    this.clearTimeout(this.backgroundTimer);
  }

  // New API, allowing for multiple timers
  setTimeout(callback: any, timeout: number) {
    this.uniqueId += 1;
    const timeoutId = this.uniqueId;
    this.callbacks[timeoutId] = {
      callback,
      interval: false,
      timeout,
    };
    RNBackgroundTimer.setTimeout(timeoutId, timeout);
    return timeoutId;
  }

  clearTimeout(timeoutId: number) {
    if (this.callbacks[timeoutId]) {
      delete this.callbacks[timeoutId];
      // RNBackgroundTimer.clearTimeout(timeoutId);
    }
  }

  setInterval(callback: any, timeout: number) {
    this.uniqueId += 1;
    const intervalId = this.uniqueId;
    this.callbacks[intervalId] = {
      callback,
      interval: true,
      timeout,
    };
    RNBackgroundTimer.setTimeout(intervalId, timeout);
    return intervalId;
  }

  clearInterval(intervalId: number) {
    if (this.callbacks[intervalId]) {
      delete this.callbacks[intervalId];
      // RNBackgroundTimer.clearTimeout(intervalId);
    }
  }
}

export default new BackgroundTimer();
