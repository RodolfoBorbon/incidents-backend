FROM node:latest
WORKDIR /app
COPY package*.json server.js ./
RUN npm install
COPY . .
EXPOSE 4800
CMD ["node", "server.js"]