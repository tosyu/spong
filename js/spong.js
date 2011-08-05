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

        if (this.requirementsMet() === true) {
            this.screen.parent = this;
            this.viewport = new Viewport(this.screen);
            
            // for testing
            var sq = new Square({
                'viewport': this.viewport
            });             
            
            window.addEventListener('keyup', this.start.bind(this), false);
            this.log('press s to start');
        } else {
            alert('Browser does not support canvas! please update')
        }    
    },

    'start': function Spong_start (evt) { 
        var key = event.keyCode || event.which;        
        if (evt.keyCode === 83) {
            this.log('started');
            this.loop();
            window.removeEventListener('keyup', this.start.bind(this), false);
        } 
    },

    'requirementsMet': function Spong_requirementsMet() {
        var testCanvas = document.createElement('canvas');
        var result = typeof testCanvas.getContext == 'function';
        delete testCanvas;
        return result;
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
        //this.log('running at', this.fps, 'fps');
        this.lastFrameTime = this.currentTime();
        this.viewport.draw();    
    },

    'destroy': function Spong_destroy() {
        this.log('destroy spong!');
        if (typeof this.timeoutId !== 'undefined') {
            window.clearTimeout(this.timeoutId);
        }
        window.removeEventListener('keyup', this.start.bind(this), false);
    }
})
var sp = new Spong({
    'fps': 25,
    'screen': {
        'width': 320,
        'height': 240,
        'doubleBuffering': true
    }
});
document.addEventListener('DOMContentLoaded', sp.ready.bind(sp), false);
window.addEventListener('unload', sp.destroy.bind(sp), false);
