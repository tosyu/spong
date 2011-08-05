function Scene() { this.init(arguments); this.ready(); }
Scene.inherits(ts.core.Class);
Scene.extend({
    'consts': {
        'LAYER_BACKGROUND_FAR': 0,
        'LAYER_BACKGROUND': 1,
        'LAYER_MIDGROUND': 2,
        'LAYER_FOREGROUND': 3,
        'LAYER_FOREGROUND_CLOSE': 4
    },

    'ready': function Scene_ready() {
        this.actors = {};
        this.layers = [0, 1, 2, 3, 4];
    },

    'register': function Scene_register(layer, id, actorObject) {
        this.log('Scene actor registration', arguments);

        if (typeof layer === 'undefined') {
            throw new Error('Layer not defined');
        } else if (typeof this.layers[layer] === 'undefined') {
            throw new Error('Layer does not exist!')
        }

        if (typeof id === 'undefined') {
            throw new Error('Id not defined');
        }

        if (typeof actorObject === 'undefined') {
            throw new Error('Actor not defined');
        }

        if (typeof this.actors[layer] === 'undefined') {
            this.actors[layer] = {};
        }

        if (typeof this.actors[layer][id] !== 'undefined') {
            throw new Error('Actor ID already defined for this layer')
        }

        this.actors[layer][id] = actorObject;
    },

    'unregister': function Scene_unregister(layer, id) {
        this.log('Scene actor unregistration', arguments);

        if (typeof layer === 'undefined') {
            throw new Error('Layer not defined');
        } else if (typeof this.consts[layer] === 'undefined') {
            throw new Error('Layer does not exist!')
        }

        if (typeof id === 'undefined') {
            throw new Error('Id not defined');
        }

        if (typeof this.actors[layer] === 'undefined') {
            throw new Error('Nothing was registered in this layer')
        }

        if (typeof this.actors[layer][id] === 'undefined') {
            throw new Error('ID was not registered in this layer')
        }

        delete this.actors[layer][id];
    },

    '_draw': function Scene__draw(context) {
        var layer, id, ctx = this.viewport.getContext();
        var actor, actors = this.getActors();
        for (actor in actors) {
            context.save();
            actors[actor]._draw(context);
            context.restore();
        }
    },

    'getActors': function Scene_getActors() {
        var _actors = [], layer, id;
        for (layer in this.actors) {
            if (this.actors.hasOwnProperty(layer)) {
                for (id in this.actors[layer]) {
                    if (this.actors[layer].hasOwnProperty(id)) {
                        _actors.push(this.actors[layer][id]);
                    }
                }
            }
        }
        return _actors;
    }

});
