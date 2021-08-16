# Dockerfile

# --- Stage 1: Build Stage ---
# Use the official Bun image to install dependencies and build the Vue app
FROM oven/bun:1.2.19 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, bun.lockb, and tsconfig.json first to leverage Docker's layer caching.
# This way, dependencies are only re-installed if these files change.
COPY package.json bun.lock ./
COPY tsconfig.json* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN bun run build


# --- Stage 2: Production Stage ---
# Use a lightweight and secure Nginx image to serve the built files
FROM nginx:1.27-alpine-slim

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the 'builder' stage to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# The command to start the Nginx server when the container launches
CMD ["nginx", "-g", "daemon off;"]