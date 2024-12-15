# Ignacio Simple Server

This is a simple Node.js server implementation to serve JSON database, images, and voice file updates for ignacio_prayer_flutter_application (local testing). The database, images, and voice files are stored locally in the app; only version changes in [backedn/source/data/versions.json] are checked during the local app startup process. If an update is needed, the local app calls for the corresponding files.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/szentjozsefhackathon/ignacio-simple-server.git
   cd ignacio-simple-server
   ```

2. Build docker projects with docker-compose:
   ```sh
   docker-compose build
   ```

3. Start the servers with docker-compose:
   ```sh
   docker-compose up -d
   ```

4. The servers will be running at [`http://localhost:3000`](http://localhost:3000).
 - landing page under /
 - API under /api
 - flutter web under /flutter

## License

This project is licensed under the MIT License.

## Generate certs (macOs)

```shell
cd backend
mkdir certs                                                     
openssl req -x509 -newkey rsa:2048 -keyout certs/server.key -out certs/server.cert -days 365 -nodes
```
