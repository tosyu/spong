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
	'animated': true,
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
	}

});
