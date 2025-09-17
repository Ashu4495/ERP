# ERP

About this project

ERP is a lightweight frontend for a college Enterprise Resource Planning (ERP) system. It provides a student-facing portal with pages for admission, canteen ordering/menu browsing, library access, and AICTE-related information. The UI is built with Vite + React (JSX) and plain CSS.

Key features

- Admission page with form layout and assets.
- Student portal UI with navigation to core services.
- Canteen menu and static assets for items and images.
- Library page to display catalog-like information.
- Simple static frontend suitable for integration with a backend API.

Tech stack

- Frontend: React (JSX) + Vite
- Styling: CSS
- Package manager: npm

Folder structure (important files)

- `src/` — React components and styles (e.g. `App.jsx`, pages, `assets/`)
- `public/` — static assets served by Vite (images, JSON fixtures)
- `index.html` — app entry
- `package.json` / `package-lock.json` — npm metadata and scripts
- `.gitignore` — ignored files and folders

Quick start

1. Install dependencies

```powershell
cd D:\\SIH_main
npm install
```

2. Run development server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
```

Notes

- Static data and images live in `public/` and `src/assets/`.
- This repository currently only contains the frontend; to make it functional you can connect the UI to a backend API for authentication, orders, and library data.

Contributing

- Feel free to open issues or PRs. Small improvements I can help with: add tests, CI workflows, or a simple backend mock.

License

- Add a license file if you want the repository to be publicly licensed (e.g. `MIT`).

Contact / Next steps

- If you'd like, I can add a `CONTRIBUTING.md`, a basic GitHub Actions CI to run a lint/build step, or scaffold a minimal Express backend to demonstrate end-to-end flow. Tell me which and I'll add it.

Project URL: https://github.com/Ashu4495/ERP
