FROM node:14

WORKDIR /journal_app

COPY Lab3_Image/package*.json ./

RUN npm install
RUN npm install jest
RUN chmod -R 755 node_modules

COPY Lab3_Image/ ./

RUN npx jest

EXPOSE 3001

CMD ["npm", "start"]