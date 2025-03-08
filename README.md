# News Aggregator

A React.js news aggregator built with TypeScript, Vite, and Tailwind CSS. Fetches news from APIs and provides search and filtering capabilities.

## Features

- Search news by keyword
- Filter news by category and source
- Mobile-responsive design
- Dockerized setup for easy deployment

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/news-aggregator.git
   cd news-aggregator
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Run the development server:
   ```sh
   yarn dev
   ```

## Running with Docker

1. Build the Docker image:
   ```sh
   docker build -t news-aggregator .
   ```
2. Run the container:
   ```sh
   docker run -p 5173:5173 news-aggregator
   ```

## Environment Variables

Create a `.env` file in the root directory and set the following variables:

```sh
VITE_NEWSAPI_KEY=your_api_key_here
```

## Tech Stack

- **React.js** (Vite + TypeScript)
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Docker** for containerization
- **React Router** for navigation

## License

MIT License
