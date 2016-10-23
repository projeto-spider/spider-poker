'use strict';
const User = use('App/Model/User');
const Profile = use('App/Model/Profile');
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

		if (!AuthController.isEmail(user.email)) {
			return res.status(422).json({
				msg: 'Invalid email',
			});
		}

		if (!AuthController.validUsername(user.username)) {
			return res.status(422).json({
				msg: 'Invalid username. Must contain only letters, numbers, underscores or slashes. Minimum 6 characters and maximum 50.',
			});
		}

		if (user.password.length < 6) {
			return res.status(422).json({
				msg: 'Password too weak. Must be at least 6 characters long.',
			});
		}

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

		try {
			const {id, username, email} = yield User.create(user);

			return res.json({
				id, username, email,
			});
		} catch (err) {
			console.error(err);
			return res.status(422).json({
				msg: 'Failed to register.',
			});
		}

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

	static validUsername(username) {
		return /^(\w){6,50}$/.test(username);
	}

	static isEmail(email) {
		return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(email);
	}
}

module.exports = AuthController;
