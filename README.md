# Track-Tube

Track-Tube is a Chrome extension for tracking learning progress in YouTube playlists. It adds simple controls to playlist videos so you can mark lessons as completed, important, or worth revisiting. It is useful for students, developers, and anyone who uses YouTube playlists as a course or study plan.

This extension is not published on the Chrome Web Store. Install it manually from a release ZIP or build it from source.

## Features

- Adds progress controls to YouTube playlist videos.
- Mark videos as:
  - Completed
  - Important
  - Revisit
- Automatically marks a video as completed after you watch at least 90% of it.
- Shows playlist progress counts.
- Filters playlist videos by status.
- Stores all progress locally in your browser.
- Works with Chrome Extension Manifest V3.

## Installation

### Chrome / Edge / Chromium

1. Download [track-tube.zip](https://raw.githubusercontent.com/Harshit-Navik/Track-Tube/main/releases/track-tube.zip)
2. Go to `chrome://extensions` and enable **Developer mode**
3. Drag and drop the zip onto the page

**Alternative Installation Method:**

If drag and drop doesn't work:

1. Extract the ZIP file to a folder on your computer
2. Go to `chrome://extensions` and enable **Developer mode**
3. Click **Load unpacked**
4. Select the extracted extension folder

---

### Build from Source

Use this method if you want to build the extension yourself or contribute to development.

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd progress-tube
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

5. Enable **Developer mode**.
6. Click **Load unpacked**.
7. Select the generated `dist/` folder.

## How to Use

Open a YouTube playlist or a YouTube video that is part of a playlist. Track-Tube adds three small controls to each playlist video row:

- **Completed**: Use this when you have finished a video.
- **Important**: Use this to mark videos you want to remember or reference later.
- **Revisit**: Use this for videos you want to watch again.

A video can have more than one status at the same time. For example, a video can be both **Completed** and **Important**.

The extension also adds playlist-level filters:

- **All**: Show all playlist videos.
- **Completed**: Show only completed videos.
- **Important**: Show only important videos.
- **Revisit**: Show only videos marked for revisit.

Typical workflow:

1. Open a course or learning playlist on YouTube.
2. Watch videos normally.
3. Mark videos as completed, important, or revisit as you go.
4. Use filters to focus on what you have finished or what needs attention.

No screenshots are currently included in this repository.

## How It Works

Track-Tube runs as a Chrome content script on YouTube pages.

- **Data storage**: Progress is stored in `chrome.storage.local`, which means it stays in your local Chrome browser profile.
- **Video tracking**: The extension watches the active YouTube video element and records watch progress.
- **Status management**: Each video can store completed, important, revisit, and watch progress values.
- **Filtering logic**: Playlist rows are tagged with status attributes, and CSS is used to hide or show rows based on the selected filter.
- **YouTube navigation**: YouTube is a single-page app, so the extension listens for navigation changes and reattaches controls when the playlist changes.

## Tech Stack

- TypeScript
- React
- Vite
- Chrome Extension Manifest V3
- Chrome Storage API

## Project Structure

```text
public/
  manifest.json        Chrome extension manifest
  icons/               Extension icons

src/
  components/          React UI components for controls, status buttons, and stats
  content/             Content script entry point and portal rendering
  hooks/               React hooks for playlist and video state
  observers/           YouTube navigation, playlist, and video observers
  storage/             Chrome storage wrapper and storage key helpers
  styles/              Content script CSS
  types/               Shared TypeScript types
  utils/               Logging helpers
  youtube/             YouTube URL, selector, metadata, and mount utilities

dist/                  Generated production build output
```

## Privacy

Track-Tube is designed to run locally in your browser.

- No user account is required.
- No external server is used.
- No analytics are included.
- No personal data is collected by the extension.
- Progress data is stored locally with `chrome.storage.local`.
- Data stays in your browser profile unless you remove the extension data or clear browser storage.

The extension requests access to YouTube pages so it can add controls to playlist pages and track playlist video progress.

## Development

Install dependencies:

```bash
npm install
```

Run TypeScript checks:

```bash
npm run typecheck
```

Build once:

```bash
npm run build
```

Build continuously while editing:

```bash
npm run dev
```

After rebuilding, reload the extension from `chrome://extensions` and refresh the YouTube tab.

## Building for Production

Create a production build:

```bash
npm run build
```

The output is written to:

```text
dist/
```

To prepare a ZIP for manual installation, zip the contents of `dist/` so that `manifest.json` is at the root of the ZIP.

On Windows PowerShell:

```powershell
Compress-Archive -Path dist\* -DestinationPath track-tube.zip -Force
```

## Troubleshooting

### Extension Not Appearing

- Make sure you loaded the extracted extension folder or the generated `dist/` folder.
- Make sure Developer mode is enabled in `chrome://extensions`.
- Refresh the YouTube tab after loading or reloading the extension.
- Open a YouTube playlist. The extension is designed for playlist pages and playlist watch pages.

### Load Unpacked Shows An Error

- Make sure the selected folder contains `manifest.json`.
- If installing from source, run `npm run build` first and load the `dist/` folder.
- Do not load the repository root unless it contains a built extension manifest and files.

### Changes Are Not Updating

After changing source code:

1. Run `npm run build`.
2. Go to `chrome://extensions`.
3. Click reload on the Track-Tube extension card.
4. Refresh the YouTube tab.

If you see `Extension context invalidated` in DevTools, refresh the YouTube tab. This usually happens after reloading an unpacked extension while an old content script is still active.

### Missing Permissions

Track-Tube requires:

- `storage`: saves progress locally.
- `https://www.youtube.com/*`: runs on YouTube pages so it can add playlist controls.

If Chrome shows a permissions warning, confirm that the extension was loaded from the expected folder.

## FAQ

### Is Track-Tube available on the Chrome Web Store?

No. It is installed manually from a release ZIP or built from source.

### Does it sync progress across devices?

No. Progress is stored locally in the current Chrome browser profile.

### Does it work outside YouTube?

No. The extension only runs on `https://www.youtube.com/*`.

### Does it collect analytics?

No. There is no analytics code in this project.

### Where is my progress stored?

Progress is stored locally using Chrome's `chrome.storage.local` API.

### Will uninstalling the extension delete my data?

Removing the extension or clearing browser extension data can remove stored progress.

### Why do I need Developer mode?

Developer mode is required because this extension is installed manually instead of through the Chrome Web Store.

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.
