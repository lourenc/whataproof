FROM node:18.12.1 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.25.1
COPY --from=builder /app/dist/ /var/www/whataproof.xyz/html
