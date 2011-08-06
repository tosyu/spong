function Square() { this.init(arguments); this.ready(); }
Square.inherits(Actor);
Square.extend({
	'id': 'ball',
	'x': 0,
	'y': 0,
	'width': 20,
	'height': 20,
	'velocity': {
		'x': 0,
		'y': 0
	},
	'drawable': true,
	'animated': true,
	'collidable': true,
	'lastTime': 0,
	'animateInterval': 50,

	'ready': function Square_ready() {
		this.log(this.id, 'ready!');
		this.scene.register(this.scene.consts.LAYER_MIDGROUND, this.id, this);
		this.x = parseInt(this.parent.screen.width / 2 - this.width  / 2);
		this.y = parseInt(this.parent.screen.height / 2 - this.height  / 2);
	},

	'draw': function Square_draw(context) {
		context.translate(this.x, this.y)
		context.fillStyle = this.viewport.getColor(255,255,255);
		context.fillRect(0, 0, this.width, this.height);
	},

	'collisionWith': function Square_collisionWith(side, withActor) {
		switch (side) {
			case 0:
				this.velocity.y = 1;
			break;
			case 1:
				this.velocity.x = -1;
			break;
			case 2:
				this.velocity.y = -1;
			break;
			case 3:
				this.velocity.x = 1;
			break;
			default:
				this.log('lol, this side does not exist!');
			break;
		}
	},

	'animate': function Square_animate(currentTime) {
		if (currentTime - this.lastTime >= this.animateInterval) {
			this.x += Math.round(this.velocity.x);
			this.y += Math.round(this.velocity.y);

			if (Math.abs(this.velocity.y) <= 3) {
				this.velocity.y = this.velocity.y < 0 ? this.velocity.y - 0.35 : this.velocity.y + 0.35;
			}
			if (Math.abs(this.velocity.x) <= 3) {
				this.velocity.x = this.velocity.x < 0 ? this.velocity.x - 0.35 : this.velocity.x + 0.35;
			}

			this.animateInterval = currentTime;
		}
	}

});
