'use strict';

const Org = use('App/Model/Org');

class OrgsSeeder {
	* run () {
		yield Org.createMany([{
			name: 'projeto-spider',
			display_name: 'Projeto Spider',
			private: false,
		}]);
	}
}

module.exports = OrgsSeeder;
