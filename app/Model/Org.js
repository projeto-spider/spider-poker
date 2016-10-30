'use strict'

const Lucid = use('Lucid')

class Org extends Lucid {
	static get hidden() {
		return [
			'updated_at',
		];
	}
}

module.exports = Org
