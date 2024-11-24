DROP TABLE IF EXISTS `possiblenotes`;
CREATE TABLE `possiblenotes`(
	`possiblenotesid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`token` varchar(255) NOT NULL,
	`possiblenotesjson` longtext,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`possiblenotesid`)
);

ALTER TABLE `possiblenotes` ADD COLUMN `gamemode` tinyint(3) unsigned default 0;