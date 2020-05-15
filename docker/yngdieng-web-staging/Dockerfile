FROM nginx:1.18-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./staging_app/ /wwwroot/
COPY ./robots.txt /wwwroot/

EXPOSE 80