# Arrow Flow

Visual reaction training for phones, tablets, and desktop browsers.

## Source files

- `index.html`: page structure and controls
- `styles.css`: layout, themes, typography, and animations
- `app.js`: training, settings, random cues, and audio
- `theme.js`: restores the saved theme before the page paints
- `favicon.svg` and `apple-touch-icon.png`: app icons

GitHub Pages serves these files from the repository root. In the Sites checkout, they live in `dist/`.

## Preview

No dependencies or build step are required. Serve the page with a static server, for example `python3 -m http.server 8000` from the folder containing `index.html`.

## Offline HTML

Run `node build-offline.mjs` to create `Arrow-Flow-Offline.html`, or pass an output path as the first argument. The generated file includes the styles, scripts, icons, font, and audio and can be opened directly without a server.

Make changes in the separate source files and regenerate the offline file when needed. GitHub Pages publishes changes pushed to `main`.
