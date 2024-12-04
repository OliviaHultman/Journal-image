FROM node:14

WORKDIR /journal_app

COPY Backend_Image/package.json /journal_app/

COPY Backend_Image/package-lock.json /journal_app/

RUN npm install

COPY Backend_Image/bin /journal_app/bin
COPY Backend_Image/src /journal_app/src

EXPOSE 3000

CMD ["npm", "start"]