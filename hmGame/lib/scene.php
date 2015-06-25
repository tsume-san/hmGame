<?php

if(isset($_POST["url"])){
	$url = $_POST["url"];
	echo(scene($url));
}

function scene($url){
	$tpl_data = file_get_contents($url);
	return $tpl_data;
}
?>

