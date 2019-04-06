FROM node:11.12.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install pm2 -g
RUN npm install

EXPOSE 3000

CMD ["pm2-runtime", "process.yml"]
