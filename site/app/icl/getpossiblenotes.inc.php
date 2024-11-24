<?php

function getpossiblenotes($token=null){
	global $db;
	if(!$token){
		$getpossiblenotes=array();
		return $getpossiblenotes;
	}

	$query="select * from possiblenotes where token=?";
	$rs=sql_prep($query,$db,array($token));
	$myrow=sql_fetch_assoc($rs);

	$getpossiblenotes=json_decode($myrow['possiblenotesjson'],1);

	return $getpossiblenotes;
}

/*

function addpossiblenotes(){
	global $db;


	$token='abcde';

	$getpossiblenotes=array(
		array('noteName'=>'C','octave'=>3),
		array('noteName'=>'E','octave'=>3),
	);


	$query="insert into possiblenotes (token,possiblenotesjson) VALUES (?,?)";
	sql_prep($query,$db,array(
		$token,
		json_encode($getpossiblenotes)
	));

}*/
