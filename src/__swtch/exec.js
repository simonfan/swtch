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

	var _ = require('lodash');

	/**
	 * Executes the first c_se found.
	 * Remember: the cases are stored in an array
	 * by order of addition. Thus, cases added first will have
	 * priority over those added later.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.execFirst = function execFirst(query) {

		var matchedCase = this.first(query);

		if (matchedCase) {
			return this.execCase(matchedCase, query);
		}
	};

	/**
	 * Executes all cases that match the value, in the order they were added.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.exec = function exec(query) {
		var matchedCases = this.all(query);

		return _.map(matchedCases, function (c, index) {
			return this.execCase(c, query);
		}, this);
	};

	/**
	 * Invokes the case's value when exec is invoked.
	 * Takes the case itself as first argument and
	 * the value with which 'exec' was invoked with as second.
	 *
	 * @param  {[type]} c_se  [description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	exports.execCase = function execCase(c_se, query) {
		return c_se.value.call(c_se.context);
	};
});
