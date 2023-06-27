// @ts-check

/**
 *  Util Functions
 */

/**
 * @typedef {Object} readFileOptions
 * @property {boolean} [base64]
 */
/**
 * Fetch local files
 * @param {string} path 
 * @param {readFileOptions} [options]
 * @returns {Promise<string>}
 */
export async function readFile(path, options) {
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
 * 
 * @param {HTMLElement} element 
 * @param {string} key 
 * @param {string} [value] 
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
 * @param {string} path 
 */
export function absolutePath(path) {
    return `http://absolute/${path}`;
}