<?php

function GETVAL($key){ $val=trim(isset($_GET[$key])?$_GET[$key]:''); if (!is_numeric($val)) apperror('apperror:invalid parameter '.$key); return $val;}
function QETVAL($key){ $val=trim(isset($_POST[$key])?$_POST[$key]:''); if (!is_numeric($val)) apperror('apperror:invalid parameter '.$key); return $val;}
function noapos($val,$trimnl=1){$val=addslashes($val); if ($trimnl) $val=str_replace(array("\n","\r","\r\n"),' ',$val); return $val;}
function GETSTR($key,$trim=1){$val=isset($_GET[$key])?$_GET[$key]:'';if ($trim) $val=trim($val);return noapos($val,0);}
function QETSTR($key,$trim=1){$val=isset($_POST[$key])?$_POST[$key]:'';if ($trim) $val=trim($val);return noapos($val,0);}

function GETCUR($key){$val=trim(isset($_GET[$key])?$_GET[$key]:''); $val=str_replace(_tr('currency_separator_thousands'),'',$val); $val=str_replace(_tr('currency_separator_decimal'),'.',$val); if (!is_numeric($val)) apperror('apperror:invalid parameter '.$key); return $val; }
function QETCUR($key){$val=trim(isset($_POST[$key])?$_POST[$key]:''); $val=str_replace(_tr('currency_separator_thousands'),'',$val); $val=str_replace(_tr('currency_separator_decimal'),'.',$val); if (!is_numeric($val)) apperror('apperror:invalid parameter '.$key); return $val; }

function SGET($key,$trim=1){$val=isset($_GET[$key])?$_GET[$key]:'';if ($trim&&is_string($val)) $val=trim($val);return $val;}
function SQET($key,$trim=1){$val=isset($_POST[$key])?$_POST[$key]:'';if ($trim&&is_string($val)) $val=trim($val);return $val;}

function hspc($str){if (!is_string($str)) return $str;return htmlspecialchars($str,ENT_SUBSTITUTE|ENT_COMPAT);}


function apperror($str,$msg=null,$clientfunc=null){		
	header('apperror: '.rawurlencode($str));
	if (isset($clientfunc)) header('ERRFUNC: '.$clientfunc);
	if (isset($msg)) {
		echo $msg;die(); //display custom message in the error body
	} else die('apperror - '.$str); //display default message as error body
}

