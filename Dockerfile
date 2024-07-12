FROM node:20-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8042

CMD ["npm","start"]
