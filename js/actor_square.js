function Square() { this.init(arguments); this.ready(); }
Square.inherits(Actor);
Square.extend({
	'id': 'actor_square',
	'x': 0,
	'y': 0,
	'width': 10,
	'height': 10,
	'texture': false,

	'ready': function Square_ready() {
		this.log(this.id, 'ready!');
		this.viewport.register(this.viewport.consts.LAYER_MIDGROUND, this.id, this);	
	},

	'draw': function Square_draw(context, currentTime) {		
		context.fillStyle = this.viewport.getColor(255,255,255);
		context.fillRect(this.x, this.y, this.width, this.height);		
	},
	'animate': function Square_animate(context, currentTime) {
		this.x++;
		this.y++;
	}

});
