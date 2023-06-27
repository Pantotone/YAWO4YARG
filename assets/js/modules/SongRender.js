// @ts-check

import * as Types from "../types.js";
import { setAttributeToElement } from "./Utils.js";

/**
 * @typedef {Object} SongRenderOptions
 * @property {HTMLElement|null} mainContainer
 * @property {HTMLElement|null} songNameContainer
 * @property {HTMLElement|null} artistNameContainer
 * @property {HTMLElement|null} albumArtElement
 * @property {HTMLElement|null} instrumentIconElement
 * @property {HTMLElement|null} difficultyRingElement
 */

/**
 * @classdesc Receives a song through the SongRender.handleEvent(currentSong) and updates the DOM
 */
export class SongRender {

    /** @type {HTMLElement|null} */
    mainContainer = null;
    /** @type {HTMLElement|null} */
    songNameContainer = null;
    /** @type {HTMLElement|null} */
    artistNameContainer = null;
    /** @type {HTMLElement|null} */
    albumArtElement = null;
    /** @type {HTMLElement|null} */
    instrumentIconElement = null;
    /** @type {HTMLElement|null} */
    difficultyRingElement = null;
    /** @type {HTMLElement|null} */
    sourceIconElement = null;
    

    /**
     * @param {SongRenderOptions} [options] 
     */
    constructor(options) {
        if(!options) throw new Error("No options provided");
        this.applySettings(options);
    }

    /**
     * Changes settings inside class
     * @param {SongRenderOptions} options 
     */
    applySettings(options) {
        Object.assign(this, options);
    }

    /** @param {string} artistName */
    setArtistName(artistName) {
        const textNode = new Text(artistName);
        this.artistNameContainer?.replaceChildren(textNode);
    }

    /** @param {string} songName */
    setSongName(songName) {
        const textNode = new Text(songName);
        this.songNameContainer?.replaceChildren(textNode);
    }

    /** @param {string} [imageURL] */
    setAlbumArt(imageURL) {
        if(this.albumArtElement instanceof HTMLImageElement) {
            this.albumArtElement.src = imageURL || "";
        };
    }

    /**
     * @param {string} [instrument] 
     */
    setInstrumentIcon(instrument) {
        if(!this.instrumentIconElement) return;
        setAttributeToElement(this.instrumentIconElement, "type", instrument);
    }

    /**
     * @param {number} [difficulty]
     */
    setDifficultyRing(difficulty) {
        if(!this.difficultyRingElement) return;
        setAttributeToElement(this.difficultyRingElement, "difficulty", difficulty?.toString());
    }

    /** @param {string} [iconURL] */
    setSourceIcon(iconURL) {
        if(this.sourceIconElement instanceof HTMLImageElement) {
            this.sourceIconElement.src = iconURL || "";
        };
    }

    /**
     * Receives the updated current song and performs the changes inside the DOM
     * @param {Types.ExtendedCurrentSong} [currentSong]
     */
    handleEvent(currentSong) {
        if(!this.mainContainer) return;
        const isPlaying = !!currentSong?.Name;
        this.mainContainer.dataset.playing = `${isPlaying}`;

        if(!currentSong || !isPlaying) return;
        this.setSongName(currentSong.Name);
        this.setArtistName(currentSong.Artist);
        this.setAlbumArt(currentSong.AlbumArt_Base64);
        this.setSourceIcon(currentSong.SourceIconURL);

        const instrumentType = currentSong.SelectedInstrument;
        this.setInstrumentIcon(instrumentType?.instrument);
        this.setDifficultyRing(instrumentType?.difficulty);
    }
    
}
