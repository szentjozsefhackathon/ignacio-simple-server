FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . /app

EXPOSE 5005

CMD ["node", "src/server.js"]
