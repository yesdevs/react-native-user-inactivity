import { TimeoutHandler } from './TimeoutHandler';
/**
 * defaultTimeoutHandler implements the TimeoutHandler interface with the usual timer
 * functions available in browsers and in React Native, i.e. `setTimeout` and `clearTimeout`.
 */
export declare const defaultTimeoutHandler: TimeoutHandler<number>;
