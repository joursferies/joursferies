'use strict';

module.exports = {
	app: {
		title: 'Jours fériés 2015 - 2016 - 2017 en Belgique',
		description: 'Jours fériés 2015 - 2016 - 2017 en Belgique',
		keywords: 'jour férié, jours fériés, jours fériés belgique, jours fériés 2015, férié 2015, congés 2015, belgique, wallonie, jour belgique, date jour férié, date férié, calendrier belgique, jours congés, calendrier, calendrier 2015'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	assets: {
		lib: {
			css: [
			],
			js: [
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/modules/**/js/*.js'
		]
	},
	facebook: {
		clientID: 709203722495208
	}
};
