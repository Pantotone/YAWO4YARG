// @ts-check

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
     * @param {Array<Function>} functions 
     * @param {number} milliseconds
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
     * @param {Function} func 
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