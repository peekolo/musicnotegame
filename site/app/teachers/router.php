<?php

include_once __DIR__.'/../connect.php';
include_once __DIR__.'/../helper.php';

$token=$_SERVER['X_Token'];
if($token != $webtoken){
	die('.');
}


$cmd=$_GET['cmd'];

if(!$cmd){
	die();
}

switch($cmd){
	case 'genurl': include __DIR__.'/icl/genurl.inc.php'; genurl(); break;

	default:
		die('.');
	break;

}