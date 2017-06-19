
var toolbar = function(){
	var self = this;
	var addBtn = document.querySelector('#addBtn');

	addBtn.addEventListener('click', function(){
		console.log('new div')
		var component = core.addComponent();
		self.setForComponent(component)
	});


	self.setForComponent = function(component){
		var idInput = document.querySelector('#component-editor #name input');
		var styles = document.querySelector('#component-editor #styles');
	
		idInput.value = component.id;
		styles.value = component.style.cssText
			.split(';')
			.map(function(line){
				return line.trim();
			})
			.join(';\n');

		document.querySelector('#refreshBtn').onclick = function(){
			console.log('clicked', styles.value);
			component.id = idInput.value;
			component.div.setAttribute('id', idInput.value);
			component.div.style.cssText = styles.value;
		}

	}



	return self;
}();