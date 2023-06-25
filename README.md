## 📺 **YAWO4YARG** - *Yet Another Widget Overlay for Yet Another Rhythm Game*

#### A Widget overlay compatible with [OBS](https://obsproject.com) that shows the current song with album artwork and difficulty being played on [Yet Another Rhythm Game](https://github.com/YARC-Official/YARG).


---

![Banner](.github/Banner.gif)

---

# 📥 How to install

1. Download and extract this repository. You can do by [clicking here](https://github.com/Pantotone/YAWO4YARG/archive/refs/heads/main.zip).

2. Copy where the `currentSong.json` is stored.
    
    2.1. Open YARG

    2.2. Go to Settings

    2.3. In File Managment Section, click `Copy Current Song JSON File Path`

3. On the extracted widget folder, go to `settings` folder, open `CurrentSongFilePath.txt` with a text or code editor, paste inside and save it.

4. Create a new Browser Source on your OBS.

    - On the browser settings, mark "Local file", and locate the extracted widget folder and select `YARG Widget.html`
    - Set the width as `1920` and height as `260`. If it's too big, you can resize the widget on your canvas after you add it.

5. **(optional)** Change current instrument on widget.

    As for now, the widget isn't able to detect what instrument is being played. In case you're playing an instrument that's not Guitar, you might need to change inside the settings.

    5.1. On the extracted widget folder, go to `settings` folder, and open `Instrument.txt` with a text or code editor.

    5.2. Place what instrument you'll be playing

    > **Warning** 
    > This is case-sensitive.

    > Available instruments:
    >
    > `GUITAR` - `GUITAR_COOP` - `REAL_GUITAR` - `RHYTHM` - `BASS` - `REAL_BASS` - `DRUMS` - `GH_DRUMS` - `REALDRUMS` - `KEYS` - `REAL_KEYS` - `VOCALS` - `HARMONY`


    - You can put multiple instruments separated by a comma (example: `GUITAR,GUITAR_COOP,RHYTHM,BASS,KEYS`) so you don't have to change mid-screen in case a chart doesn't have specified instrument.
    - It'll show the first available instrument on the list, even if you're playing another instrument, so prioritize the instrument you'll be mostly playing.
    - In case you want to change the instrument mid-stream, just change the `Instrument.txt` and click `Refresh` on the Browser Source in OBS.
