FROM node 

WORKDIR /app

COPY package.json /app

COPY . .

RUN npm install

CMD ["node","TelegramBot.js"]