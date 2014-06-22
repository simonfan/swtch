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
		 * Basically creates the situation array and
		 * adds situations if passed an array of situations
		 * at start.
		 *
		 * @param  {[type]} situations [description]
		 * @return {[type]}            [description]
		 */
		initialize: function initializeSwtch(situations) {


			this.situations = [];

			_.each(situations, function (c) {

				this.situation(c.condition, c.callback);

			}, this);
		},

		/**
		 * Transforms the received condition into a function
		 * that when ran returns either true or false.
		 *
		 * @param  {[type]} condition [description]
		 * @return {[type]}           [description]
		 */
		parseCondition: function parseCondition(condition) {

			if (_.isString(condition) || _.isNumber(condition)) {

				return function testStringCondition(value) {
					return condition === value;
				};

			} else if (_.isRegExp(condition)) {

				return _.bind(condition.test, condition);

			} else if (_.isFunction(condition)) {

				return condition;

			}
		},

		/**
		 * Defines a situation/case. Basically converts the
		 * condiition passed into a function that returns either true or false
		 * and adds the situation to the tail of the situations array.
		 *
		 * Situations are ordered and those added first have priority over those
		 * added later.
		 *
		 * @param  {[type]}   condition [description]
		 * @param  {Function} callback  [description]
		 * @return {[type]}             [description]
		 */
		situation: function defineSituation(condition, callback) {

			if (arguments.length === 1 && _.isFunction(condition)) {
				// if there is only one argument
				// and that argument is a function
				// it is actually the callback for the unmatched
				// situation.


				return this.unmatched(arguments[0]);

			} else {
				// otherwise, the call defines a situation

				var situation = {
					callback: callback,
					test    : this.parseCondition(condition)
				};

				// add to situations
				this.situations.push(situation);

				return this;
			}
		},


		/**
		 * Defines the callback to be executed in case no match
		 * is found.
		 *
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		unmatched: function unmatchedSituation(callback) {


			this.unmatchedCallback = callback;

			return this;
		},

		/**
		 * The property that holds the callback function that will
		 * be executed in case no match is found for the value.
		 * By default it is an noop.
		 *
		 * @type {[type]}
		 */
		unmatchedCallback: _.noop,

		/**
		 * Executes the first situation found.
		 * Remember: the situations are stored in an array
		 * by order of addition. Thus, situations added first will have
		 * priority over those added later.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		execFirst: function execFirst(value) {

			var match = _.find(this.situations, function (situation) {
				return situation.test.call(this, value);
			}, this);

			var callback = match ? match.callback : this.unmatchedCallback;


			return this.execCallback(callback, value);
		},

		/**
		 * Executes all situations that match the value, in the order they were added.
		 *
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		exec: function exec(value) {


			var matched = false;

			_.each(this.situations, function (situation) {

				if (situation.test(value)) {

					matched = true;

					this.execCallback(situation.callback, value);
				}

			}, this);

			// run unmatched situation callback
			if (!matched) {
				this.execCallback(this.unmatchedCallback, value);
			}


			return this;
		},

		/**
		 * Executes the callback of the situation.
		 * Should be overridden for custom behaviour.
		 *
		 * @param  {Function} callback [description]
		 * @param  {[type]}   value    [description]
		 * @return {[type]}            [description]
		 */
		execCallback: function execCallback(callback, value) {


			return callback.call(this, value);
		},

	});
});
