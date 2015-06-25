/*
 * hmDenko
 *
 * powered by tsumesan
 * copyright 2015 hogemix laboratory all rights reserved.
 *
 */
function hmScene(){

	this.nextScene;
	this.nowScene;
	this.parentNowScene;
	this.childNowScene;
	this.sceneParam

	this.component;
	this.componentParam;
	this.spice;

	// 残キャッシュ対策「?=nnn」の文字列作成
	hmScene.prototype.spicer = function(){
		var spiceTmp = Math.floor(Math.random() * 1000);
		this.spice = "?" + spiceTmp;
	}

	// ajaxメソッド
	hmScene.prototype.ajax = function(method, param, action, acync){

		if(method == "GET"){
			action += "?" + param;
			param = null;
		}

		var obj;

		if(window.XMLHttpRequest){
			obj = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}else{
			obj = null;
		}

		obj.open(method, action, acync);
		obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		obj.send(param);

		var ret = obj.responseText;

		return ret;

	}

	// シーン切り替え
	hmScene.prototype.change = function(nextScene, sceneParam){

		this.spicer();

		window.scroll(0,0);

		this.nowScene   = nextScene;
		this.sceneParam = sceneParam;

		var nowSceneArr    = this.nowScene.split("__");
		this.parentNowScene = nowSceneArr[0];

		if(nowSceneArr[1] == undefined){
			this.childNowScene = nowSceneArr[0];
		}else{
			this.childNowScene = nowSceneArr[1];
		}


		var wrapElem = document.getElementById("sceneWrap");
		if(wrapElem == null){
			var wrapElem = document.createElement("div");
			wrapElem.id  = "sceneWrap";
			document.body.appendChild(wrapElem);
		}

		var tplData = this.ajax("POST",
				"url=" + location.href + "/hmGame/scenes/" + this.parentNowScene + "/template/" + this.childNowScene + ".tpl",
				"./hmGame/lib/scene.php",
				false);

		wrapElem.innerHTML = tplData;

		var sceneScript = document.getElementById("parentSceneScript");
		if(sceneScript != null){
			document.head.removeChild(sceneScript);
		}

		var scriptElem = document.createElement("script");
		scriptElem.id = "parentSceneScript";
		var src = location.href + "/hmGame/scenes/" + this.parentNowScene + "/dynamic/" + this.parentNowScene + ".js" + this.spice;
		scriptElem.src = src;
		document.head.appendChild(scriptElem);

	}

	// アクションメソッドコール
	hmScene.prototype.actCall = function(){
		var callAct = "act_" + this.childNowScene + "(\"" + this.sceneParam + "\");"
		eval(callAct);
	}

	// サーバコール
	hmScene.prototype.serverCall = function(fileName, param, componentFlg){

		if(componentFlg == true){
			var dir = "component";
		}else{
			var dir = "scenes";
		}

		var filePath = location.href + "/hmGame/" + dir + "/" + this.parentNowScene + "/dynamic/" + fileName + this.spice;

		return tplData = this.ajax("POST",
					param,
					filePath,
					false);
	}

	// コンポーネント呼び出し
	hmScene.prototype.makeComponent = function(componentName, param, scriptFlg){

		this.spicer();

		var result = this.ajax("POST",
				"url=" + location.href + "/hmGame/component/" + componentName + "/template/" + componentName + ".tpl",
				"./hmGame/lib/scene.php",
				false);

		var scriptElem = document.createElement("script");
		scriptElem.id = "componentScript_" + componentName;
		var src = "./hmGame/component/" + componentName + "/dynamic/" + componentName + ".js" + this.spice;
		scriptElem.src = src;
		document.head.appendChild(scriptElem);

		this.component = componentName;
		return result;
	}

	// コンポーネント呼び出し全自動版
	hmScene.prototype.AutoMakeComponent = function(componentName, param, scriptFlg){

		if(document.getElementById("component_" + componentName) != null){
			return;
		}

		var result = this.makeComponent(componentName, param, scriptFlg);

		var componentElem       = document.createElement("div");
		componentElem.id        = "component_" + componentName;
		componentElem.innerHTML = result;
		document.body.appendChild(componentElem);

		return result;

	}

	// コンポーネント削除
	hmScene.prototype.deleteComponent = function(componentName){

		var componentScript = document.getElementById("componentScript_" + componentName);
		if(componentScript != null){
			document.head.removeChild(componentScript);
		}

		var component = document.getElementById("component_" + componentName);
		if(component != null){
			document.body.removeChild(component);
		}

	}

	hmScene.prototype.id = function(elemId){
		return document.getElementById(elemId);
	}

	hmScene.prototype.class = function(elemClass){
		return document.getElementsByClassName(elemClass);
	}

	hmScene.prototype.name = function(elemName){
		return document.getElementsByName(elemName);
	}

	hmScene.prototype.tag = function(elemTag){
		return document.getElementsByTagName(elemTag);
	}

}
