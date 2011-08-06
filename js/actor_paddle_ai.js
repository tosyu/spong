function PaddleAi() { this.init(arguments); this.ready(); }
PaddleAi.inherits(Paddle);
PaddleAi.extend({
	'id': 'paddleAi',
	'x': -20,
	'y': 0,
    'ballMovingDown': true,
    'ballMovingUp': false,
    'lastTime': 0,
    'animateInterval': 15, //about 60fps
    'lastBallPosition': {
        'y': 0
    },
    'velocity': {
        'y': 1,
        'ymin': 1,
        'ymax': 3
    },

    'ready': function Paddle_ready() {
        this.log(this.id, 'ready!');
        this.scene.register(this.scene.consts.LAYER_MIDGROUND, this.id, this);
        this.x = this.parent.screen.width - this.width + this.x;
        this.y = parseInt(this.parent.screen.height - this.height) / 2;
    },

    'animate': function Paddle_animate(currentTime) {
        if (currentTime - this.lastTime > this.animateInterval) {
            if (this.ballMovingUp === true) {
                if (this.y - this.velocity.y >= 0) {
                    this.y -= this.velocity.y;
                }

                if (this.velocity.y <= this.velocity.ymax) {
                    this.velocity.y = this.velocity.y + 0.15;
                }
            }

            if (this.ballMovingDown === true) {
                if (this.y + this.velocity.y <= (this.parent.screen.height - this.height)) {
                    this.y += this.velocity.y;
                }

                if (this.velocity.y <= this.velocity.ymax) {
                    this.velocity.y = this.velocity.y + 0.15;
                }
            }
            this.lastTime = currentTime;

            // get the centered position
            var ball = this.scene.getActor(this.scene.consts.LAYER_MIDGROUND, 'ball');
            var ballY = Math.round(ball.y + (ball.height / 2));
            if (this.lastBallPosition.y < ballY && this.ballMovingUp === true) {
                this.ballMovingDown = true;
                this.ballMovingUp = false;
                this.velocity.y = this.velocity.ymin;
            }

            if(this.lastBallPosition.y > ballY && this.ballMovingDown === true) {
                this.ballMovingUp = true;
                this.ballMovingDown = false;
                this.velocity.y = this.velocity.ymin;
            }

            this.lastBallPosition.y = ballY;
        }
    }
});
