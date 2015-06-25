<?php

$ua = $_SERVER['HTTP_USER_AGENT'];

if((strpos($ua, 'Android') !== false) && (strpos($ua, 'Mobile') !== false) || (strpos($ua, 'iPhone') !== false) || (strpos($ua, 'Windows Phone') !== false)){
	// スマートフォンからアクセスされた場合
	$ua_type = 0;

}elseif((strpos($ua, 'Android') !== false) || (strpos($ua, 'iPad') !== false)){
	// タブレットからアクセスされた場合
	$ua_type = 1;

} elseif ((strpos($ua, 'DoCoMo') !== false) || (strpos($ua, 'KDDI') !== false) || (strpos($ua, 'SoftBank') !== false) || (strpos($ua, 'Vodafone') !== false) || (strpos($ua, 'J-PHONE') !== false)) {
	// 携帯からアクセスされた場合
	$ua_type = 2;

} else {
	// その他（PC）からアクセスされた場合
	$ua_type = 3;
}

switch($ua_type){
	case 0;
		$menu_display = "none";
		break;
	case 1;
		$menu_display = "none";
		break;
	case 2;
		$menu_display = "none";
		break;
	case 3;
		$menu_display = "block";
		break;
}

?>
