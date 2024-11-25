# Ignacio Simple Server

This is a simple Node.js server implementation to serve JSON database, images, and voice file updates for ignacio_prayer_flutter_application (local testing). The database, images, and voice files are stored locally in the app; only version changes in [/data/versions.json] are checked during the local app startup process. If an update is needed, the local app calls for the corresponding files.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/golar24/ignacio-simple-server.git
   cd ignacio-simple-server
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the server:
   ```sh
   npm start
   ```

2. The server will be running at `http://localhost:3000`.

## Features

- Rate limiting to prevent abuse
- Basic authentication middleware for securing endpoints

## License

This project is licensed under the MIT License.
