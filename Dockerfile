# Use the official Node.js image as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
RUN chmod +x node_modules/.bin/vite

# Build the application
RUN npm run build

# Use a smaller image for the production environment
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
# Expose port 80
EXPOSE 3001

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
