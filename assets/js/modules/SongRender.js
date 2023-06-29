import * as Types from "../types.js";
import { setAttributeToElement } from "./Utils.js";

/**
 * @typedef {Object} SongRenderOptions
 * @property {HTMLElement|null} [mainContainer] - The main widget element
 * @property {HTMLElement|null} [songNameContainer] - HTMLElement where current song name will be inserted.
 * @property {HTMLElement|null} [artistNameContainer] - HTMLElement where current artist name will be inserted.
 * @property {HTMLElement|null} [albumArtElement] - <image> tag which the album art will be set.
 * @property {HTMLElement|null} [sourceIconElement] - <image> tag which the source icon will be set.
 * @property {HTMLElement|null} [instrumentIconElement] - Element where instrument icon is set.
 * @property {HTMLElement|null} [difficultyRingElement] - Element where difficulty ring is set.
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

    /** @param {string} [imageURL] - URL or Base64 from the album image */
    setAlbumArt(imageURL) {
        if(this.albumArtElement instanceof HTMLImageElement) {
            this.albumArtElement.src = imageURL || "";
        };
    }

    /**
     * @param {string} [instrument] - Instrument to be selected on screen
     */
    setInstrumentIcon(instrument) {
        if(!this.instrumentIconElement) return;
        setAttributeToElement(this.instrumentIconElement, "type", instrument);
    }

    /**
     * @param {number} [difficulty] - Difficulty to be set on the ring element
     */
    setDifficultyRing(difficulty) {
        if(!this.difficultyRingElement) return;
        setAttributeToElement(this.difficultyRingElement, "difficulty", difficulty?.toString());
    }

    /** @param {string} [iconURL] - URL from the source icon image */
    setSourceIcon(iconURL) {
        if(this.sourceIconElement instanceof HTMLImageElement) {
            this.sourceIconElement.src = iconURL || "";
        };
    }

    /**
     * Receives the updated current song and performs the changes inside the DOM
     * @param {Types.ExtendedCurrentSong} [currentSong] - Object containing informations from the new current song
     */
    handleEvent(currentSong) {
        if(!this.mainContainer) return;
        const isPlaying = !!currentSong?.Name;
        this.mainContainer.dataset.playing = `${isPlaying}`;

        if(!currentSong || !isPlaying) return;
        this.setSongName(currentSong.Name);
        this.setArtistName(currentSong.Artist);
        this.setAlbumArt(currentSong.AlbumArtURL);
        this.setSourceIcon(currentSong.SourceIconURL);

        const instrumentType = currentSong.SelectedInstruments?.find(player => player.active);
        this.setInstrumentIcon(instrumentType?.instrument);
        this.setDifficultyRing(instrumentType?.difficulty);
    }
    
}
