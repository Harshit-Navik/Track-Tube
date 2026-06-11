# Track-Tube

> Track learning progress across YouTube playlists — designed to feel like a native YouTube feature.

Track-Tube is a Chrome extension that integrates seamlessly into YouTube's playlist UI. It lets you mark videos as **Completed**, **Important**, or **Revisit**, filter your playlist by those states, and see live progress counts — all without disrupting YouTube's look and feel.

---

## ✨ Highlights

- **Native YouTube Design** — Follows YouTube's Material Design 3 language. Icon buttons, chip filters, and stats match YouTube's own UI so closely the feature feels first-party.
- **Always-visible SVG badges** — Three subtle icon buttons (✓ bookmark ↺) sit right next to the three-dot menu on every video row. Inactive icons are ghost-faint; active icons light up with their status colour.
- **Multi-select statuses** — A video can be Completed *and* Important *and* Revisit at the same time.
- **Live playlist stats** — A compact summary line below the filter chips shows total, completed, important, and revisit counts and updates instantly as you toggle badges.
- **One-click filtering** — YouTube-style topic chips (**All · Completed · Important · Revisit**) filter the playlist instantly using pure CSS — no re-renders, no flicker.
- **Auto-completion** — Videos are automatically marked Completed after reaching 90 % watch progress.
- **100 % local storage** — All data lives in `chrome.storage.local`. No account, no server, no analytics.

---

## Features

| Feature | Description |
|---|---|
| ✅ Completed badge | Mark a video as watched / done. Auto-set at 90 % progress. Green checkmark. |
| 🔖 Important badge | Bookmark key videos for reference. Filled bookmark icon when active. |
| ↺ Revisit badge | Flag videos you want to watch again. Purple refresh icon when active. |
| Multi-select | Any combination of the three statuses can be active on the same video. |
| Filter chips | Instantly filter the playlist to show only Completed / Important / Revisit videos. |
| Live stats | Header line: `N videos • N completed • N important • N revisit` — always up to date. |
| Auto-complete | Watch progress tracked continuously; video marked Completed at 90 %. |
| Local storage | Progress persists in the browser across sessions. No sync, no cloud. |

---

## Installation

### Chrome Web Store

*[Chrome Web Store link — coming soon]*

### Manual (Developer Mode)

1. Download or clone this repository.
2. Run the production build:
   ```bash
   npm install
   npm run build
   ```
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the `dist/` folder.
6. Open any YouTube playlist.

> Keep the `dist/` folder in place after loading — Chrome reads from it at runtime.

---

## How to Use

### Badges

Every playlist video row shows three small icon buttons to the left of the three-dot menu:

| Icon | Action |
|---|---|
| **✓** (checkmark) | Toggle **Completed** |
| **🔖** (bookmark) | Toggle **Important** |
| **↺** (refresh arrow) | Toggle **Revisit** |

- Inactive badges appear as faint ghost icons so they don't clutter the row.
- Active badges are highlighted (green / white / purple).
- Multiple badges can be active on the same video simultaneously.
- Clicking an active badge again deactivates it.

### Filter Chips

A row of chips appears directly below the playlist title:

```
[ All ]  [ Completed ]  [ Important ]  [ Revisit ]
```

Click any chip to instantly show only videos with that status. Click **All** to return to the full list.

### Stats Summary

A compact line sits between the playlist controls and the filter chips:

```
26 videos  •  12 completed  •  4 important  •  2 revisit
```

Counts update in real time as you toggle badges.

### Auto-Completion

Progress-Tube tracks playback position continuously. When a video reaches **90 % of its duration** it is automatically marked Completed. You can manually toggle Completed at any time.

---

## Privacy

- No account required.
- No analytics collected.
- No external network requests.
- All data stored locally via `chrome.storage.local`.
- Uninstalling the extension or clearing its browser data will permanently remove saved progress.

---

## Tech Stack

| Tool | Role |
|---|---|
| **React 18** | Renders and updates badges, chips, and stats inside YouTube's DOM via portals |
| **TypeScript** | Full type-safety across the codebase |
| **Vite** | Development build and production bundling |
| **Chrome MV3** | Extension runtime (Manifest V3) |
| **chrome.storage.local** | Local-only progress persistence |

---

## Development

```bash
# Install dependencies
npm install

# Watch mode — rebuilds on save
npm run dev

# Type-check only
npm run typecheck

# Production build → dist/
npm run build
```

After each rebuild, go to `chrome://extensions` → Progress-Tube → **↺ Reload** to apply changes.

---

## Project Structure

```
src/
├── components/
│   ├── PlaylistStats.tsx   # Filter chips + live stats header
│   ├── StatusToggle.tsx    # SVG icon badge button (Completed / Important / Revisit)
│   └── VideoControls.tsx   # Mounts three badges per video row
├── content/
│   ├── ContentApp.tsx      # Root React component (portal host)
│   ├── index.tsx           # Extension entry point
│   └── portalRegistry.ts   # Tracks mount targets for React portals
├── hooks/
│   ├── usePlaylistState.ts # Reactive playlist data from storage
│   └── useVideoState.ts    # Reactive per-video data + update helper
├── observers/
│   ├── NavigationObserver.ts    # Detects YouTube SPA navigation
│   ├── PlaylistObserver.ts      # Watches for new playlist rows in the DOM
│   └── VideoElementObserver.ts  # Tracks playback progress for auto-complete
├── storage/
│   ├── ChromeStorageService.ts  # Read/write via chrome.storage.local
│   ├── StorageService.ts        # Interface definition
│   └── storageKeys.ts           # Storage key helpers
├── styles/
│   └── content.css   # All extension styling (native YouTube design language)
├── types/
│   ├── state.ts      # VideoState, PlaylistState, VideoStatePatch
│   └── youtube.ts    # PortalTarget type
├── utils/
│   └── logger.ts
└── youtube/
    ├── mountPoints.ts       # Creates / locates DOM mount elements per row
    ├── playlistItems.ts     # Finds ytd-playlist-video-renderer elements
    ├── playlistMetadata.ts  # Scrapes declared playlist total from the page
    ├── selectors.ts         # Centralised YouTube CSS selectors
    └── url.ts               # Playlist ID and video ID URL helpers
```

---

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Saves video statuses and watch progress locally |
| `https://www.youtube.com/*` | Injects badges, chips, and stats into YouTube playlist pages |

No other permissions are requested.

---

## Limitations

- Works on YouTube playlist pages (`?list=...`) and playlist watch pages.
- Requires a Chromium-based browser with Manifest V3 support.
- Progress data is local to the current browser profile and does not sync across devices.

---

## Contributing

Contributions are welcome.

1. Fork the repo and create a focused branch.
2. Keep changes within the existing project structure.
3. Run `npm run typecheck` and `npm run build` before submitting.
4. Open a pull request with a clear description of the change.

For larger changes please open an issue first to discuss the approach.

---

## License

License not yet finalised. Update this section before publishing a release.
