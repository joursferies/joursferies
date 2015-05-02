'use strict';

var fs = require('fs');

var header = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://www.joursferies.be/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
var footer = '</urlset>';

exports.generateSitemap = function (events) {
    var sitemap = header;
    events.forEach(function (event) {
        sitemap += '<url>';
        sitemap += '<loc>http://www.joursferies.be/' + event + '</loc>';
        // sitemap += '<changefreq>yearly</changefreq>';
        sitemap += '</url>';
    });
    sitemap += footer;
    return sitemap;
};
