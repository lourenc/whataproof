FROM node:18.12.1
WORKDIR /app
COPY . .
ENV PORT 80
RUN npm i
RUN npm run build  
CMD npm start

