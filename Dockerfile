FROM node:latest
WORKDIR /app
ENV NODE_ENV production
COPY package*.json server.js ./
RUN npm install
COPY . .
EXPOSE 4800
CMD ["node", "server.js"]