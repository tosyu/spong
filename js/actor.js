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

	'ready': function Actor_ready() {},
	'draw': function Actor_draw(context) {},
	'animate': function Actor_animate(currentTime) {},
	'collisionWith': function Actor_collisionWith(side) {},

	'_draw': function Actor__draw(context) {
		if (this.drawable === true) {
			this.draw(context);
		}
	},

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
	},

	'getEdges': function Actor_getEdges() {
		var coords = this.getCoordinates(), i, edges = [];
		for (i = 0; i < coords.length; i++) {
			edges.push([coords[i], coords[ i >= coords.length - 1 ? 0 : i + 1]]);
		}
		return edges;
	},

	'collisionDetect': function Actor_collisionDetect() {
		var actors = this.scene.getActors(this.scene.consts.LAYER_MIDGROUND), i, collisionEdge = false;
		for (i in actors) {
			if (actors[i].id !== this.id) {
				if (actors[i].isCollidable() === true) {
					if ((collisionEdge = this._collisionDetectWith(actors[i])) !== false) {
						this.collisionWith(collisionEdge[0], actors[i]);
						actors[i].collisionWith(collisionEdge[1], this);
					}
					collisionEdge = false;
				}
			}
		}

		// screen bounds bump
		if (this.x <= 0) {
			this.collisionWith(3); //wall left side bump
		} else if (this.x >= this.parent.screen.width - this.width) {
			this.collisionWith(1); //wall right side bump
		}

		if (this.y <= 0) {
			this.collisionWith(0); //wall top side bump
		} else if (this.y >= this.parent.screen.height - this.height) {
			this.collisionWith(2); //wall bottom side bump
		}
	},

	'_collisionDetectWith': function Actor_collisionDetectWith(actor) { // neds work @TODO
		var edges = actor.getEdges(), myEdges = this.getEdges(), i, x;
		for (i in myEdges) {
			for (x in edges) {
				if (this._edgesOverlap(myEdges[i][0]['x'], myEdges[i][0]['y'], myEdges[i][1]['x'], myEdges[i][1]['y'], edges[x][0]['x'], edges[x][0]['y'], edges[x][1]['x'], edges[x][1]['y']) === true) {
					return [parseInt(i), parseInt(x)];
				}
			}
		}

		return false;
	},

	'_edgesOverlap': function Actor__edgesOverlap(x1, y1, x2, y2, x3, y3, x4, y4) {
		var xi, yi, d;

		// basic paraller collisions
		if (y1 === y3 || y2 === y4) {
			if ((Math.min(x3, x4) <= x1 && x1 <= Math.max(x3, x4)) || (Math.min(x3, x4) <= x1 && x1 <= Math.max(x3, x4)) || (Math.min(x3, x4) <= x2 && x2 <= Math.max(x3, x4)) || (Math.min(x3, x4) <= x2 && x2 <= Math.max(x3, x4))) {
				return true;
			}
		} else if (x1 === x3 || x2 === x4) {
			if ((Math.min(y3, y4) <= y1 && y1 <= Math.max(y3, y4)) || (Math.min(y3, y4) <= y1 && y1 <= Math.max(y3, y4)) || (Math.min(y3, y4) <= y2 && y2 <= Math.max(y3, y4)) || (Math.min(y3, y4) <= y2 && y2 <= Math.max(y3, y4))) {
				return true;
			}
		}

		// intersection collisions (for more than blocks :))
		d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
		if (d !== 0) {
			xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
    		yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;
    		if (Math.min(x1, x2) <= xi && xi <= Math.max(x1, x2)
		     && Math.min(y1, y2) <= yi && yi <= Math.max(y1, y2)
		     && Math.min(x3, x4) <= xi && xi <= Math.max(x3, x4)
		     && Math.min(y3, y4) <= yi && yi <= Math.max(y3, y4)) {
		     	return true;
		     }
		}
		return false;
	}

});
