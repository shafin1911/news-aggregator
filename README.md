# News Aggregator

**News Aggregator** is a modern React application that aggregates news from multiple sources (such as NewsAPI, The Guardian, and The New York Times) into a unified interface. It offers features like search, filtering, personalization, and a theme switcher for an enhanced user experience.

## Features

- **Unified News Feed:** Aggregates articles from multiple sources into a single list.
- **Search & Filters:** Easily search for news articles and filter them by date, category, and source.
- **Personalized Preferences:** Set your preferred sources, categories, and authors.
- **Theme Switcher:** Toggle between light and dark modes.
- **Dockerized Build:** Containerize the application for consistent environments.

## Prerequisites

- **Node.js:** Version 18.x (as specified in the Dockerfile)
- **npm or Yarn:** The project uses npm by default.
- **Docker:** To build and run the containerized version of the app.
- **Environment Variables:** The app uses environment variables (prefixed with `VITE_`) for API keys.

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd news-aggregator
```

### 2. Setup Environment Variables

Create a .env file in the project root with the following (replace with your actual API keys):

```env
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_GUARDIAN_API_KEY=your_guardian_api_key_here
VITE_NYT_API_KEY=your_nyt_api_key_here
```

Vite requires environment variables to be prefixed with VITE\_.

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Or, if you prefer Yarn:

```bash
yarn install
```

### 4. Run the Project Locally

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173.

### 5. Build and Preview for Production

To create a production build and preview it locally:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

Then open http://localhost:5173 to see the production version.

### Running in Docker

This project includes a Dockerfile to build and run the application in a container.

## Dockerfile Overview

```dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Use npm ci for faster installation
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 5173 (Vite default)
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

## Build and Run the Docker Container

- **Build the Docker Image:**

```bash
docker build -t news-aggregator .
```

- **Run the Docker Container:**

```bash
docker run -it -p 5173:5173 news-aggregator
```

- **Access the App:**
  Open your browser and navigate to http://localhost:5173 to see your app running inside Docker.

### Environment Variables in Docker

When building your Vite app, Vite injects environment variables at build time. Ensure that your .env file is included in the Docker build context or use Docker build arguments to pass them in. Remember, Vite requires environment variables to be prefixed with VITE\_.

### Theme Switcher & UI Enhancements:

The project includes features like a theme switcher and animated loaders/empty states. Check the source code for components such as AppHeader, Loader, and the theme configuration for more details.
