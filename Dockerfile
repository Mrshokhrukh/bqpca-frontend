# Stage 1: Build
FROM oven/bun:latest AS build
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y unzip && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./ 
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

# 1. Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# 2. Copy the optimized Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. CRITICAL FIX: Change ownership and permissions
#    This ensures the 'nginx' user can actually read the files
USER root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]