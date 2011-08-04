/*jslint regexp: false, unparam: true, forin: true, nomen: true, maxerr: 50, indent: 4 */
(function () {
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


	function Class(value) {
		this.init(arguments);
	}

	Class.prototype = {
		'init': function BaseClass_init(initargs) {
			this.__CLASS__ = initargs.callee.toString().match(/function\s?([a-zA-Z\-_]*)\s?\(/im)[1];
		},	
		'toString': function BaseClass_toString() {
			return this.__CLASS__; // @TODO
		}
	};
}());
