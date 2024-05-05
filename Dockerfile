FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]