# Sử dụng Node.js phiên bản mới nhất
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Chạy lệnh build nếu có (nếu là TypeScript, React, Vue, v.v.)
# RUN npm run build

# Port API sẽ chạy
EXPOSE 5000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
