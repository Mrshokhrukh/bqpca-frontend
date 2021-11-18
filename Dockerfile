# Stage 1: Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# COPY THE BUILD OUTPUT TO NGINX HTML FOLDER
COPY --from=build /app/dist /usr/share/nginx/html
# COPY CUSTOM NGINX CONFIG (Optional but recommended for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]