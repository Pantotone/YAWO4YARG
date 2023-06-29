/**
 * @classdesc Module to connect to Last.fm and download album art if album is not available.
 */
export class LastFmAlbumArtDownloader {

    /**
     * @param {string} apiKey - An API key for Last.fm (https://www.last.fm/api/account/create)
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Get a image url for a album from Last.fm
     * @param {string} artist 
     * @param {string} album 
     */
    async getImageUrl(artist, album) {
        if(!this.apiKey) return;
        const albumObject = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${artist}&album=${album}&format=json&api_key=${this.apiKey}`).then(res => res.json());

        /** @type {string|undefined} */
        const image = albumObject?.album?.image?.at(-1)?.["#text"];
        return image;
    }

}