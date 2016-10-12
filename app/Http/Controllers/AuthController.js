'use strict';
const User = use('App/Model/User');
const Validator = use('Validator');
const Hash = use('Hash');

class AuthController {
	* valid(req, res) {
		const valid = yield req.auth.check();
		res.json({valid});
	}

	* register(req, res) {
		const user = Validator.sanitize(
			req.only('username', 'email', 'password'),
			AuthController.registerSanitizationRules
		);

		const exists = yield User
			.query()
			.select('id')
			.orWhere('username', user.username)
			.orWhere('email', user.email)
			.first();

		if (exists) {
			return res.status(422).json({
				msg: 'Username or email already exists.',
			});
		}

		const {id, username, email} = yield User.create(user);

		res.json({
			id, username, email,
		});
	}

	* authorize(req, res) {
		const {username, password} = req.all();

		const user = yield User
			.query()
			.where(function () {
				this.orWhere('username', username);
				this.orWhere('email', username);
			})
			.first();

		if (!user) {
			return res.status(403).json({
				msg: 'Invalid username.',
			});
		}

		const verifyPassword = yield Hash.verify(password, user.password);

		if (!verifyPassword) {
			return res.status(403).json({
				msg: 'Invalid password.',
			});
		}

		const {token, expiry} = yield req.auth.generate(user);

		res.json({
			token, expiry,
		});
	}

	static get registerSanitizationRules() {
		return {
			email: 'normalize_email',
		};
	}
}

module.exports = AuthController;
