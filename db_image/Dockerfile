FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password

ADD schema.sql /docker-entrypoint-initdb.d

COPY sample_images /data/

EXPOSE 3306
