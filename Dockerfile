# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./


# Use npm ci for faster installation
RUN npm ci 

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 5173 (Vite default)
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]