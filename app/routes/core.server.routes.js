'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');

	app.route('/').get(core.index);

    app.route('/legal/:country/:year').get(core.getLegalTable);
    app.route('/others/:country/:year').get(core.getOthersTable);

    app.route('/sitemap.xml').get(core.sitemap);

    app.route('/:event').get(core.event);

};
