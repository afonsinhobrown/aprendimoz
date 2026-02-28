FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from root and backend
COPY package.json ./
COPY backend/package*.json ./backend/

# Install dependencies for backend
RUN npm install --prefix backend

# Copy Necessary folders
# We copy shared because the backend tsconfig refers to it for types
COPY shared ./shared
COPY backend ./backend

# Build the application
RUN npm run build --prefix backend

# Expose port (Matching .env)
EXPOSE 3333

# Start the application
CMD ["npm", "run", "start:prod", "--prefix", "backend"]
