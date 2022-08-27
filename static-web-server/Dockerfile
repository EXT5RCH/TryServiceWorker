FROM node:16.14.0

WORKDIR /app

COPY src ./src
COPY package*.json ./

RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "start" ]