'use strict';

const Lucid = use('Lucid')

class Project extends Lucid {
	static get hidden() {
		return [
			'updated_at',
		];
	}
}

module.exports = Project;
