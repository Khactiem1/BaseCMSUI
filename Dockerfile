# Bước 1: Build stage
FROM node:20 AS build-stage

# Đặt thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Bước 2: Production stage
FROM nginx:alpine AS production-stage

# Copy các file build từ build-stage vào thư mục phục vụ của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Sao chép file cấu hình NGINX tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy cấu hình tùy chỉnh cho Nginx nếu cần
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose cổng 80
EXPOSE 80

# Khởi động Nginx khi container chạy
CMD ["nginx", "-g", "daemon off;"]
