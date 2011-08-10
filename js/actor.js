function Actor() { this.init(arguments); this.ready(); }
Actor.inherits(ts.core.Class);
Actor.extend({
	'id': 'actor',
	'x': 0,
	'y': 0,
	'width': 0,
	'height': 0,
	'collidable': false,
	'collider': true,
	'drawable': false,
	'animated': false,

	'ready': function Actor_ready() {},
	'draw': function Actor_draw(context) {},
	'animate': function Actor_animate(currentTime) {},
	'cornerCollisionWith': function Actor_cornerCollisionWith(corner, actorObject) {},
	'edgeCollisionWith': function Actor_edgeCollisionWith(edge, actorObject) {},
	'pointCollisionWith': function Actor_pointCollisionWith(point, actorObject) {},

	'_draw': function Actor__draw(context) {
		if (this.drawable === true) {
			this.draw(context);
		}
	},

	'_tick': function Actor__tick(currentTime) {
		if (this.animated === true) {
			this.animate(currentTime);
		}
	},

	'getId': function Actor_getId() {
		return this.id;
	},

	'setId': function Actor_setId(id) {
		if (typeof id === 'string') {
			this.id = id;
		} else {
			throw new Error('Actor id must be string');
		}
	},

	'isCollidable': function Actor_isCollidable() {
		return this.collidable;
	},

	'isCollider': function Actor_isCollider() {
		return this.collider;
	},

	'getBoundingBox': function Actor_getBoundingBox() { // in most cases its the same as getCoordinates
		return [{'x': this.x, 'y': this.y },
			    {'x': this.x + this.width, 'y': this.y },
			    {'x': this.x, 'y': this.y + this.height },
			    {'x': this.x + this.width, 'y': this.y + this.height }];
	},

	'getCoordinates': function Actor_getCoords() {
		// basic, square coords, overwrite this func in the extending
		// actor object if you wan't something more complicated
		return [{'x': this.x, 'y': this.y },
				{'x': this.x + this.width, 'y': this.y },
				{'x': this.x, 'y': this.y + this.height },
				{'x': this.x + this.width, 'y': this.y + this.height }];
	},

	'getEdges': function Actor_getEdges() {
		var coords = this.getCoordinates(), i, edges = [];
		for (i = 0; i < coords.length; i++) {
			edges.push([coords[i], coords[ i >= coords.length - 1 ? 0 : i + 1]]);
		}
		return edges;
	}

});
