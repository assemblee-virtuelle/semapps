FROM mhart/alpine-node
WORKDIR /app

RUN apk --no-cache upgrade && apk add --no-cache git bash nano

RUN git clone https://github.com/tombh/bull-board.git .
RUN git checkout standalone-docker

RUN yarn install
RUN yarn build

COPY ./standalone.js standalone.js

CMD ["node", "standalone.js"]
