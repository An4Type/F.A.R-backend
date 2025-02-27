FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3000

# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["sh", "-c", "npm run typeorm migration:run && npm run start:dev"]
