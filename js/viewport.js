function Viewport() { this.init(arguments); this.run(); }
Viewport.inherits(ts.core.Class);
Viewport.extend({
	'run': function Viewport_run() {
		this.log('screen size is ', this.width, 'x', this.height);
		this.buffer = 0;

		this.canvasElements = [];
		this.contexts = [];

		var i, maxCanvasElements = this.doubleBuffering ? 2 : 1;
		for (i = 0; i < maxCanvasElements; i++) {
			this.canvasElements[i] = document.createElement('canvas');
			this.canvasElements[i].setAttribute('id', ['buffer', i].join(''));
			this.canvasElements[i].setAttribute('width', this.width);
			this.canvasElements[i].setAttribute('height', this.height);
			this._toggleVisibility(this.canvasElements[i]);
			window.document.body.appendChild(this.canvasElements[i]);
			this.contexts[i] = this.canvasElements[i].getContext('2d');
		}
		this._toggleVisibility(this.canvasElements[this.buffer]);

		this.clear();
	},	

	'draw': function Viewport_draw() {
		// @TODO some drawing funcions
		this.swapBuffers();	
	},	

	'clear': function Viewport_clear() {
		var ctx = this.getContext();
		ctx.save();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();
		this.swapBuffers();
	},

	'swapBuffers': function Viewport_swapBuffers() {
		if (this.doubleBuffering) {
			this._toggleVisibility(this.canvasElements[this.buffer]);
			this._toggleVisibility(this.canvasElements[this._getBufferID()]);
			this.buffer = this._getBufferID();
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
		if (element.getAttribute('style') && element.getAttribute('style').length > 0 && element.getAttribute('style').indexOf('hidden') !== -1) {
			element.setAttribute('style', 'display:block;position:absolute;top:0;left:0;visibility:visible;background-color:#000;');
		} else {
			element.setAttribute('style', 'display:block;position:absolute;top:0;left:0;visibility:hidden;background-color:#000;');
		}
	}
});