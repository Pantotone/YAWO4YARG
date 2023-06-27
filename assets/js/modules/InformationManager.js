// @ts-check

import { absolutePath, readFile } from "./Utils.js";
import * as Types from '../types.js';

/**
 * @typedef {Object} InformationManagerOptions
 * @property {string} [jsonPath]
 * @property {string[]} [selectedInstruments]
 */

/**
 * @classdesc Manager that fetch and handles the current song information, also has a notification system when a song changes to another classes.
 * Notice: This needs to run through a clock, triggering the InformationManager.update() function
 */
export class InformationManager {
    
    // Default settings

    /** @type {string} */
    jsonPath = "currentSong.json";
    
    /** @type {string[]} */
    selectedInstruments = [];

    
    // Internal
    /** @type {string} */
    _content = "";
    /** @type {Set<Function>} */
    _updateCallbacks = new Set();
    /** @type {Types.SourceIndex|undefined} */
    _baseSourceCache = undefined;
    /** @type {Types.SourceIndex|undefined} */
    _extraSourceCache = undefined;

    /**
     * @constructor
     * @param {InformationManagerOptions} [options] 
     */
    constructor(options) {
        this.applySettings(options);

        // Loading source index into memory
        [
            "https://raw.githubusercontent.com/YARC-Official/OpenSource/master/base/index.json",
            "https://raw.githubusercontent.com/YARC-Official/OpenSource/master/extra/index.json"
        ].forEach(jsonUrl => {

            fetch(jsonUrl)
            .then(res => res.json())
            .then(sourceIndex => {
                if(sourceIndex.type === "base") {
                    this._baseSourceCache = sourceIndex;
                } else {
                    this._extraSourceCache = sourceIndex;
                }
            });

        });
    }

    /**
     * This substitutes variables/settings in this class.
     * @param {InformationManagerOptions} [options] 
     */
    applySettings(options) {
        Object.assign(this, options);
    }

    /**
     * Checks if json (as string) changed compared to internal content;
     * @param {string} newUpdate 
     * @returns {boolean}
     */
    checkChanges(newUpdate) {
        const isUpdated = newUpdate !== this.content;
        
        if(isUpdated) {
            this.content = newUpdate
        }

        return isUpdated;
    }

    /**
     * Fetches the album art from the location provided by the JSON and returns in Base64 string.
     * @param {string} songLocation 
     */
    async getAlbumArt(songLocation) {
        const acceptedFileNames = ["album.png", "album.jpg", "album.jpeg"];
        const fetchers = acceptedFileNames.map(fileName => readFile(absolutePath(`${songLocation}/${fileName}`), {base64: true}));
        
        /** @type {string} */
        // @ts-ignore Typescript apparently doesn't have types for Promise.any, here's the docs anyway: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
        const base64File = await Promise.any(fetchers);

        return base64File;
    }

    /**
     * Get first available instrument on selectedInstruments list
     * @param {Types.PartDifficulties} songParts 
     */
    getSelectedInstrument(songParts) {
        const selected = this.selectedInstruments.find(instrument => songParts[instrument] > -1);
        return selected;
    }

    /**
     * Gets Source Icon URL from @YARC-Official/OpenSource repo indexes.
     * @param {string} sourceName 
     */
    getSourceIconURL(sourceName) {
        if(!this._baseSourceCache || !this._extraSourceCache) return;

        const baseSource = this._baseSourceCache.sources.find(source => source.ids.includes(sourceName));
        const extraSource = this._extraSourceCache.sources.find(source => source.ids.includes(sourceName));

        const sourceIndex = baseSource ? "base" : "extra";
        const source = baseSource || extraSource;
        if(source) {
            return `https://raw.githubusercontent.com/YARC-Official/OpenSource/master/${sourceIndex}/icons/${source.icon}.png`;
        }

        return "https://raw.githubusercontent.com/YARC-Official/OpenSource/master/base/icons/custom.png";
    }

    /**
     * Sends a notification to another subscribed classes about a song change.
     * @param {string} updated 
     */
    async _triggerUpdate(updated) {
        try {
            /** @type {Types.currentSong} */
            const jsonObj = JSON.parse(updated);

            const AlbumArt_Base64 = await this.getAlbumArt(jsonObj.Location);

            const instrument = this.getSelectedInstrument(jsonObj.PartDifficulties);

            const SelectedInstrument = instrument ? {
                instrument,
                difficulty: jsonObj.PartDifficulties[instrument]
            } : undefined

            const SourceIconURL = this.getSourceIconURL(jsonObj.Source);

            /** @type {Types.ExtendedCurrentSong} */
            const updatedJson = {...jsonObj, AlbumArt_Base64, SelectedInstrument, SourceIconURL};

            this._updateCallbacks.forEach(func => func(updatedJson));
        } catch (e) {
            this._updateCallbacks.forEach(func => func({}));
        }
    }

    /**
     * Adds a callback function to be notified when a song changes
     * @param {(currentSong: Types.ExtendedCurrentSong) => any} func 
     */
    onChange(func) {
        this._updateCallbacks.add(func);
    }

    /**
     * Loop function that is trigged by the global timer
     */
    async update() {
        const newUpdate = await readFile(absolutePath(this.jsonPath));
        const isUpdated = this.checkChanges(newUpdate);

        if(isUpdated) {
            this._triggerUpdate(newUpdate);
        }
    }
}