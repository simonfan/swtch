define(function (require, exports, module) {

	exports.situation = function defineSituation(condition, callback) {

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
	};

});
