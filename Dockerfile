FROM node as build

ADD ./mapache-web /usr/src/app

WORKDIR /usr/src/app

RUN npm install yarn
RUN yarn install
RUN yarn global add react-scripts@3.4.1

# build
RUN yarn run build

########################

# PRODUCTION ENVIRONMENT

# this image comes with nginx
FROM nginx:stable-alpine

# lets copy static react files
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# delete default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# my nginx config
COPY react-nginx.template /etc/nginx/conf.d 

COPY docker-entrypoint-prod.sh /

ENTRYPOINT ["sh", "/docker-entrypoint-prod.sh"]

