## 📺 **YAWO4YARG** - *Yet Another Widget Overlay for Yet Another Rhythm Game*

#### A Widget overlay compatible with [OBS](https://obsproject.com) that shows the current song with album artwork and difficulty being played on [Yet Another Rhythm Game](https://github.com/YARC-Official/YARG).


---

<br />

![Banner](.github/Banner.gif)

---

<br />

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

    > As for now, the widget isn't able to detect what instrument is being played. In case you're playing an instrument that's not the default Guitar, you might need to change inside the HTML code.

    5.1. Open `YARG Widget.html` with your code editor of choice. (or Notepad if you don't have installed)

    5.2. Search for `data-type` line.

    5.3. Change the text inside the following double quotes.

    > Available instruments:
    >
    > `GUITAR` - `GUITAR_COOP` - `REAL_GUITAR` - `RHYTHM` - `BASS` - `REAL_BASS` - `DRUMS` - `GH_DRUMS` - `REALDRUMS` - `KEYS` - `REAL_KEYS` - `VOCALS` - `HARMONY`

    > **Example:**
    >
    > If you're playing the keys, your code should be `data-type="KEYS"`