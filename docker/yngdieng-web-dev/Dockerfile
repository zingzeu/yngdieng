FROM nginx:1.18-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./devapp_release/ /wwwroot/
COPY ./robots.txt /wwwroot/

EXPOSE 80