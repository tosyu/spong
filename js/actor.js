function Actor() { this.init(arguments); this.ready(); }
Actor.inherits(ts.core.Class);
Actor.extend({
	'id': 'actor',
	'x': 0,
	'y': 0,
	'width': 0,
	'height': 0,
	'collidable': false,
	'texture': undefined,
	'_draw': function Actor__draw(context, currentTime) {
		if (typeof this.texture != 'undefined') {
			this.draw(context, currentTime);
			if (typeof this['animate'] !== 'undefined') {
				this.animate(context, currentTime);
			}
		}
	},

	'ready': function Actor_ready() {},
	'draw': function Actor_draw(context, currentTime) {},
	'animate': function Actor_animate(context, currentTime) {}

});
