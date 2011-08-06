function PaddleUser() { this.init(arguments); this.ready(); }
PaddleUser.inherits(Paddle);
PaddleUser.extend({
	'id': 'paddleUser',
	'x': 20,
	'y': 0,
    'velocity': {
        'y': 2,
        'ymin': 2,
        'ymax': 5,
    },
    'user_command_up': false,
    'user_command_down': false,
    'lastTime': 0,
    'animateInterval': 15, //about 60fps

    'ready': function Paddle_ready() {
        this.log(this.id, 'ready!');
        this.scene.register(this.scene.consts.LAYER_MIDGROUND, this.id, this);
        this.y = parseInt(this.parent.screen.height - this.height) / 2;
        window.addEventListener('keydown', this.registerOnKeyPressed.bind(this), false);
        window.addEventListener('keyup', this.registerOnKeyUp.bind(this), false);
    },

    'animate': function Paddle_animate(currentTime) {
        if (currentTime - this.lastTime > this.animateInterval) {
            if (this.user_command_up === true) {
                if (this.y - this.velocity.y >= 0) {
                    this.y -= Math.round(this.velocity.y);
                }
            }

            if (this.user_command_down === true) {
                if (this.y + this.velocity.y <= (this.parent.screen.height -this.height)) {
                    this.y += Math.round(this.velocity.y);
                }
            }
            this.lastTime = currentTime;
        }
    },

    'registerOnKeyPressed': function Paddle_registerKeyBindings(evt) {
        var key = event.keyCode || event.which;
        if (evt.keyCode === 81) {
            if (this.user_command_up === false) {
                this.user_command_up = true;
            }
            if (this.velocity.y <= this.velocity.ymax) {
                this.velocity.y = this.velocity.y + 0.15;
            }
        }

        if (evt.keyCode === 65) {
            if (this.user_command_down === false) {
                this.user_command_down = true;
            }
            if (this.velocity.y <= this.velocity.ymax) {
                this.velocity.y = this.velocity.y + 0.15;
            }
        }
    },

    'registerOnKeyUp': function Paddle_registerKeyBindings(evt) {
        this.user_command_up = false;
        this.user_command_down = false;
        this.velocity.y = this.velocity.ymin;
    }

});
