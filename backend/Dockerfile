FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Matching .env)
EXPOSE 3333

# Start the application
CMD ["npm", "run", "start:prod"]
