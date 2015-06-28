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
