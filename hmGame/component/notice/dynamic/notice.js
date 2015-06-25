scene.id("component_notice").addEventListener("click",
					function(){
						// コンポーネントを消します。
						scene.deleteComponent("notice")
					}, false);
scene.id("notice_word").innerHTML = "component test! notice:click me!!!";
