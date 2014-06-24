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
	 * Finds the default case.
	 *
	 * @return {[type]} [description]
	 */
	function findDefault() {

		return _.find(this.cases, function (c_se) {
			return c_se.condition === 'default';
		});
	}


	/**
	 * Find the findFirst case that matches the query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.findFirst = function findFirst(query) {
		var matchedCase = _.find(this.cases, function (c_se) {
			return this.match(c_se, query);
		}, this);


		// if no match is found,
		// return the default case
		matchedCase = matchedCase || findDefault.call(this);

		// if no default case was defined, simply return null.

		return matchedCase;
	};

	/**
	 * Find findAll cases that match a given query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.findAll = function findAll(query) {

		var matchedCases = _.filter(this.cases, function (c_se) {
			return this.match(c_se, query);
		}, this);

		// if matchedCases array is empty, add the default to it
		// if a default case was defined.
		if (matchedCases.length === 0) {

			var df = findDefault.call(this);

			if (df) {
				matchedCases.push(df);
			}
		}

		return matchedCases;
	};
});
