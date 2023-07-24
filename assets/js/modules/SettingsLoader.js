import { readFile } from "./Utils.js";

/**
 * @classdesc Manager that loads and process setting files for the widget.
 */
export class SettingsLoader {

    /** @type {string} */
    settingsRootPath = "settings";
    /** @type {Map<string, any>} */
    settings = new Map();

    /**
     * @param {string} [settingsPath] - Root folder of settings files
     */
    constructor(settingsPath) {
        if(settingsPath) {
            this.settingsRootPath = settingsPath;
        }
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
            this.loadAsString("PlayingOBSSceneName.txt", "playingOBSSceneName"),
            this.loadAsString("NotPlayingOBSSceneName.txt", "notPlayingOBSSceneName"),
            this.loadAsString("DisplaySmallIcon.txt", "displaySmallIcon"),
            this.loadAsString("TextAlignment.txt", "textAlignment"),
            this.loadAsString("LastFmAPIKey.txt", "lastFmAPIKey"),
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
            const processed = raw.trim();
            if(processed.length > 0) {
                this.settings.set(key, raw.trim());
            };
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