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

	static scopePublic(builder) {
		builder.where('private', false);
	}
}

module.exports = Project;
