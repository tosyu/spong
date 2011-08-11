function Viewport() { this.init(arguments); this.run(); }
Viewport.inherits(ts.core.Class);
Viewport.extend({

	'run': function Viewport_run() {
		this.log('screen size is ', this.width, 'x', this.height);
		this.scenes = {};
		this.currentScene = undefined;

		this.canvasElement = null;
		this.context = null;
		this.backBuffer = null;

		var viewport = document.createElement('div');
		viewport.setAttribute('id', 'viewport');
		viewport.setAttribute('style', ['position:relative;padding:0;margin:0;width:', this.width, 'px;height:', this.height, 'px;'].join(''));
		document.body.appendChild(viewport);

		this.canvasElement = document.createElement('canvas');
		this.canvasElement.setAttribute('viewport_canvas');
		this.canvasElement.setAttribute('width', this.width);
		this.canvasElement.setAttribute('height', this.height);
		this.canvasElement.setAttribute('style', 'display:block;position:absolute;top:0;left:0;visibility:visible;background-color:#000;');
		viewport.appendChild(this.canvasElement);

		this.context = this.canvasElement.getContext('2d');
		if (this.doubleBuffering === true) {
			var backBufferCanvas = document.createElement('canvas');
			backBufferCanvas.width = this.canvasElement.width;
			backBufferCanvas.height = this.canvasElement.height;
			this.backBuffer = backBufferCanvas.getContext('2d');
		}

		this.clear();
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

	'getCurrentScene': function Viewport_getCurrentScene() {
		return this.scenes[this.currentScene];
	},

	'clear': function Viewport_clear() {
		var ctx = this.getContext();
		ctx.save();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();
	},

	'swapBuffers': function Viewport_swapBuffers() {
		if (this.doubleBuffering) {
			this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
			this.context.drawImage(this.getContext().canvas, 0, 0);
		}
	},

	'getColor': function Viewport_getColor(r, g, b, a) {
		if (typeof a === 'undefined') {
			return ['rgb(', [r, g, b].join(','), ')'].join('');
		} else {
			return ['rgba(', [r, g, b, a].join(','), ')'].join('');
		}
	},

	'getContext': function Viewport_geContext() {
		if (this.doubleBuffering === true) {
			return this.backBuffer;
		} else {
			return this.context;
		}
	}
});
