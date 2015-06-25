scene.actCall();

// サンプルシーンのアクションメソッド
function act_test(){
	scene.id("nextButton").addEventListener("click",
							function(){
								// シーン切り替えメソッド
								scene.change("sample");
							}, false);
}
