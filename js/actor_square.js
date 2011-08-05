function Square() { this.init(arguments); this.ready(); }
Square.inherits(Actor);
Square.extend({
	'id': 'actor_square',
	'x': 0,
	'y': 0,
	'width': 10,
	'height': 10,
	'drawable': true,

	'ready': function Square_ready() {
		this.log(this.id, 'ready!');
		this.scene.register(this.scene.consts.LAYER_MIDGROUND, this.id, this);
	},

	'draw': function Square_draw(context) {
		context.fillStyle = this.viewport.getColor(255,255,255);
		context.fillRect(this.x, this.y, this.width, this.height);
	},

	'animate': function Square_animate(currentTime) {
		this.x++;
		this.y++;
	}

});
