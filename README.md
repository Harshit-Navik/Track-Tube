# LearnTrack

LearnTrack is the YouTube playlist integration provided by the Progress-Tube Chrome extension. It helps learners track which playlist videos they have completed, which are important, and which they want to revisit.

It exists to make long educational playlists easier to manage without replacing YouTube's existing interface.

## Features

- Mark playlist videos as **Completed**.
- Mark playlist videos as **Important**.
- Mark playlist videos as **Revisit**.
- Automatically mark videos as Completed after reaching 90% watch progress.
- View Total, Completed, Important, and Revisit playlist statistics.
- Store all progress locally in the browser.
- Use progress controls directly within YouTube playlists.

## Installation

### Chrome Web Store

[Chrome Web Store Link]

1. Open the Chrome Web Store link above.
2. Click **Add to Chrome**.
3. Confirm the installation when Chrome asks for permission.
4. Open a YouTube playlist.

### Manual Installation

Use this method to install Progress-Tube from a GitHub release.

1. Download the extension package from [GitHub Release Link].
2. Extract the downloaded archive to a folder.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode** using the switch in the top-right corner.
5. Click **Load unpacked**.
6. Select the extracted extension folder.
7. Open a YouTube playlist.

Keep the extracted folder after installation. Chrome uses files from that folder to run the extension.

## How to Use

### Marking Videos

Each video in a YouTube playlist includes three controls:

- Select **C** to mark or unmark the video as Completed.
- Select **I** to mark or unmark the video as Important.
- Select **R** to mark or unmark the video as Revisit.

A video can have more than one status at the same time.

### Automatic Completion

Progress-Tube automatically marks a video as Completed when its watch progress reaches 90%.

You can still manually mark or unmark the Completed status at any time.

### Playlist Statistics

The playlist statistics show:

- **Total:** The number of videos in the playlist.
- **Completed:** The number of videos marked as Completed.
- **Important:** The number of videos marked as Important.
- **Revisit:** The number of videos marked as Revisit.

## How It Works

LearnTrack runs directly inside YouTube playlist pages and adds progress controls to the existing playlist interface. Statuses are attached to individual playlist videos using their YouTube video IDs.

All progress data is stored locally in your browser. No account is required, and no data is sent to external servers.

## Privacy

- No account is required.
- No analytics are collected.
- No browsing activity is tracked.
- No cloud storage is used.
- No external servers receive your data.
- Progress data remains in `chrome.storage.local` on your device.

Removing the extension or clearing its stored browser data may permanently remove your saved progress.

## Tech Stack

- **React:** Builds and updates the controls shown inside YouTube playlists.
- **TypeScript:** Adds type checking to help prevent code errors.
- **Vite:** Runs the development build and creates production files.
- **Chrome Extensions Manifest V3:** Defines how the extension runs in Chrome-compatible browsers.
- **chrome.storage.local:** Stores playlist progress locally in the browser.

## Development

You need Node.js and npm installed before starting.

Clone the repository, open its folder in a terminal, and install the dependencies:

```bash
npm install
```

Run development mode to rebuild the extension when source files change:

```bash
npm run dev
```

The development command creates the extension files in `dist`. To test them:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project's `dist` folder.
5. Reload the extension after each rebuild.

Create a production build:

```bash
npm run build
```

Run TypeScript checks without building:

```bash
npm run typecheck
```

## Project Structure

```text
src/
├── content/
├── components/
├── hooks/
├── storage/
├── observers/
├── youtube/
├── utils/
├── types/
└── styles/
```

- `content/` starts the extension on YouTube pages and manages the React integration.
- `components/` contains the playlist controls and statistics UI.
- `hooks/` connects React components to playlist and video state.
- `storage/` reads and writes progress data using `chrome.storage.local`.
- `observers/` handles YouTube navigation, page updates, and video playback changes.
- `youtube/` contains YouTube URL, playlist, selector, and mount-point helpers.
- `utils/` contains small shared utilities.
- `types/` contains shared TypeScript data definitions.
- `styles/` contains the extension's YouTube integration styles.

## Permissions

Progress-Tube requests only the permissions needed for its core features:

- **Storage:** Saves playlist progress and video statuses locally using `chrome.storage.local`.
- **Access to `https://www.youtube.com/*`:** Allows the extension to add controls, show statistics, and track watch progress on YouTube pages.

The extension does not request access to other websites.

## Limitations

- Progress tracking works on YouTube playlist pages and playlist watch pages.
- A Chrome-compatible browser with Manifest V3 extension support is required.
- Progress data is stored locally in the current browser profile.
- Progress data does not sync across devices or browser profiles.

## Contributing

Contributions are welcome. Before submitting a change:

1. Create a focused branch.
2. Keep changes within the existing project structure.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Open a pull request that clearly explains the change.

For larger changes, open an issue first to discuss the approach.

## License

License not yet finalized. Add the selected license and update this section before publishing a release.
