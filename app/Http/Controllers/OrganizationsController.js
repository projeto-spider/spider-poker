'use strict';

const Org = use('App/Model/Org');

class OrgsController {
	* index (req, res) {
		const {page = 1} = req.params();
		const orgs = yield Organization
			.query()
			.public()
			.paginate(page, 10);

		return res.json(orgs);
	}

	* show(req, res) {
		const id = req.param('id');

		const org = yield Organization
			.query()
			.orWhere('id', id)
			.orWhere('name', id)
			.first();

		if (!org) {
			return res.status(404).send();
		}

		return res.json(org);
	}
}

module.exports = OrgsController;
