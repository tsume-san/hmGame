/*
 * hmScene
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

/*
 * hmMap
 *
 * powered by tsumesan
 * copyright 2015 hogemix laboratory all rights reserved.
 *
 */
function hmMap(){

	var mapYLen;
	var mapZLen;
	var mapXLen;

	hmMap.prototype.makeMap = function(){

		mapYLen = this.mapArr.length;
		mapZLen = this.mapArr[0].length;
		mapXLen = this.mapArr[0][0].length;

		for(i=0; i<mapYLen; i++){
			for(j=0; j<mapZLen; j++){
				for(k=0; k<mapXLen; k++){
					// ゼロは何もない空間
					if(this.mapArr[i][j][k] != 0){
						// マップチップ自体の座標とHTML上の座標を取得して要素の生成
						var resCoord = this.getCoord();
						var mapChipElem   = document.createElement("img");
						mapChipElem.id    = "map_" + i + j + k;
						mapChipElem.src   = this.mapChipPath;
						mapChipElem.style.clip = resCoord[0];
						mapChipElem.style.top  = resCoord[1];
						mapChipElem.style.left = resCoord[2];
						document.getElementById(this.mapSetElemById).appendChild(mapChipElem);
					}
				}
			}
		}
	}

	hmMap.prototype.getCoord = function(){

		var mapNo        = this.mapArr[i][j][k];
		var mapChipMoveY = this.mapChipSizeY / 2; // マップチップ上での座標計算縦移動px数
		var mapChipMoveX = this.mapChipSizeX / 2; // マップチップ上での座標計算横移動px数

		// 指定マップチップ単体画像のマップチップ上での座標計算
		var mapChipRecordY = (Math.floor(mapNo / this.mapChipRecordNum));
		var mapChipRecordX = (mapNo % this.mapChipRecordNum) -1;

		var rectTop    = mapChipRecordY * this.mapChipSizeY;
		var rectRight  = mapChipRecordX * this.mapChipSizeX + this.mapChipSizeX;
		var rectBottom = mapChipRecordY * this.mapChipSizeY + this.mapChipSizeY;
		var rectLeft   = mapChipRecordX * this.mapChipSizeX;

		var resultRectVal = "rect(";
		resultRectVal    += rectTop    + "px,";
		resultRectVal    += rectRight  + "px,";
		resultRectVal    += rectBottom + "px,";
		resultRectVal    += rectLeft   + "px)";

		// HTML上でマップチップ単体画像が親要素の左上に表示される座標
		var fixTopVal  = rectTop  * -1;
		var fixLeftVal = rectLeft * -1;

		var htmpImgMoveFloor = this.mapChipSizeY / 2; // HTML上での階層の縦移動px数
		var htmpImgMoveY     = this.mapChipSizeY / 4; // HTML上での縦移動px数
		var htmpImgMoveX     = this.mapChipSizeX / 2; // HTML上での横移動px数

		// HTML上でXYZ軸すべての値が0の時のマップチップ単体画像が表示される座標
		var defaultTopVal  = (mapYLen - 1) * mapChipMoveY + fixTopVal;
		var defaultLeftVal = (mapZLen - 1) * mapChipMoveX + fixLeftVal;

		// HTML上で指定マップチップ単体画像が表示されるの座標計算
		var plusTopY  = i * htmpImgMoveFloor * -1;
		var plusTopZ  = j * htmpImgMoveY;
		var plusleftZ = j * htmpImgMoveX * -1;
		var plusTopX  = k * htmpImgMoveY;
		var plusleftX = k * htmpImgMoveX;

		var resultPlusTop  = (defaultTopVal + plusTopY + plusTopZ + plusTopX) + "px";
		var resultPlusLeft = (defaultLeftVal + plusleftZ + plusleftX) + "px";

		return [resultRectVal, resultPlusTop, resultPlusLeft];
	}

}
