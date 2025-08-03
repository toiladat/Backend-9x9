# Sử dụng image Node 20 chính thức
FROM node:20

# Thư mục làm việc trong container
WORKDIR /root/app

# Copy lockfile & package.json trước để cache việc install
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install

# Copy toàn bộ mã nguồn vào sau khi đã cài node_modules
COPY . .

# Expose cổng 3000 để Docker mapping ra bên ngoài
EXPOSE 3000

# Lệnh khởi động container
CMD ["yarn", "production"]

#docker build . -t 9x9
#docker run -d -p 3000:3000 --name cont-9x9 9x9
# -detect -port public:private containerName imageName
