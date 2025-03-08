# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock first to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 5173 (Vite default)
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "preview", "--", "--host"]
