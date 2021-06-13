FROM node:14

WORKDIR /src

COPY package.json .

RUN npm install && npm cache clean --force

COPY . ./

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "dev"]