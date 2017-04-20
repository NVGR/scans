var helpers = require('../../helpers');

module.exports = {
	title: 'Password Requires Numbers',
	category: 'IAM',
	description: 'Ensures password policy requires the use of numbers',
	more_info: 'A strong password policy enforces minimum length, expirations, reuse, and symbol usage',
	link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_ManagingPasswordPolicies.html',
	recommended_action: 'Update the password policy to require the use of numbers',
	apis: ['IAM:getAccountPasswordPolicy'],

	run: function(cache, callback) {
		var results = [];
		var source = {};

		var region = 'us-east-1';

		var getAccountPasswordPolicy = helpers.addSource(cache, source,
				['iam', 'getAccountPasswordPolicy', region]);

		if (!getAccountPasswordPolicy) return callback(null, results, source);

		if (getAccountPasswordPolicy.err || !getAccountPasswordPolicy.data ||
			!getAccountPasswordPolicy.data.PasswordPolicy) {
			helpers.addResult(results, 3, 'Unable to query for password policy status');
			return callback(null, results, source);
		}

		var passwordPolicy = getAccountPasswordPolicy.data.PasswordPolicy;

		if (!passwordPolicy.RequireNumbers) {
			helpers.addResult(results, 1, 'Password policy does not require numbers');
		} else {
			helpers.addResult(results, 0, 'Password policy requires numbers');
		}

		callback(null, results, source);
	}
};