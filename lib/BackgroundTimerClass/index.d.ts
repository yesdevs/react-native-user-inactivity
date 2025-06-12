declare class BackgroundTimer {
    uniqueId: number;
    callbacks: any;
    backgroundListener: any;
    backgroundTimer: any;
    constructor();
    start(delay?: number): any;
    stop(): any;
    runBackgroundTimer(callback: any, delay: number): void;
    backgroundClockMethod(callback: any, delay: number): void;
    stopBackgroundTimer(): void;
    setTimeout(callback: any, timeout: number): number;
    clearTimeout(timeoutId: number): void;
    setInterval(callback: any, timeout: number): number;
    clearInterval(intervalId: number): void;
}
declare const _default: BackgroundTimer;
export default _default;
