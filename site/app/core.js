function gid(id){
	return document.getElementById(id);
}

function hb(){var now=new Date(); var hb=now.getTime();return hb;}

function ajxnb(u,data,f){
	var rq=new XMLHttpRequest();	
	rq.onreadystatechange=function(){
		if (rq.readyState==4){
			f(rq);
		}
	}
	var method='POST'; if (!data) method='GET';
	if(u.indexOf('?')===-1){
		u=u+'?';
	}
	rq.open(method,u+'&hb='+hb(),true);
	rq.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
	rq.setRequestHeader('X-Token',document.webtoken);
	rq.send(data);  	
}