function Actor() { this.init(arguments); this.ready(); }
Actor.inherits(ts.core.Class);
Actor.extend({
	'id': 'actor',
	'x': 0,
	'y': 0,
	'rotation': 0,
	'width': 0,
	'height': 0,
	'collidable': false,
	'collider': true,
	'collidesWithScreen': true,
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

	'getRotation': function Actor_getRotation() {
		return this.rotation;
	},

	'setRotation': function Actor_setRotation(rotation) {
		this.rotation = isNan(parseInt(rotation)) === false ? parseInt(rotation) : 0;
	},

	'isCollidable': function Actor_isCollidable() {
		return this.collidable;
	},

	'isCollider': function Actor_isCollider() {
		return this.collider;
	},

	'isCollidingWithScreen': function Actor_isCollidingWithScreen() {
		return this.collidesWithScreen;
	},

	'getBoundingBox': function Actor_getBoundingBox() { // in most cases its the same as getCoordinates
		return [{'x': this.x, 'y': this.y },
			    {'x': this.x + this.width, 'y': this.y },
			    {'x': this.x + this.width, 'y': this.y + this.height },
			    {'x': this.x, 'y': this.y + this.height }];
	},

	'getCoordinates': function Actor_getCoords() {
		// basic, square coords, overwrite this func in the extending
		// actor object if you wan't something more complicated
		return [{'x': this.x, 'y': this.y },
			    {'x': this.x + this.width, 'y': this.y },
			    {'x': this.x + this.width, 'y': this.y + this.height },
			    {'x': this.x, 'y': this.y + this.height }];
	},

	'getEdges': function Actor_getEdges() {
		var i, edges = [], coords = this.getCoordinates(), imax = coords.length, iNext;
		for (i = 0; i < imax; i++) {
			iNext = i >= imax - 1 ? 0 : i + 1;
			edges.push({'p1':coords[i], 'p2':coords[iNext]});
		}
		return edges;
	}

});
