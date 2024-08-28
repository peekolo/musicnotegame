#!/bin/bash
if [ ! "$(ls /var/lib/mysql)" ];
then
	mysqld --initialize-insecure
	/etc/init.d/mysql start

	if [ "$(ls /usr/local/bin/db.sql)" ];
	then
		mysql -uroot < /usr/local/bin/db.sql
	fi

else
	/etc/init.d/mysql start	
fi

/etc/init.d/php7.4-fpm start 

nginx -g 'daemon off;'
