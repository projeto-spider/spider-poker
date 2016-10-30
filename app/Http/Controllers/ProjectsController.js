'use strict';

const Project = use('App/Model/Project');

class ProjectsController {
	* index (req, res) {
		const {page = 1} = req.params();
		const projects = yield Project
			.paginate(page, 10);

		return res.json(projects);
	}

	* show(req, res) {
		const id = req.param('id');

		const project = yield Project
			.query()
			.where('id', id)
			.with('organization')
			.first();

		if (!project) {
			return res.status(404).send();
		}

		return res.json(project);
	}
}

module.exports = ProjectsController;
