function Paddle() { this.init(arguments); this.ready(); }
Paddle.inherits(Actor);
Paddle.extend({
	'id': 'paddle',
	'x': 0,
	'y': 0,
	'width': 18,
	'height': 120,
	'drawable': true,
	'drawable': true,
	'animated': true,

	'draw': function Paddle_draw(context) {
		context.translate(this.x, this.y);
		context.fillStyle = this.viewport.getColor(255,255,255);
		context.fillRect(0, 0, this.width, this.height);
	}

});
