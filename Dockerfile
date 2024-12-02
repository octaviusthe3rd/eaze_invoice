# Uses the official Node image as the base image
FROM node:18-alpine

# Sets working directory
WORKDIR /app

# Copies package files
COPY package*.json ./

# Installs dependencies
RUN npm install

# Copies all application files
COPY . .

# Binds port 3000 where the app runs
EXPOSE 3000

# Sets environment variables
ENV NODE_ENV=production

# Runs the application
CMD ["node", "server.js"]