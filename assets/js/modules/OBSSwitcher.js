import * as Types from '../types.js';
import { SettingsLoader } from './SettingsLoader.js';

let latestSongName = "";

/**
 * Switches OBS scenes based if a song is being played.
 * @param {Types.ExtendedCurrentSong} currentSong 
 */
export async function OBSSwitcher(currentSong) {
    if(typeof window == "undefined" || typeof window.document == "undefined" || !("obsstudio" in window)) return;

    const settings = new SettingsLoader();

    const playingOBSSceneName = await settings.get("playingOBSSceneName");
    const notPlayingOBSSceneName = await settings.get("notPlayingOBSSceneName");

    if(currentSong?.Name) {
        
        if(!playingOBSSceneName) return;
        if(currentSong?.Name == latestSongName) return;

        try {
            // @ts-ignore
            window.obsstudio.setCurrentScene(playingOBSSceneName);
        } catch (e) {
            console.error(e);
        }
                
    } else {

        if(!notPlayingOBSSceneName) return;

        try {
            // @ts-ignore
            window.obsstudio.setCurrentScene(notPlayingOBSSceneName);
        } catch (e) {
            console.error(e);
        }

    }

    latestSongName = currentSong?.Name;
}