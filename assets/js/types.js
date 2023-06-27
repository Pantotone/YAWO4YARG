// @ts-check

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

export {}