import { absolutePath, readFile } from "./Utils.js";
import { LastFmAlbumArtDownloader } from "./LastFmAlbumArtDownloader.js";
import * as Types from '../types.js';

/**
 * @typedef {Object} InformationManagerOptions
 * @property {string} [jsonPath] - "Current Song JSON File Path" from settings
 * @property {string[]} [selectedInstruments] - Instrument that will show on the widget
 * @property {LastFmAlbumArtDownloader} [albumArtDownloader] - Album Art Downloader for fallback when chart doesn't have an album art.
 */

/**
 * @classdesc Manager that fetch and handles the current song information, also has a notification system when a song changes to another classes.
 * Notice: This needs to run through a clock, triggering the InformationManager.update() function
 */
export class InformationManager {
    
    // Default settings

    /** @type {string} - "Current Song JSON File Path" from settings */
    jsonPath = "currentSong.json";
    
    /** @type {(keyof Types.PartDifficulties)[]} - Instrument that will show on the widget */
    selectedInstruments = [];

    /** @type {LastFmAlbumArtDownloader|undefined} */
    albumArtDownloader = undefined;

    // Internal
    /** @type {string} - Cache from JSON that will be used to compare if has changes */
    _content = "";
    /** @type {Set<Function>} - Callbacks to be called when a song update happens */
    _updateCallbacks = new Set();
    /** @type {Types.SourceIndex|undefined} - Cache to YARC-Official/OpenSource Base Icons */
    _baseSourceCache = undefined;
    /** @type {Types.SourceIndex|undefined} - Cache to YARC-Official/OpenSource Base Icons */
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
        const isUpdated = newUpdate !== this._content;
        
        if(isUpdated) {
            this._content = newUpdate
        }

        return isUpdated;
    }

    /**
     * Fetches the album art from the location provided by the JSON and returns in Base64 string.
     * @param {string} songLocation - Location for chart folder, provided by Song JSON
     */
    async getAlbumArt(songLocation) {
        const acceptedFileNames = ["album.png", "album.jpg", "album.jpeg"];
        const fetchers = acceptedFileNames.map(fileName => readFile(absolutePath(`${songLocation}/${fileName}`), {base64: true}));
        
        try {
            const base64File = await Promise.any(fetchers);
            return base64File;
        } catch(e) {
            console.error("No album arts were found.", e);
        }
    }

    /**
     * Get first available instrument on selectedInstruments list
     * @param {Types.PartDifficulties} songParts - Difficulty levels for every instrument on the chart
     */
    getSelectedInstrument(songParts) {
        if(!songParts) return;

        const selected = this.selectedInstruments.find(instrument => songParts[instrument] > -1);
        return selected;
    }

    /**
     * Gets Source Icon URL from @YARC-Official/OpenSource repo indexes.
     * @param {string} sourceId - The source ID provided by the current song
     */
    getSourceIconURL(sourceId) {
        if(!this._baseSourceCache || !this._extraSourceCache) return;

        const baseSource = this._baseSourceCache.sources.find(source => source.ids.includes(sourceId));
        const extraSource = this._extraSourceCache.sources.find(source => source.ids.includes(sourceId));

        const sourceIndex = baseSource ? "base" : "extra";
        const source = baseSource || extraSource;
        if(source) {
            return `https://raw.githubusercontent.com/YARC-Official/OpenSource/master/${sourceIndex}/icons/${source.icon}.png`;
        }

        return "https://raw.githubusercontent.com/YARC-Official/OpenSource/master/base/icons/custom.png";
    }

    /**
     * Sends a notification to another subscribed classes about a song change.
     * @param {string} updated - Updated current song JSON as string.
     */
    async _triggerUpdate(updated) {
        try {
            /** @type {Types.currentSong} */
            const jsonObj = JSON.parse(updated);

            const AlbumArtURL = await this.getAlbumArt(jsonObj.Location) || await this.albumArtDownloader?.getImageUrl(jsonObj.Artist, jsonObj.Album);

            const instrument = this.getSelectedInstrument(jsonObj.PartDifficulties);

            /** @type {Types.SelectedInstrument[] | undefined} */
            const SelectedInstruments = instrument ? [{
                active: true,
                instrument,
                difficulty: jsonObj.PartDifficulties[instrument]
            }] : undefined

            const SourceIconURL = this.getSourceIconURL(jsonObj.Source);

            /** @type {Types.ExtendedCurrentSong} */
            const updatedJson = { AlbumArtURL, SelectedInstruments, SourceIconURL, ...jsonObj };

            this._updateCallbacks.forEach(func => func(updatedJson));
        } catch (e) {
            this._updateCallbacks.forEach(func => func({}));
        }
    }

    /**
     * Adds a callback function to be notified when a song changes
     * @param {(currentSong: Types.ExtendedCurrentSong) => any} func - Callback Function to be called when there's a song change
     */
    onChange(func) {
        this._updateCallbacks.add(func);
    }

    /**
     * Checks if the JSON is from RB3DX
     * @param {string} raw 
     * @returns {boolean}
     */
    checkIfRB3DX(raw) {
        return raw[0] === "\"";
    }

    /**
     * Fix RB3DX JSON to a valid JSON.
     * @param {string} raw - Raw JSON content from RB3DX
     * @returns {string} - Processed JSON
     */
    fixRB3DX(raw) {
        const processed = raw
        .replace(/"/g, "") // Remove previous double-quotes
        .replace(/\\q/g, "\"") // Replace \q to an double-quote
        .replace(/":",/g, "\":\"\","); // Fix non-closed double-quotes ("Playlist":",) -> ("Playlist":"",)

        return processed;
    }

    /**
     * Loop function that is triggered by the global timer
     */
    async update() {
        const newUpdate = await readFile(absolutePath(this.jsonPath));
        const isUpdated = this.checkChanges(newUpdate);

        if(isUpdated) {
            this._triggerUpdate(this.checkIfRB3DX(newUpdate) ? this.fixRB3DX(newUpdate) : newUpdate);
        }
    }
}

export default InformationManager;