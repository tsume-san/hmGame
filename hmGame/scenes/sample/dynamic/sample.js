scene.actCall();

// サンプルシーンのアクションメソッド
function act_sample(){
	// #hogeの要素へ顔文字を挿入
	scene.id("hoge").innerHTML = "(^_^)b";

	// ボタンを押すとsampleの子シーンhogeへシーン切り替え。引数は"hoge!hoge!"
	scene.id("nextButton").addEventListener("click",
							function(){
								// シーン切り替えメソッド
								scene.change("sample__hoge", "hoge!hoge!");
							}, false);

	// ボタンを押すとtestへシーン切り替え
	scene.id("testButton").addEventListener("click",
							function(){
								// シーン切り替えメソッド
								scene.change("test");
							}, false);

	// ボタンを押すとコンポーネント機動
	scene.id("popComponent").addEventListener("click",
							function(){
								scene.AutoMakeComponent("notice");
							}, false);
}

// サンプルシーンの子シーンhogeのアクションメソッド
function act_hoge(param){
	alert("引数\"" + param + "\"を受けとりました。");

	scene.id("nextButton").addEventListener("click",
							function(){
								// シーン切り替えメソッド
								scene.change("sample");
							}, false);

}
