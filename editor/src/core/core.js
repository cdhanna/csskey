var core = function(){
	var self = this;
	var parent = document.querySelector('#editor-parent');

	self.components = [];

	self.addComponent = function(){
		var comp = new Component();
		self.components.push(comp);

		self.refreshParent();
		return comp;
	}

	var compNumber = 0;
	function Component(){
		var self = this;
		self.div = document.createElement('div');
		self.style = self.div.style;

		self.style.top = ((.1 + Math.random()*.8)*100) + '%';
		self.style.left = ((.1 + Math.random()*.8)*100) + '%';
		self.style.width = '50px';
		self.style.height = '50px';
		self.style.position = 'absolute';
		self.style['background-color'] = 'orange';

		self.div.addEventListener('click', function(){
			self.select();
		})

		self.id = 'component-' + compNumber;
		self.div.setAttribute('class', 'component')
		self.div.setAttribute('id', self.id);
		compNumber += 1;

		parent.appendChild(self.div);

		self.select = function(){
			toolbar.setForComponent(self);
		}


	}

	self.refreshParent = function(){

		// parent.innerHTML = 'tuna'
	}

	return self;
}();