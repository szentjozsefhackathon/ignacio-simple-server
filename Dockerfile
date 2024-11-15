# Use Node.js official image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the server files
COPY . /app

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]