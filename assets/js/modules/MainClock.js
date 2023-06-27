/**
 * @classdesc Clock that triggers the main updates through the code
 * To add new functions, use the constructor or MainClock.add(function)
 */
export class MainClock {

    /** 
     * Functions that will be in sync with the clock
     * @type {Set<Function>} 
    */
    functions = new Set();

    /**
     * @param {Array<Function>} functions - Array of Functions that will be in sync with the clock
     * @param {number} [milliseconds] - (optional) Time in milliseconds for the clock to run
     */
    constructor(functions, milliseconds = 1000) {
        functions.forEach(item => {
            if(typeof item === "function") {
                this.functions.add(item);
            }
        });

        setInterval(this.clock.bind(this), milliseconds);
    }

    /**
     * Adds a function to be called in sync with the clock
     * @param {Function} func - Callback Function
     */
    add(func) {
        this.functions.add(func);
    }

    /**
     * Calls every function subscribed
     */
    clock() {
        this.functions.forEach(item => {
            try {
                item();
            } catch (e) {
                console.error(e);
            }
        });
    }
}