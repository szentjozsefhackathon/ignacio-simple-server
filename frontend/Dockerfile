# Step 1: Use Node.js for building the React app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the React app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]