FROM node:14

WORKDIR /journal_app

COPY Lab3_Image/ ./

RUN npm install

RUN npx jest

EXPOSE 3001

CMD ["npm", "start"]
