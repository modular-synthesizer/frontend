FROM node:18-buster

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

RUN yarn install

RUN yarn build

ENTRYPOINT ["deployment/entrypoint.sh"]