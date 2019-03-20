FROM node:8.12.0

WORKDIR /usr/src/app

COPY . .

RUN npm install pm2 -g
RUN npm install

EXPOSE 3000

CMD ["pm2-runtime", "process.yml"]
