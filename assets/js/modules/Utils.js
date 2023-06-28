/**
 *  Util Functions
 */

/**
 * @typedef {Object} readFileOptions
 * @property {boolean} [base64] - If true, the return will be in Base64
 */
/**
 * Fetch local files
 * @param {string} path - File path to read
 * @param {readFileOptions} [options]
 * @returns {Promise<string>}
 */
export async function readFile(path, options) {
    if(typeof window !== "undefined" && typeof window.document !== "undefined") {
        return readFileOBS(path, options);
    } 
    
    return readFileNode(path, options);
}

/**
 * @param {string} path - File path to read
 * @param {readFileOptions} [options]
 * @returns {Promise<string>}
 */
async function readFileOBS(path, options) {
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("GET", path);
        request.responseType = options?.base64 ? "blob" : "text";

        // Text response       
        request.onloadend = () => {
            if(options?.base64) return;
            if(request.status === 200 || request.status === 0) {
                resolve(request.responseText);
            };
        }

        // Base64/Blob response
        request.onload = () => {
            if(!options?.base64) return;
            const file = new FileReader();

            file.onloadend = () => {
                if(!file.result) return;
                resolve(file.result.toString());
            }

            file.readAsDataURL(request.response);
        }

        request.send();
    });
}

/**
 * @param {string} path - File path to read
 * @param {readFileOptions} [options]
 * @returns {Promise<string>}
 */
async function readFileNode(path, options) {
    const fs = await import("fs/promises");
    return await fs.readFile(path, { encoding: options?.base64 ? "base64url" : "utf8"});
}

/**
 * 
 * @param {HTMLElement} element - HTMLElement to set attribute
 * @param {string} key - Atrribute name (example: type from "data-type")
 * @param {string} [value] - Attribute value
 */
export function setAttributeToElement(element, key, value) {
    if(!element || !key) throw new Error("setAttributeToElement: Missing element/key");

    if(value) {
        element.dataset[key] = value
    } else {
        element.removeAttribute(`data-${key}`);
    }
}

/**
 * Generates a URL using http://absolute protocol for local files.
 * @param {string} path - Absolute local path
 */
export function absolutePath(path) {
    if(typeof window !== "undefined" && typeof window.document !== "undefined") {
        return `http://absolute/${path}`;
    } 

    return path;
}
