FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password

RUN echo "hello world!"

ADD schema.sql /docker-entrypoint-initdb.d

EXPOSE 3306
