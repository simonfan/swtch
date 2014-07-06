//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('__swtch/evaluate',['require','exports','module','lodash'],function (require, exports, module) {
	

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
	 * Find the first case that matches the query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.first = function first(query) {
		var matchedCase = _.find(this.cases, function (c_se) {
			return this.match(c_se.condition, query);
		}, this);


		// if no match is found,
		// return the default case
		matchedCase = matchedCase || findDefault.call(this);

		// if no default case was defined, simply return null.

		return matchedCase;
	};

	/**
	 * Find all cases that match a given query.
	 *
	 * @param  {[type]} query [description]
	 * @return {[type]}       [description]
	 */
	exports.all = function all(query) {

		var matchedCases = _.filter(this.cases, function (c_se) {
			return this.match(c_se.condition, query);
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

//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('__swtch/exec',['require','exports','module','lodash'],function (require, exports, module) {
	

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

//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module swtch
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('swtch',['require','exports','module','lodash','subject','./__swtch/evaluate','./__swtch/exec'],function (require, exports, module) {
	

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

