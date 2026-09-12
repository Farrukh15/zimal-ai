# Zimal AI — Landing Page (Light Mode Default + Dark Mode)

A dual-theme build of the Zimal AI landing page. **Light mode is the default**;
a theme toggle in the navbar switches to the dark build and remembers the choice.

## 📁 Structure

```
zimal-ai-light-mode/
├── index.html          ← LIGHT mode (default)
├── css/style.css       ← base styles + light-theme overrides + toggle styles
├── js/main.js
├── app.py
├── README.md
└── dark-mode/          ← dark build (renamed from "dark mode" — space in the
                            folder name broke direct file:// navigation)
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

## 🌓 How the toggle works

- The navbar sun/moon button switches between the two builds.
- The preference is saved in `localStorage` (`zimal-theme`), so returning
  visitors land on the theme they last picked.
- A small guard script in each page's `<head>` redirects to the correct build
  if the saved preference doesn't match the current page.
- Both pages work fully standalone — no build step, no dependencies.

## 🚀 Run

```bash
# Light mode (default) — serves at http://localhost:8000
python app.py

# Dark mode standalone
cd dark-mode
python app.py 8001
```

Or just open `index.html` in a browser (works from `file://` too).

## 🎨 Customizing the light theme

All light colors live in the `LIGHT THEME — DEFAULT MODE` block at the bottom
of `css/style.css` (CSS variables + a few targeted overrides). Change the
variables there to re-skin the whole light mode at once.
