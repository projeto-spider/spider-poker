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
			.orWhere('id', id)
			.orWhere('username', id)
			.with('profile')
			.first();

		return res.json(user);
	}

	* update(req, res) {
		const user = yield req.auth.getUser();

		const id = Number(req.param('id'));

		if (id !== user.id) {
			return res.status(403).json({
				msg: "Can't update users that aren't yourself",
			});
		}

		const data = req.only(
			'name', 'bio', 'location', 'company', 'contact', 'url'
		);

		yield Profile
			.query()
			.update(data)
			.where('user_id', id);

		const updated = yield User
			.query()
			.where('id', id)
			.with('profile')
			.first();

		return res.json(updated);
	}

	* destroy(_req, _res) {
		// TODO: do
	}
}

module.exports = UserController;
