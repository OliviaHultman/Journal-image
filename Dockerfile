FROM node:14

WORKDIR /journal_app

COPY Lab3_Image/package*.json ./

RUN npm install

COPY Lab3_Image/ ./

EXPOSE 3001

CMD ["npm", "start"]