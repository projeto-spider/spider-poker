'use strict'

const Lucid = use('Lucid')

class Org extends Lucid {
	static get hidden() {
		return [
			'updated_at',
		];
	}

	projects() {
		return this.hasMany('App/Model/Project');
	}
}

module.exports = Org
