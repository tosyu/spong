/*jslint regexp: false, unparam: true, forin: true, nomen: true, maxerr: 50, indent: 4 */
/*global ts: true */
if (typeof ts === 'undefined') {
	var ts = {
		'core': {}
	};
} else if (typeof ts.core === 'undefined') {
	ts.core = {};
}

(function (ts) {
	"use strict";
	Function.prototype.inherits = function inherits(Parent) {
		var d = {}, p = (this.prototype = new Parent());
		this.prototype.parentCall = function (name) {
			if (typeof d[name] === 'undefined') {
				d[name] = 0;
			}
			var f, r, t = d[name], v = Parent.prototype;
			if (t) {
				while (t) {
					v = v.constructor.prototype;
					t -= 1;
				}
				f = v[name];
			} else {
				f = p[name];
				if (f === this[name]) {
					f = v[name];
				}
			}
			d[name] += 1;
			r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
			d[name] -= 1;
			return r;
		};
		return this;
	};

	if (typeof Function.prototype.bind === 'undefined') {
		Function.prototype.bind = function (_this) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be Bound is not callable");
			}
			var args = Array.prototype.slice.call(arguments, 1), ToBind = this, Nop = function () {}, Bound = function () {
				return ToBind.apply(this instanceof Nop ? this : _this || window, args.concat(Array.prototype.slice.call(arguments)));
			};
			Nop.prototype = this.prototype;
			Bound.prototype = new Nop();
			return Bound;
		};
	}

	Function.prototype.swiss = function swiss(parent) {
		var i;
		for (i = 1; i < arguments.length; i += 1) {
			this.prototype[arguments[i]] = parent.prototype[arguments[i]];
		}
		return this;
	};

	Function.prototype.extend = function extend(object) {
		var i;
		for (i in object) {
			this.prototype[i] = object[i];
		}
	};


	ts.core.Class = function Class(value) {
		this.init(arguments);
	};

	ts.core.Class.prototype = {
		'init': function ts_core_Class_init(initargs) {
			var name;
			this.__CLASS__ = initargs.callee.toString().match(/function\s?([a-zA-Z\-_]*)\s?\(/im)[1];
			if (typeof initargs[0] === 'object') {
		        for (name in initargs[0]) {
		            if (initargs[0].hasOwnProperty(name)) {
		                this[name] = initargs[0][name];
		            }
		        }
		    }
		},
		'toString': function ts_core_Class_toString() {
			return this.__CLASS__; // @TODO
		},
		'log': function ts_core_Class_log() {
	        var dt = new Date();
	        console.log(['[', this.__CLASS__, ']', dt.toUTCString()].join(' '), arguments);
	    }
	};
}(ts));
