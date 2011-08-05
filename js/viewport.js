function Viewport() { this.init(arguments); this.run(); }
Viewport.inherits(ts.core.Class);
Viewport.extend({
	'consts': {
		'LAYER_BACKGROUND_FAR': 'LAYER_BACKGROUND_FAR',
		'LAYER_BACKGROUND': 'LAYER_BACKGROUND',
		'LAYER_MIDGROUND': 'LAYER_MIDGROUND',
		'LAYER_FOREGROUND': 'LAYER_FOREGROUND',
		'LAYER_FOREGROUND_CLOSE': 'LAYER_FOREGROUND_CLOSE'
	},

	'run': function Viewport_run() {
		this.log('screen size is ', this.width, 'x', this.height);
		this.buffer = 0;
		this.drawers = {};

		this.canvasElements = [];
		this.contexts = [];

		var i, maxCanvasElements = this.doubleBuffering ? 2 : 1;
		for (i = 0; i < maxCanvasElements; i++) {
			this.canvasElements[i] = document.createElement('canvas');
			this.canvasElements[i].setAttribute('id', ['buffer', i].join(''));
			this.canvasElements[i].setAttribute('width', this.width);
			this.canvasElements[i].setAttribute('height', this.height);
			this.canvasElements[i].setAttribute('style', '');
			this._toggleVisibility(this.canvasElements[i]);
			window.document.body.appendChild(this.canvasElements[i]);
			this.contexts[i] = this.canvasElements[i].getContext('2d');
		}
		this._toggleVisibility(this.canvasElements[this.buffer]);

		this.clear();
		this.swapBuffers();
	},
	
	'register': function Viewport_register(layer, id, actorObject) {
		this.log('Viewport registration', arguments);

		if (typeof layer === 'undefined') {
			throw new Error('Layer not defined');
		} else if (typeof this.consts[layer] === 'undefined') {
			throw new Error('Layer does not exist!')
		}

		if (typeof id === 'undefined') {
			throw new Error('Id not defined');
		}

		if (typeof actorObject === 'undefined') {
			throw new Error('Actor not defined');
		}

		if (typeof this.drawers[layer] === 'undefined') {
			this.drawers[layer] = {};
		}

		if (typeof this.drawers[layer][id] !== 'undefined') {
			throw new Error('Actor ID already defined for this layer')
		}

		this.drawers[layer][id] = actorObject;		
	},

	'unregister': function Viewport_unregister(layer, id) {
		this.log('Viewport unregistration', arguments);

		if (typeof layer === 'undefined') {
			throw new Error('Layer not defined');
		} else if (typeof this.consts[layer] === 'undefined') {
			throw new Error('Layer does not exist!')
		}

		if (typeof id === 'undefined') {
			throw new Error('Id not defined');
		}

		if (typeof this.drawers[layer] === 'undefined') {
			throw new Error('Nothing was registered in this layer')
		}

		if (typeof this.drawers[layer][id] === 'undefined') {
			throw new Error('ID was not registered in this layer')
		}

		delete this.drawers[layer][id];
	},

	'draw': function Viewport_draw() {
		// clear the back buffer
		this.clear();
		// draw
		var layer, id, ctx = this.getContext();
		for (layer in this.drawers) {
			if (this.drawers.hasOwnProperty(layer)) {
				for (id in this.drawers[layer]) {
					if (this.drawers[layer].hasOwnProperty(id)) {
						ctx.save();
						this.drawers[layer][id]._draw(ctx, this.parent.currentTime());
						ctx.restore();
					}
				}
			}
		}

		// flip buffers
		this.swapBuffers();	
	},	

	'clear': function Viewport_clear() {
		var ctx = this.getContext();
		ctx.save();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();
	},

	'swapBuffers': function Viewport_swapBuffers() {
		if (this.doubleBuffering) {
			this._toggleVisibility(this.canvasElements[this.buffer]);
			this._toggleVisibility(this.canvasElements[this._getBufferID()]);
			this.buffer = this._getBufferID();
		}
	},

	'getColor': function Viewport_getColor(r, g, b, a) {
		if (typeof a === 'undefined') {
			return ['rgb(', [r, g, b].join(','), ')'].join('');
		} else {
			return ['rgba(', [r, g, b, a].join(','), ')'].join('');
		}
	},

	'getContext': function Viewport_getBuffer() {
		return this.contexts[this._getBufferID()];
	},

	//gets the next buffer ID
	'_getBufferID': function Viewport_getBuffer() {
		return this.buffer == 0 && this.doubleBuffering ? this.buffer + 1 : 0;
	},

	'_toggleVisibility': function Viewport__toggleVisibility(element) {
		if (element.getAttribute('style').indexOf('hidden') !== -1) {
			element.setAttribute('style', 'display:block;position:absolute;top:0;left:0;visibility:visible;background-color:#000;');
		} else {
			element.setAttribute('style', 'display:block;position:absolute;top:0;left:0;visibility:hidden;background-color:#000;');
		}
	}
});
