(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'swtch',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(swtch, should) {
	'use strict';

	describe('swtch basics', function () {
		beforeEach(function (done) {
			done();
		});

		it('is fine (:', function () {


			var control = {};


			var cases = swtch([
				{
					condition: /some-string/,
					value : function () {

						control['some-string'] = true;

						return 'some-string callback';
					},
				}
			]);

			var condition = 'string-condition',
				callback  = function () {
					return 'qjweiqwek';
				};

			cases.when(condition, callback);





			cases.execFirst('some-string').should.eql('some-string callback');
			cases.exec('some string');

		});
	});
});
