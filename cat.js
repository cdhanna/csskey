var cat = function(){
	var self = this;


	self.generate = function(parentNode, jsonPath){
		return new Promise(function(success, failure) {
			fetchJson(jsonPath).then(function(json){

				//convert to types
				var anim = new Animation(parentNode, json);
				success(anim);

			});
		});
	}
	self.new = function(parentNode, name){
		var anim = new Animation(parentNode, undefined);
		anim.name = name;
		return anim;
	}


	function Animation(parentNode, json){
		var anim = this;
		anim.parent = parentNode;
		anim.name = json.name;
		anim.durations = json.durations;
		anim.animIndex = 0;
		anim.components = json.components.map(function(componentJson){
			return new Component(componentJson);
		});

		anim.inject = function(){
			anim.parent.style.position = 'relative';
			anim.components.forEach(function(component){
				component.inject(anim.parent);
			});

		};

		anim.play = function(index) {

			return new Promise(function(success){
				anim.animIndex = index || 0;
				anim.components.forEach(function(component){
					component.play();
				})

				setTimeout(function(){
					success();
				}, anim.durations[index]);

			});
		}
		anim.playAll = function(){
			var i = 0;
			function playStage(cb){
				anim.play(i).then(function(){
					i += 1;
					if (i < anim.durations.length){
						playStage();
					}
				})
			}
			playStage();
		}

		anim.stop = function(){
			anim.components.forEach(function(component){
				component.stop();
			})
		}


		// anim.remove = function(){
		// 	if (!anim.injectedStyle) return;
		// 	var head = document.getElementsByTagName('head')[0];
		// 	anim.injectedStyle.remove();
		// }


		

	
		function Keyframe(time, keyframeJson){
			var keyframe = this;

			keyframe.time = time;
			keyframe.styles = keyframeJson;
		}

		function Component(componentJson){
			var component = this;
			// console.log('COMP', componentJson)
			component.id = componentJson.id;
			component.styles = componentJson.styles || {};
			component.keyframes = [];
			if (componentJson.keyframes){
				// component.keyframes = Object.keys(componentJson.keyframes).map(function(key){
				// 	var innerJson = componentJson.keyframes[key];
				// 	return new Keyframe(key, innerJson);
				// })

				// key frames are an array of objects
				componentJson.keyframes.forEach(function(keyframeSet){
					// component.keyframes.push( )
					console.log('FRAME', keyframeSet)
					var anim = Object.keys(keyframeSet).map(function(key){
						return new Keyframe(key, keyframeSet[key]);
					})
					component.keyframes.push( anim)
				});

				console.log(component)
			} 

			component.children = [];
			if (componentJson.children){
				component.children = Object.keys(componentJson.children).map(function(child){
					var innerJson = componentJson.children[child];
					// console.log(innerJson)
					return new Component(innerJson);
				})
			}

			component.div = undefined;
			component.styleObject = undefined;

			component.getFullId = function(){
				return 'cat-' + anim.name + '-' + component.id;
			}
			component.getAnimationName = function(index){
				return component.getFullId() + '-anim' + ( (index!=undefined) ? ('-' + index) : '');
			}


			component.getCss = function(){
				var rule = '';


				component.keyframes.forEach(function(keyframeSet, index){
					rule += '@keyframes ' + component.getAnimationName() +'-'+index + ' {';
					rule += keyframeSet.reduce(function(agg, curr){

						var subRule = curr.time + '% {';
						Object.keys(curr.styles).forEach(function(style){
							subRule += style + ': ' + curr.styles[style] + '; '
						})
						subRule += '} ';

						return agg + subRule;
					}, '');
					rule += '} '
				})
				
				rule += '#' + component.getFullId() + ' { ';
				Object.keys(component.styles).forEach(function(style){
					rule += style + ': ' + component.styles[style] + ';';
				});
				rule += '}';

				return rule;
			}

			component.inject = function(theParent){
				var div = document.createElement('div');
				div.setAttribute('id', component.getFullId());

				var style = document.createElement('style');
				style.setAttribute('type', 'text/css');
				style.appendChild(document.createTextNode(component.getCss()));

				var head = document.getElementsByTagName('head')[0];
				theParent.appendChild(div);
				head.appendChild(style);

				component.div = div;
				component.styleObject = style;

				component.children.forEach(function(child){
					child.inject(div);
				});
			}

			component.play = function(){

				component.div.style.animation = component.getAnimationName(anim.animIndex) + ' ' + anim.durations[anim.animIndex] + 'ms 0s 1 forwards';
				component.children.forEach(function(child){
					child.play();
				})
			}

			component.stop = function(){
				component.div.style.animation = '';
				component.children.forEach(function(child){
					child.stop();
				})
			}
		}
	}




	function fetchJson(url){
		return new Promise(function(success, failure){
			function reqListener(){
				if (this.status === 200){
					var result = JSON.parse(this.responseText);
					success(result);
				} else {
					failure(this);
				}
			}
			var request = new XMLHttpRequest();
			request.addEventListener('load', reqListener);
			request.open('GET', url);
			request.send();

		});
	}



	return self;
}();