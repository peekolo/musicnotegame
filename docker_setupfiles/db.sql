CREATE DATABASE musicnotegame;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE USER 'musicnotegame'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
GRANT ALL PRIVILEGES ON musicnotegame.* TO 'musicnotegame'@'localhost';
FLUSH PRIVILEGES;
