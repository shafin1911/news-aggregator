# Project Structure

This project is organized into the following directories and subdirectories:

## Root Directory

- **README.md**: Project overview and setup guide.
- **Dockerfile**: Docker configuration file.
- **eslint.config.js**: ESLint configuration file.
- **index.html**: Main HTML entry point.
- **package.json**: Project metadata and dependencies.
- **tailwind.config.js**: Tailwind CSS configuration file.
- **tsconfig.app.json, tsconfig.json, tsconfig.node.json**: TypeScript configuration files.
- **vite.config.ts**: Vite configuration file.
- **.dockerignore**: Docker ignore file.

## Public Directory

- **public/**: Publicly accessible files.

## Source Directory

- **src/**: Source code directory.
  - **App.css, App.tsx, index.css, main.tsx, theme.ts, vite-env.d.ts**: Main application files.
  - **assets/**: Asset files (e.g., images, fonts).
  - **components/**: React component directory.
    - **Filter/**: Filter component subdirectory.
    - **News/**: News component subdirectory.
    - **Preferences/**: Preferences component subdirectory.
    - **Search/**: Search component subdirectory.
    - **layout/**: Layout component subdirectory.
    - **loaders/**: Loader component subdirectory.
  - **hooks/**: Custom React hook directory.
  - **services/**: Service directory (e.g., API clients, data aggregators).
    - **NewsAggregator.ts, OptionsAggregator.ts, types.ts**: Service files.
    - **guardian/**: Guardian service subdirectory.
    - **new_york_times/**: New York Times service subdirectory.
    - **newsapi/**: NewsAPI service subdirectory.
  - **store/**: State management directory.
    - **app-store.ts, ui-store.ts**: Store files.
  - **utils/**: Utility directory.
    - **helper.ts**: Utility file.
