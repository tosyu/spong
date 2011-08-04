function Spong () { this.init(arguments); }
Spong.inherits(ts.core.Class);
Spong.extend({
    /**
     * Executed on dom ready, starts the whole app
     */
    'ready': function Spong_ready() {
        this.log('document loaded!');
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = this.currentTime();

        // start main loop
        this.loop();
    },

    'currentTime': function Spong_currentTime() {
        var dt = new Date();
        return dt.getTime();
    },

    'loop': function Spong_loop() {
        this.timeoutId = window.setTimeout(this.loop.bind(this), 10);
        if (this.currentTime() >= (this.lastFrameTime + this.frameInterval)) {
            this.frame();
        }
    },

    'frame': function Spong_frame() {
        this.lastFrameTime = this.currentTime();
        //this.log('running at', this.fps, 'fps');
    },

    'destroy': function Spong_destroy() {
        this.log('destroy spong!');
        if (typeof this.timeoutId !== 'undefined') {
            window.clearTimeout(this.timeoutId);
        }
    }
})
var sp = new Spong({
    'fps': 25
});
document.addEventListener('DOMContentLoaded', sp.ready.bind(sp), false);
window.addEventListener('unload', sp.destroy.bind(sp), false);

