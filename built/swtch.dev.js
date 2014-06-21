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

define('swtch',['require','exports','module','lodash','subject'],function (require, exports, module) {
	


	var _       = require('lodash'),
		subject = require('subject');

	var swtch = module.exports = subject({
		initialize: function initializeSwtch(situations) {


			this.situations = [];

			_.each(situations, function (c) {

				this.situation(c.condition, c.callback);

			}, this);
		},

		situation: function defineSituation(condition, callback) {

			if (arguments.length === 1) {


				return this.unmatched(arguments[0]);

			} else {


				var situation = { callback: callback };

				if (_.isString(condition)) {

					situation.test = function (instance) {
						return condition === instance;
					};

				} else if (_.isRegExp(condition)) {

					situation.test = condition.test;

				} else if (_.isFunction(condition)) {

					situation.test = condition;

				}

				// add to situations
				this.situations.push(situation);

				return this;
			}
		},

		evaluate: function evaluateSituation(actual) {

			var match = _.find(this.situations, function (situation) {
				return situation.test.call(this, actual);
			}, this);

			var callback = match ? match.callback : this.unmatchedCallback;


			return this.execCallback(callback, actual);
		},


		exec: function exec(actual) {


			var matched = false;

			_.each(this.situations, function (situation) {

				if (situation.test(actual)) {

					matched = true;

					this.execCallback(situation.callback, actual);
				}

			}, this);

			// run unmatched situation callback
			if (!matched) {
				this.execCallback(this.unmatchedCallback, actual);
			}


			return this;

		},


		execCallback: function execCallback(callback, actual) {


			return callback.call(this, actual);
		},



		unmatched: function unmatchedSituation(callback) {


			this.unmatchedCallback = callback;

			return this;
		},

		unmatchedCallback: _.noop,

	});
});

