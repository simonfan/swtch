//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _       = require('lodash'),
		subject = require('subject');

	var swtch = module.exports = subject({

		/**
		 * Basically creates the c_se array and
		 * adds cases if passed an array of cases
		 * at start.
		 *
		 * @param  {[type]} cases [description]
		 * @return {[type]}            [description]
		 */
		initialize: function initializeSwtch(cases) {


			this.cases = [];

			_.each(cases, function (c) {

				this.when(c.condition, c.value);

			}, this);
		},

		/**
		 * Checks if a case is valid query the
		 * @param  {[type]} c_se    [description]
		 * @param  {[type]} query [description]
		 * @return {[type]}         [description]
		 */
		match: function match(condition, query) {

			if (_.isRegExp(condition)) {

				return condition.test(query);

			} else if (_.isFunction(condition)) {

				return condition(query);

			} else {
				// (_.isString(condition) || _.isNumber(condition) || _.isBoolean(condition))

				return condition === query;
			}
		},

		/**
		 * Defines a case.
		 *
		 * @return {[type]} [description]
		 */
		when: function when() {

			// parse out arguments
			var c_se;

			if (arguments.length === 1 && _.isObject(arguments[0])) {
				// arguments = [case]
				c_se = arguments[0];
			} else {
				// arguments = [condition, value, context]
				c_se = {
					condition: arguments[0],
					value    : arguments[1],
					context  : arguments[2]
				};
			}

			// push case to the cases array
			this.cases.push(c_se);

			return this;
		},

		/**
		 * Defines the default value. To be used when no
		 * other case is matched.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		d_fault: function d_fault(value, context) {

			this.when('default', value, context);

			return this;
		},
	});

	swtch
		.assignProto(require('./__swtch/evaluate'))
		.assignProto(require('./__swtch/exec'));
});
