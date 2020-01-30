FROM node:lts-alpine

WORKDIR   /app

COPY package*.json ./

RUN npm update && npm install config

COPY . .

RUN npm run build

EXPOSE 8080 8888

ENTRYPOINT [ "npm" ]
CMD ["run", "serve"]