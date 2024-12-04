FROM node:14

WORKDIR /journal_app

COPY package.json /journal_app/

COPY package-lock.json /journal_app/

RUN npm install

COPY public /journal_app/public
COPY src /journal_app/src

EXPOSE 3000

CMD ["npm", "start"]