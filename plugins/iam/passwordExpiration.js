var helpers = require('../../helpers');

module.exports = {
	title: 'Password Expiration',
	category: 'IAM',
	description: 'Ensures password policy enforces a password expiration',
	more_info: 'A strong password policy enforces minimum length, expirations, reuse, and symbol usage',
	link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_ManagingPasswordPolicies.html',
	recommended_action: 'Enable password expiration for the account',
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

		if (!passwordPolicy.ExpirePasswords) {
			helpers.addResult(results, 2, 'Password expiration policy is not set to expire passwords');
			return callback(null, results, source);
		}

		var returnMsg = 'Password expiration of: ' + passwordPolicy.MaxPasswordAge + ' days is ';

		if (passwordPolicy.MaxPasswordAge > 180) {
			helpers.addResult(results, 2, returnMsg + 'greater than 180');
		} else if (passwordPolicy.MaxPasswordAge > 90) {
			helpers.addResult(results, 1, returnMsg + 'greater than 90');
		} else {
			helpers.addResult(results, 0, returnMsg + 'suitable');
		}

		callback(null, results, source);
	}
};