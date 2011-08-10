function Collisions () { this.init(arguments); this.ready(); }
Collisions.inherits(ts.core.Class);
Collisions.extend({
    'ready': function Collisions_ready() {
        this.actors = {}; // can't generate collisions themselfs, separated for speed
        this.colliders = {}; // can generate collisions
    },

    'register': function Collisions_register(actorObject) {
        this.log(actorObject, 'registered for collisions');
        if (actorObject.isCollider() === true) {
            if (typeof this.colliders[actorObject.getId()] !== 'undefined') {
                throw new Error('A collider with that ID already exists');
            }
            this.colliders[actorObject.getId()] = actorObject;
        }
        this.actors[actorObject.getId()] = actorObject;
    },

    'unregister': function Collisions_unregister(actorObject) {
        if (actorObject.isCollider() === true) {
            delete this.colliders[actorObject.getId()];
        }
        delete this.staticObjects[actorObject.getId()];
    },

    'tick': function Collisions_tick() {
        var i, x, a, boundingBox, actorEdges, colliderEdges, corner, edgeBoundingBox, edgeCorner, colliderBoundingBox;
        for (i in this.colliders) {
            if (this.colliders.hasOwnProperty(i)) {
                colliderEdges = this.edgesRotate(this.colliders[i].getEdges(), this.colliders[i].getRotation());
                colliderBoundingBox = this.colliders[i].getBoundingBox();
                for (x in this.actors) {
                    if (this.actors.hasOwnProperty(x)) {
                        if (this.actors[x].getId() == this.colliders[i].getId()) {
                            continue;
                        }
                        if ((corner = this.boxOverlapsWith(colliderBoundingBox, this.actors[x].getBoundingBox())) !== false) {
                            for (a in colliderEdges) {
                                edgeBoundingBox = this.getBoundingBoxFromEdge(colliderEdges[a]);
                                if ((edgeCorner = this.boxOverlapsWith(edgeBoundingBox, this.actors[x].getBoundingBox())) !== true) {
                                    this.colliders[i].edgeCollisionWith(parseInt(a), this.actors[x]);
                                    this.actors[x].pointCollisionWith(edgeBoundingBox[corner], this.colliders[i]);
                                }
                            }
                            this.colliders[i].cornerCollisionWith(corner, this.actors[x]);
                            this.actors[x].pointCollisionWith(colliderBoundingBox[corner], this.colliders[i]);
                            edgeBoundingBox = null;
                        }
                        actorEdges = null;
                    }
                }

                if (this.colliders[i].isCollidingWithScreen() === true) {
                    if (colliderBoundingBox[0]['x'] <= 0) {
                        this.colliders[i].edgeCollisionWith(3); //wall left side bump
                    } else if (colliderBoundingBox[1]['x'] >= this.scene.viewport.width) {
                        this.colliders[i].edgeCollisionWith(1); //wall right side bump
                    }

                    if (colliderBoundingBox[0]['y'] <= 0) {
                        this.colliders[i].edgeCollisionWith(0); //wall top side bump
                    } else if (colliderBoundingBox[2]['y'] >= this.scene.viewport.height) {
                        this.colliders[i].edgeCollisionWith(2); //wall bottom side bump
                    }
                }
                colliderEdges = null;
                colliderBoundingBox = null;
            }
        }
    },

    'boxOverlapsWith': function Collisions_boxOverlapsWith(box1, box2) {
        var i = 0, imax = box1.length;
        for (i; i < imax; i++) {
            if (Math.min(box2[0].x, box2[1].x) <= box1[i].x && box1[i].x <= Math.max(box2[0].x, box2[1].x)
             && Math.min(box2[1].y, box2[2].y) <= box1[i].y && box1[i].y <= Math.max(box2[1].y, box2[2].y)) { // since it's a rectangle we dont need to test all coords
                 return i;
             }
        }
        return false;
    },

    'edgesRotate': function Collisions_edgesTransform(edges, rotation) {
        var radius = Math.max(edges[1]['x'], edges[1]['x']) - Math.min(edges[0]['x'], edges[0]['x']), i;
        for (i in edges) {
            edges[i][0]['x'] = parseInt(Math.cos(rotation) * radius);
            edges[i][0]['y'] = parseInt(Math.sin(rotation) * radius);
            edges[i][1]['x'] = parseInt(Math.cos(rotation) * radius);
            edges[i][1]['y'] = parseInt(Math.sin(rotation) * radius);
        }
        return edges;
    },

    'getBoundingBoxFromEdge': function Collisions_getBoundingBoxFromEdge(edge) { //@TODO
        var sideHalf = parseInt(Math.abs(Math.sqrt(Math.pow((edge[0]['x'] - edge[1]['x']), 2) + Math.pow((edge[0]['y'] - edge[0]['y']), 2))) / 2);
        return [{'x': edge[0]['x'] - sideHalf, 'y': edge[0]['y'] - sideHalf},
                {'x': edge[0]['x'] + sideHalf, 'y': edge[0]['y'] - sideHalf},
                {'x': edge[1]['x'] + sideHalf, 'y': edge[1]['y'] + sideHalf},
                {'x': edge[1]['x'] - sideHalf, 'y': edge[1]['y'] + sideHalf}];
    }
})