'use strict';

const Lucid = use('Lucid')

class Project extends Lucid {
	static get hidden() {
		return [
			'updated_at',
		];
	}

	organization() {
		return this.belongsTo('App/Model/Org');
	}
}

module.exports = Project;
