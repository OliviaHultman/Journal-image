FROM node:14

WORKDIR /journal_app

COPY Backend_Image/package*.json ./

RUN npm install

COPY Backend_Image/ ./

EXPOSE 3001

CMD ["npm", "start"]