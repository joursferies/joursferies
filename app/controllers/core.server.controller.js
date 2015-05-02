'use strict';

var _ = require('lodash'),
    moment = require('moment');

moment.locale('fr');

// ---

var data = {
    dates: require('../models/all.json').dates,
    be_FR: require('../models/be_FR.json'),
    fr_FR: require('../models/fr_FR.json')
};
var details = {};

var localesTr = {
    'be_FR': 'Belgique',
    'fr_FR': 'France'
};
var locales = _.keys(localesTr);

var countries = ['be', 'fr'];

var categories = ['legal', 'others'];

var availableYears = [2015, 2016, 2017, 2018, 2019, 2020];

// ---

function parseDatas () {

    /**
     * Calulate dates and others useful infos
     */

    _(countries).forEach(function (country) {
        _(data[country + '_FR']).forEach(function (events) {
            _(events).forEach(function (ev) {

                // Get dates and remove "id" field
                var dates = _.omit(_.find(data.dates, { id: ev.id }), 'id');

                ev.dates = {};

                // Loop into years
                _(dates).forEach(function (fullDateByCountry, year) {
                    var parsedDate = moment.parseZone(fullDateByCountry[country]);
                    ev.dates[year] = {
                        dow           : parsedDate.format('dddd'),    // jours de la semaine
                        timestamp     : parsedDate.valueOf(),         // timestamp
                        formattedDate : parsedDate.format('D MMMM')   // ex: 6 janvier
                    };
                });

                // Encoded title
                ev.uri = encodeURIComponent(ev.title);

                // Populate details obj for secondaries pages

                if (!details[ev.uri]) {
                    details[ev.uri] = {};
                }

                details[ev.uri][country] = ev.dates;

            });
        });
    });
}

parseDatas();

// ---

function getRet (country, year) {

    var now = Date.now(),
        from = +moment(now).hours(0).minutes(0).seconds(0).milliseconds(0),
        to = +moment(now).hours(23).minutes(59).seconds(59).milliseconds(999);

    country = country || 'be';
    year = (year || moment(now).year()).toString();

    var ret = {
        now                : now,
        country            : country,
        year               : +year,
        availableYears     : availableYears,
        availableCountries : localesTr
    };

    _(data[country + '_FR']).forEach(function (events, category) {

        ret[category] = {
            events           : events,     // Add all events
            highlightedEvent : {           // Highlighted event (today or the next)
                isToday : null,            // is today a holiday ?
                infos   : {},
                date    : {}
            }
        };

        _(events).forEach(function (ev) {

            // is a past event ?
            ev.dates[year].finished = ev.dates[year].timestamp < from;

            if (ret[category].highlightedEvent.isToday === null) {
                if (ev.dates[year].timestamp >= from && ev.dates[year].timestamp <= to) {    // today
                    ret[category].highlightedEvent.isToday = true;
                    ret[category].highlightedEvent.infos = ev;
                    ret[category].highlightedEvent.date = ev.dates[year];
                } else if (ev.dates[year].timestamp > to) {                                  // the next
                    ret[category].highlightedEvent.isToday = false;
                    ret[category].highlightedEvent.infos = ev;
                    ret[category].highlightedEvent.date = ev.dates[year];
                }
            }

        });

        // If no next event found, get first event of next year
        if (ret[category].highlightedEvent.isToday === null) {
            // suppose que le premier elem de l'array soit le premier de l'annee... pas top!
            ret[category].highlightedEvent.isToday = false;
            ret[category].highlightedEvent.infos = events[0];
            ret[category].highlightedEvent.date = events[0].dates[(+year+1).toString()];
        }

    });

    return ret;
}

// ---

// INDEX

exports.index = function (req, res) {
	return res.render('index', getRet());
};

exports.getLegalTable = function (req, res) {
    return res.render('templates/table_legal', getRet(req.params.country.replace('_FR', ''), req.params.year));
};

exports.getOthersTable = function (req, res) {
    return res.render('templates/table_others', getRet(req.params.country.replace('_FR', ''), req.params.year));
};

// ---

// EVENT DETAILS

exports.event = function (req, res) {

    var event = encodeURIComponent(req.params.event),
        now = Date.now();

    if (!details[event]) {
        return res.status(404).send();
    }

    return res.render('event', {
        now : now,
        title: req.params.event,
        articleTemplate: './events/' + event + '.server.view.html',
        years: _.range(moment(now).year(), moment(now).year()+3),
        localesTr: localesTr,
        calendar: details[event]
    });
};

// ---

// SITEMAP

exports.sitemap = function (req, res) {

    var sitemap = require('./sitemap.server.controller.js').generateSitemap(_.keys(details));

    res.set('Content-Type', 'text/xml');
    return res.send(sitemap);

};
