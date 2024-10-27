FROM nginx:stable-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/www/certbot
VOLUME /etc/letsencrypt
VOLUME /var/www/certbot

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
