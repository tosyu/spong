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
		'y': 0,
		'start': 4,
		'min': 2
	},
	'drawable': true,
	'animated': true,
	'collidable': true,
	'lastTime': 0,
	'animateInterval': 50,

	'ready': function Square_ready() {
		this.log(this.id, 'ready!');
		this.scene.register(this.scene.consts.LAYER_MIDGROUND, this.id, this);
		this.resetPosition();
		this.resetVelocity();
	},

	'resetPosition': function Square_reset() {
		this.x = parseInt(this.parent.screen.width / 2 - this.width  / 2);
		this.y = parseInt(this.parent.screen.height / 2 - this.height  / 2);
	},

	'resetVelocity': function Square_resetVelocity() {
		this.velocity.x = Math.floor(Math.random() * 11) % 2 ? -this.velocity.start : this.velocity.start;
		this.velocity.y = Math.floor(Math.random() * 11) % 2 ? -this.velocity.start : this.velocity.start;
	},

	'draw': function Square_draw(context) {
		context.translate(this.x, this.y)
		context.fillStyle = this.viewport.getColor(255,255,255);
		context.fillRect(0, 0, this.width, this.height);
	},

	'edgeCollisionWith': function Square_collisionWith(side, withActor) {
		var velocityXChange = typeof withActor === 'undefined' ? this.velocity.x : this.velocity.start,
			velocityYChange = typeof withActor === 'undefined' ? this.velocity.y : this.velocity.start;
		switch (side) {
			case 0:
				this.velocity.y = Math.abs(velocityYChange);
			break;
			case 1:
				this.velocity.x = -velocityXChange;
			break;
			case 2:
				this.velocity.y = -velocityYChange;
			break;
			case 3:
				this.velocity.x = Math.abs(velocityXChange);
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

			if (Math.abs(this.velocity.y) >= this.velocity.min) {
				this.velocity.y += (this.velocity.y > 0 ? -0.35 : 0.35) * Math.abs(Math.cos(this.velocity.y/3));
			}
			if (Math.abs(this.velocity.x) >= this.velocity.min) {
				this.velocity.x += (this.velocity.x > 0 ? -0.35 : 0.35) * Math.abs(Math.cos(this.velocity.y/3));
			}

			this.animateInterval = currentTime;
		}
	}

});
