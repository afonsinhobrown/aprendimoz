FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files (from root as build context)
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install --prefix shared
RUN npm install --prefix backend

# Copy source code
COPY shared ./shared
COPY backend ./backend

# Build the application
WORKDIR /app/backend
RUN npm run build

# Expose port (Matching .env)
EXPOSE 3333

# Start the application
CMD ["npm", "run", "start:prod"]
