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
 * @property {string} Name - Song Name
 * @property {string} NameNoParenthesis
 * @property {string} Artist - Artist name for this song
 * @property {string} Charter - Charter's name
 * @property {boolean} IsMaster
 * @property {string} Album - Album name for this song
 * @property {number} AlbumTrack
 * @property {number} PlaylistTrack
 * @property {string} Genre - Song Genre
 * @property {string} Year - Year the song was released
 * @property {number} SongLength - Song Length in milliseconds
 * @property {string} SongLengthTimeSpan
 * @property {number} PreviewStart - Where the song starts to play on preview (in milliseconds)
 * @property {string} PreviewStartTimeSpan
 * @property {number} PreviewEnd - Where the preview should end (in milliseconds)
 * @property {string} PreviewEndTimeSpan
 * @property {number} Delay
 * @property {string} LoadingPhrase - Phrase shown when chart is loading
 * @property {number} HopoThreshold
 * @property {boolean} EighthNoteHopo
 * @property {number} MultiplierNote
 * @property {string} Source - ID for Chart Source
 * @property {PartDifficulties} PartDifficulties
 * @property {number} BandDifficulty
 * @property {number} AvailableParts
 * @property {number} VocalParts
 * @property {string} Checksum
 * @property {string} NotesFile - Files where midi notes are store
 * @property {string} Location - Absolute Folder Path for chart
 */

/**
 * @typedef {Object} SelectedInstrument
 * @property {keyof PartDifficulties} instrument - First instrument from the list with available chart
 * @property {number} difficulty - Chart difficulty for the instrument selected
 */

/**
 * @typedef {currentSong & {AlbumArt_Base64?: string, SourceIconURL?: string, SelectedInstrument?: SelectedInstrument}} ExtendedCurrentSong
 */

/**
 * @typedef {Object} SourceIndex
 * @property {"base"|"extra"} type
 * @property {Source[]} sources
 */

/**
 * @typedef {Object} Source
 * @property {string[]} ids
 * @property {{[key: string]: string}} names - Names by language
 * @property {string} icon - Icon file
 * @property {string} type
 */

export {}