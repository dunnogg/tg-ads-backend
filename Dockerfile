FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install pm2 -g

COPY . .

RUN npm run build

CMD ["pm2-runtime", "dist/main.js"]