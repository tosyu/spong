function Viewport() { this.init(arguments); this.run(); }
Viewport.inherits(ts.core.Class);
Viewport.extend({

	'run': function Viewport_run() {
		this.log('screen size is ', this.width, 'x', this.height);
		this.buffer = 0;
		this.scenes = {};
		this.currentScene = undefined;

		this.canvasElements = [];
		this.contexts = [];

		var viewport = document.createElement('div');
		viewport.setAttribute('id', 'viewport');
		viewport.setAttribute('style', ['position:relative;padding:0;margin:0;width:', this.width, 'px;height:', this.height, 'px;'].join(''));
		document.body.appendChild(viewport);

		var i, maxCanvasElements = this.doubleBuffering ? 2 : 1;
		for (i = 0; i < maxCanvasElements; i++) {
			this.canvasElements[i] = document.createElement('canvas');
			this.canvasElements[i].setAttribute('id', ['buffer', i].join(''));
			this.canvasElements[i].setAttribute('width', this.width);
			this.canvasElements[i].setAttribute('height', this.height);
			this.canvasElements[i].setAttribute('style', '');
			this._toggleVisibility(this.canvasElements[i]);
			viewport.appendChild(this.canvasElements[i]);

			this.contexts[i] = this.canvasElements[i].getContext('2d');
		}
		this._toggleVisibility(this.canvasElements[this.buffer]);

		this.clear();
		this.swapBuffers();
	},

	'register': function Viewport_register(sceneId, sceneObject) {
		this.log('Viewport scene registration', arguments);

		if (typeof sceneId === 'undefined') {
			throw new Error('Scene not defined');
		}

		if (typeof sceneObject === 'undefined') {
			throw new Error('Scene not defined');
		}

		this.scenes[sceneId] = sceneObject;
	},

	'unregister': function Viewport_unregister(sceneId) {
		this.log('Viewport scene unregistration', arguments);

		if (typeof sceneId === 'undefined') {
			throw new Error('Scene not defined');
		}

		delete this.scenes[sceneId];
	},

	'draw': function Viewport_draw() {
		if (typeof this.currentScene === 'undefined') {
			throw new Error('No scene selected!');
		}
		// clear the back buffer
		this.clear();
		// draw
		var ctx = this.getContext();
        this.scenes[this.currentScene]._draw(ctx);

		// flip buffers
		this.swapBuffers();
	},

	'setScene': function Viewport_setScene(sceneId) {
		this.log('Select scene', sceneId);

		if (typeof this.scenes[sceneId] === 'undefined') {
			throw new Error('Scene does not exist!');
		}
		this.currentScene = sceneId;
	},

	'getScenes': function Viewport_getScenes() {
		return this.scenes;
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
