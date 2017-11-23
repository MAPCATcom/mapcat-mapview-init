FROM node:alpine

ARG VERSION
ARG TYPE=basic

ENV NODE_ENV production

RUN npm install -g static-server

RUN mkdir -p /opt/mapview/dist/
WORKDIR /opt/mapview/

ADD src /opt/mapview/src
ADD *.json /opt/mapview/

RUN npm install
RUN npm run build-min

ADD example /opt/mapview/dist/

ADD docker/docker-entrypoint.ash /opt/mapview/

EXPOSE 8080

ENTRYPOINT ["/opt/mapview/docker-entrypoint.ash"]