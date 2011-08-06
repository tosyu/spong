function Actor() { this.init(arguments); this.ready(); }
Actor.inherits(ts.core.Class);
Actor.extend({
	'id': 'actor',
	'x': 0,
	'y': 0,
	'width': 0,
	'height': 0,
	'collidable': false,
	'drawable': false,
	'animated': false,
	'_draw': function Actor__draw(context) {
		if (this.drawable === true) {
			this.draw(context);
		}
	},

	'ready': function Actor_ready() {},
	'draw': function Actor_draw(context) {},
	'animate': function Actor_animate(currentTime) {},
	'collisionDetect': function Actor_collisionDetect() {},
	'_tick': function Actor__tick(currentTime) {
		if (this.animated === true) {
			this.animate(currentTime);
		}

		if (this.collidable === true) {
			this.collisionDetect();
		}
	},

	'isCollidable': function Actor_isCollidable() {
		return this.collidable;
	},

	'getCoordinates': function Actor_getCoords() {
		// basic, square coords, overwrite this func in the extending
		// actor object if you wan't something more complicated
		return [{'x': this.x, 'y': this.y },
				{'x': this.x + this.width, 'y': this.y },
				{'x': this.x, 'y': this.y + this.height },
				{'x': this.x + this.width, 'y': this.y + this.height }];
	}

});
