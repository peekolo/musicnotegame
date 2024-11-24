<?php

include_once "sql.php";

// uncomment both $db lines to activate Gyroscope
// instead of using "127.0.0.1", use "localdb" and add "127.0.0.1 localdb" to /etc/hosts

if (defined('GSSERVICE')) {
	$db=sql_get_db('p:127.0.0.1','','','','db');
} else {
	$db=sql_get_db('127.0.0.1','','','','db');
}
