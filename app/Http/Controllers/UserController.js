'use strict';
const User = use('App/Model/User');
const Profile = use('App/Model/Profile');

class UserController {
	* index (req, res) {
		const {page = 1} = req.params();
		const users = yield User
			.paginate(page, 10);

		return res.json(users);
	}

	* show(req, res) {
		const id = req.param('id');

		const user = yield User
			.query()
			.where('id', id)
			.with('profile')
			.fetch();

		return res.json(user);
	}

	* update(req, res) {
		const id = Number(req.param('id'));
		const isLoggedIn = yield req.auth.check();
		const data = req.only(
			'name', 'bio', 'location', 'company', 'contact', 'url'
		);

		if (!isLoggedIn) {
			return res.status(403).json({
				msg: 'Not logged in',
			});
		}

		if (id !== req.auth.user.id) {
			return res.status(403).json({
				msg: "Can't update users that aren't yourself",
			});
		}

		yield Profile
			.query()
			.update(data)
			.where('user_id', id);

		const user = yield User
			.query()
			.where('id', id)
			.with('profile')
			.fetch();

		return res.json(user);
	}

	* destroy(_req, _res) {
		// TODO: do
	}
}

module.exports = UserController;
