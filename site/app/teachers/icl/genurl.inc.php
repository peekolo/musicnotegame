<?php


function genurl(){
	global $db;
	$selectednotes=SQET('selectednotes');
	$gamemode=QETVAL('gamemode');
	//$selectednotes=json_decode($selectednotes,true);

	$now=time();
	$salt='qweoij@!$as90';


	$query="insert into possiblenotes (token,possiblenotesjson,gamemode) VALUES (?,?,?)";
	$rs=sql_prep($query,$db,array(
		0,$selectednotes,$gamemode
	));
	$id=sql_insert_id($db,$rs);

	if(!$id){
		die();
	}

	$token=md5($now.$salt.$id);
	$query="update possiblenotes set token=? where possiblenotesid=?";
	$rs=sql_prep($query,$db,array(
		$token,$id
	));

	$affectedrows=sql_affected_rows($db,$rs);


	if($affectedrows!==1){
		die();
	}

	echo htmlspecialchars($token);
}