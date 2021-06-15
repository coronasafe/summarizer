FROM node:14-alpine

WORKDIR /app
COPY . .

RUN yarn
RUN yarn ts:build

ENTRYPOINT [ "node", "." ]
