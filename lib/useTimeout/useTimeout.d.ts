import { TimeoutHandler } from './TimeoutHandler';
export declare type CancelTimer = () => void;
export declare type UseTimeout = <T>(callback: () => void, timeout: number, timeHandler: TimeoutHandler<T>, deps?: unknown[]) => CancelTimer;
/**
 * useTimeout is a React.js custom hook that sets a leak-safe timeout and returns
 * a function to cancel it before the timeout expires.
 * It's composed of two other native hooks, useRef and useEffect.
 * It requires a custom way of setting a timeout and clearing it, expressed as an implementation
 * of the generic TimeoutHandler<T> interface.
 * The timer is restarted every time an item in `deps` changes.
 * If a new callback is given to the hook before the previous timeout expires,
 * only the new callback will be executed at the moment the timeout expires.
 * When the hook receives a new callback, the timeout isn't reset.
 *
 * @param callback the function to be executed after the timeout expires
 * @param timeout the number of milliseconds after which the callback should be triggered
 * @param timeHandler TimeoutHandler instance that's used to set and clear the timeout
 * @param deps useEffect dependencies that should cause the timeout to be reset
 * @return function to cancel the timer before the timeout expires
 */
export declare const useTimeout: UseTimeout;
