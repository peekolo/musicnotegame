FROM ubuntu:22.04 AS base
RUN apt-get update -y \
    && apt-get install -y \
    ca-certificates
RUN DEBIAN_FRONTEND=noninteractive apt-get -y dist-upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install software-properties-common
RUN DEBIAN_FRONTEND=noninteractive LC_ALL=C.UTF-8  add-apt-repository -y ppa:ondrej/php
RUN DEBIAN_FRONTEND=noninteractive apt-get update -y \
    && apt-get install -y \
    php7.4-fpm \
    php7.4-cli \
    php7.4-json \
    php7.4-curl \
    php7.4-gd \
    php7.4-ldap \
    php7.4-mbstring \
    php7.4-mysql \
    php7.4-xml \
    php7.4-zip \
    php7.4-intl \
    php7.4-memcache \
    php7.4-redis

RUN DEBIAN_FRONTEND=noninteractive apt-get update -y \
    && apt-get install -y \
    imagemagick \
    poppler-utils \
    nano \
    potrace \
    gzip \
    wget \
    curl \
    python3 \
    memcached \
    redis-server 

RUN apt-get update -y \
    && apt-get install -y nginx


FROM base AS src1

RUN apt-get update && apt-get install -y --no-install-recommends perl pwgen
RUN { \
    echo mysql-community-server mysql-community-server/root-pass password mnstudio; \	
    echo mysql-community-server mysql-community-server/re-root-pass password mnstudio; \
} | debconf-set-selections \
&& apt-get update && apt-get install -y -f mysql-client=8.0* mysql-server=8.0*

FROM src1 AS configsetup
RUN mkdir /var/www/musicnotegame
COPY docker_setupfiles/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker_setupfiles/db.sql /usr/local/bin/
COPY docker_setupfiles/init.sh /usr/local/bin/

COPY docker_setupfiles/php-fpm-7.4/php-fpm.conf /etc/php/7.4/fpm/
COPY docker_setupfiles/php-fpm-7.4/php.ini /etc/php/7.4/fpm/
COPY docker_setupfiles/php-cli-7.4/php.ini /etc/php/7.4/cli/
COPY docker_setupfiles/php-fpm-7.4/www.conf /etc/php/7.4/fpm/pool.d/

RUN chmod +x /usr/local/bin/init.sh


EXPOSE 80 3306

ENTRYPOINT ["/usr/local/bin/init.sh"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
