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

	'collisionDetect': function Square_collisionDetect() {
		var actors = this.scene.getActors(this.scene.consts.LAYER_MIDGROUND), i;
		for (i in actors) {
			if (actors[i].isCollidable() === true) {
				this._collisionDetectWith(actors[i]);
			}
		}

		// screen bounds bump
		if (this.x <= 0) {
			this.velocity.x = 1;
		} else if (this.x >= this.parent.screen.width - this.width) {
			this.velocity.x = -1;
		}

		if (this.y <= 0) {
			this.velocity.y = 1;
		} else if (this.y >= this.parent.screen.height - this.height) {
			this.velocity.y = -1;
		}
	},

	'_collisionDetectWith': function Square_collisionDetectWith(actor) { // neds work @TODO
		var coords = actor.getCoordinates(), i, myCoords = this.getCoordinates(), x;
		for (i = 0; i < myCoords.length; i++) {
			var myStartPoint = myCoords[i];
			var myEndPoint = myCoords[ i >= myCoords.length - 1 ? 0 : i + 1 ];
			for (x = 0; x < coords.length; x++) {
				var startPoint = coords[i];
				var endPoint = coords[ x >= coords.length - 1 ? 0 : x + 1 ];
				if (this._linesOverlap({'start': myStartPoint, 'end': myEndPoint}, {'start': startPoint, 'end': endPoint }) === true) {
					this.log('collision!');
					switch (i) {
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
				}
			}
		}
	},

	'_linesOverlap': function Square_linesOverlap(line1, line2) { // need work @TODO
		var a1 = line1['end']['y'] - line1['start']['y'];
		var b1 = line1['start']['x'] - line1['end']['x'];
		var c1 = a1 * line1['start']['x'] + b1 * line1['end']['y'];

		var a2 = line2['end']['y'] - line2['start']['y'];
		var b2 = line2['start']['x'] - line2['end']['x'];
		var c2 = a2 * line2['start']['x'] + b2 * line2['end']['y'];

		var det = a1 * b2 - a2 * b1;
		if (det == 0) {
			return false;
		} else {
			var x = (b2 * c1 - b1 * c2) / det;
			var y = (a1 * c2 - a2 * c1) / det;
			// lol, shitty now
			if (Math.min(line1['start']['x'], line1['end']['x']) <= x && x <= Math.max(line1['start']['x'], line1['end']['x'])) {
				if (Math.min(line1['start']['y'], line1['end']['y']) <= y && y <= Math.max(line1['start']['y'], line1['end']['y'])) {
					return { 'x': Math.round(x), 'y': Math.round(y) };
				}
			}
		}

		return false;
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
