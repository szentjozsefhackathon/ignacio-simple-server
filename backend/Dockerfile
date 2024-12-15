# Use Node.js official image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the server files
COPY . /app

# Expose the port the app runs on
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
