'use strict';

const Project = use('App/Model/Project');

class ProjectsSeeder {
	* run () {
		yield Project.createMany([{
			org_id: 1,
			name: 'planning-poker',
			display_name: 'Planning Poker',
			private: false,
		}, {
			org_id: 2,
			name: 'world-domination',
			display_name: 'World Domination',
			private: true,
		}]);
	}
}

module.exports = ProjectsSeeder;
