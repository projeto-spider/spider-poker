'use strict';

const got = use('got');

class RedmineController {
	* issues(req, res) {
		const {project, hostname, key = ''} = req.all();
		const auth = req.headers('authorization', false);

		[project, hostname]
			.forEach(param => {
				if (!param) {
					return res.status(404).send('Invalid request');
				}
			});

		const url = `${hostname}/projects/${project}/issues.json`;

		try {
			const {body} = yield got.get(url, {
				query: {key},
				headers: {Authorization: auth},
			});

			res.json(body);
		} catch (err) {
			res.status(err.statusCode).send(err.statusMessage);
		}
	}
}

module.exports = RedmineController;
