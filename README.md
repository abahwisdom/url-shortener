# URL Shortener Service

This project is a URL shortening service built with NestJS. It allows users to shorten long URLs, decode shortened URLs back to their original form, and track statistics for each shortened URL.

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/abahwisdom/url-shortener.git
    cd url-shortener
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3000
    BASE_PATH=http://localhost:3000
    ```

## Running the Application

1. Start the application in development mode:
    ```bash
    npm run start:dev
    ```

2. The application will be running at:
    ```
    http://localhost:3000
    ```

3. To start the application in production mode:
    ```bash
    npm run start:prod
    ```

## Testing

1. Run the end-to-end tests:
    ```bash
    npm run test:e2e
    ```

2. Run the unit tests:
    ```bash
    npm run test
    ```

3. Run the tests with coverage:
    ```bash
    npm run test:cov
    ```

## Linting and Formatting

1. Run the linter:
    ```bash
    npm run lint
    ```

2. Automatically fix linting issues:
    ```bash
    npm run lint:fix
    ```

3. Format the code with Prettier:
    ```bash
    npm run format
    ```

## Project Structure

- `src/`: Contains the source code of the application.
  - `app.module.ts`: The root module of the application.
  - `main.ts`: The entry point of the application.
  - `url/`: Contains the URL shortening related modules, controllers, and services.
- `test/`: Contains the end-to-end tests.
- `package.json`: Contains the project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.

## API Endpoints

- `POST /encode`: Encode a long URL to a short URL.
  - Request Body: `{ "longUrl": "https://example.com" }`
  - Response: `{ "shortUrl": "http://localhost:3000/abc123" }`

- `POST /decode`: Decode a short URL to the original long URL.
  - Request Body: `{ "shortUrl": "abc123" }`
  - Response: `{ "longUrl": "https://example.com" }`

- `GET /statistic/:urlPath`: Get statistics for a short URL.
  - Response: `{ "longUrl": "https://example.com", "visits": 0, "creationDate": "2023-10-01", "clicksByDate": { "2023-10-01": 0 } }`

- `GET /:urlPath`: Redirect to the original long URL.
  - Response: 302 Redirect to the original URL.

## License

This project is licensed under the MIT License.

