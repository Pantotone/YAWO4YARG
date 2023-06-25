// @ts-check
'use strict';

/**
 * @name YAWO4YARG - Yet Another Widget Overlay for Yet Another Rhythm Game
 * @author Pantotone
 * @githubRepo https://github.com/Pantotone/YAWO4YARG
 */

class SettingsLoader {

    /** @type {string} */
    settingsRootPath = "settings";
    /** @type {Map<string, any>} */
    settings = new Map();

    constructor() {
        this.load();
    }
    
    /**
     * Get setting, if not available it'll perform a reload and return setting if available.
     * @param {string} key 
     */
    async get(key) {
        const isAvailable = this.settings.has(key);
        
        if(!isAvailable) {
            await this.load();    
        }

        return this.settings.get(key);
    }

    /**
     * Perform all loads and save to internal settings cache.
     */
    async load() {
        const loaders = [
            this.loadAsString("CurrentSongFilePath.txt", "currentSongFilePath"),
            this.loadAsString("DisplaySmallIcon.txt", "displaySmallIcon"),
            this.loadAsArray("Instrument.txt", "selectedInstruments")
        ];
    
        return await Promise.all(loaders); 
    }

    /**
     * Loads text from setting file and adds to the settings list as string.
     * @param {string} path 
     * @param {string} key 
     */
    async loadAsString(path, key) {
        try {
            const raw = await readFile(`${this.settingsRootPath}/${path}`);
            this.settings.set(key, raw.trim());
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Loads text from setting file, 
     * @param {string} path 
     * @param {string} key 
     * @param {string} [separator]
     */
    async loadAsArray(path, key, separator = ",") {
        try {
            const raw = await readFile(`${this.settingsRootPath}/${path}`);
            const array = raw.split(separator).map(word => word.trim());

            this.settings.set(key, array);
        } catch (e) {
            console.error(e);
        }
    }

}

/**
 * @classdesc Clock that triggers the main updates through the code
 * To add new functions, use the constructor or MainClock.add(function)
 */
class MainClock {

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

/**
 * @typedef {Object} InformationManagerOptions
 * @property {string} [jsonPath]
 * @property {string[]} [selectedInstruments]
 */

/**
 * @classdesc Manager that fetch and handles the current song information, also has a notification system when a song changes to another classes.
 * Notice: This needs to run through a clock, triggering the InformationManager.update() function
 */
class InformationManager {
    
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
    /** @type {SourceIndex|undefined} */
    _baseSourceCache = undefined;
    /** @type {SourceIndex|undefined} */
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
        const fetchers = acceptedFileNames.map(fileName => readFile(`${songLocation}/${fileName}`, {base64: true}));
        
        /** @type {string} */
        // @ts-ignore Typescript apparently doesn't have types for Promise.any, here's the docs anyway: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
        const base64File = await Promise.any(fetchers);

        return base64File;
    }

    /**
     * Get first available instrument on selectedInstruments list
     * @param {PartDifficulties} songParts 
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
            /** @type {currentSong} */
            const jsonObj = JSON.parse(updated);

            const AlbumArt_Base64 = await this.getAlbumArt(jsonObj.Location);

            const instrument = this.getSelectedInstrument(jsonObj.PartDifficulties);

            const SelectedInstrument = instrument ? {
                instrument,
                difficulty: jsonObj.PartDifficulties[instrument]
            } : undefined

            const SourceIconURL = this.getSourceIconURL(jsonObj.Source);

            /** @type {ExtendedCurrentSong} */
            const updatedJson = {...jsonObj, AlbumArt_Base64, SelectedInstrument, SourceIconURL};

            this._updateCallbacks.forEach(func => func(updatedJson));
        } catch (e) {
            this._updateCallbacks.forEach(func => func({}));
        }
    }

    /**
     * Adds a callback function to be notified when a song changes
     * @param {(currentSong: ExtendedCurrentSong) => any} func 
     */
    onChange(func) {
        this._updateCallbacks.add(func);
    }

    /**
     * Loop function that is trigged by the global timer
     */
    async update() {
        const newUpdate = await readFile(this.jsonPath);
        const isUpdated = this.checkChanges(newUpdate);

        if(isUpdated) {
            this._triggerUpdate(newUpdate);
        }
    }
}

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
class SongRender {

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
     * @param {ExtendedCurrentSong} [currentSong]
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
async function readFile(path, options) {
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

        request.send(null);
    });
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} key 
 * @param {string} [value] 
 */
function setAttributeToElement(element, key, value) {
    if(!element || !key) throw new Error("setAttributeToElement: Missing element/key");

    if(value) {
        element.dataset[key] = value
    } else {
        element.removeAttribute(`data-${key}`);
    }
}

/**
 *  Type Definitions
 */

/**
 * @typedef {Object} PartDifficulties
 * @property {number} GUITAR
 * @property {number} GUITAR_COOP
 * @property {number} REAL_GUITAR
 * @property {number} RHYTHM
 * @property {number} BASS
 * @property {number} REAL_BASS
 * @property {number} DRUMS
 * @property {number} GH_DRUMS
 * @property {number} REALDRUMS
 * @property {number} KEYS
 * @property {number} REAL_KEYS
 * @property {number} VOCALS
 * @property {number} HARMONY
 */

/** 
 * @typedef {Object} currentSong
 * @property {string} Playlist
 * @property {string} SubPlaylist
 * @property {boolean} IsModChart
 * @property {boolean} HasLyrics
 * @property {number} VideoStartOffset
 * @property {string} CacheRoot
 * @property {number} DrumType
 * @property {string} Name
 * @property {string} NameNoParenthesis
 * @property {string} Artist
 * @property {string} Charter
 * @property {boolean} IsMaster
 * @property {string} Album
 * @property {number} AlbumTrack
 * @property {number} PlaylistTrack
 * @property {string} Genre
 * @property {string} Year
 * @property {number} SongLength
 * @property {string} SongLengthTimeSpan
 * @property {number} PreviewStart
 * @property {string} PreviewStartTimeSpan
 * @property {number} PreviewEnd
 * @property {string} PreviewEndTimeSpan
 * @property {number} Delay
 * @property {string} LoadingPhrase
 * @property {number} HopoThreshold
 * @property {boolean} EighthNoteHopo
 * @property {number} MultiplierNote
 * @property {string} Source
 * @property {PartDifficulties} PartDifficulties
 * @property {number} BandDifficulty
 * @property {number} AvailableParts
 * @property {number} VocalParts
 * @property {string} Checksum
 * @property {string} NotesFile
 * @property {string} Location
 */

/**
 * @typedef {Object} SelectedInstrument
 * @property {string} instrument
 * @property {number} difficulty
 */

/**
 * @typedef {currentSong & {AlbumArt_Base64?: string, SourceIconURL?: string, SelectedInstrument?: SelectedInstrument}} ExtendedCurrentSong
 */

/**
 * @typedef {Object} SourceIndex
 * @property {string} type
 * @property {Source[]} sources
 */

/**
 * @typedef {Object} Source
 * @property {string[]} ids
 * @property {{[key: string]: string}} names
 * @property {string} icon
 * @property {string} type
 */