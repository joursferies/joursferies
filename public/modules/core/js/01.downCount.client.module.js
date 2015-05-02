/**
 * downCount: Simple Countdown clock with offset
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 * A little bit modified by @blary_jp :)
 */
;(function ($) {
    'use strict';

    $.fn.downCount = function (options, callback) {
        var settings = $.extend({
                date: null,
                offset: null,
                clockDiff: 0,
                i18n: {
                    day: 'jour',
                    days: 'jours',
                    hour: 'heure',
                    hours: 'heures',
                    minute: 'minute',
                    minutes: 'minutes',
                    second: 'seconde',
                    seconds: 'secondes'
                }
            }, options);

        // Throw error if date is not set
        if (!settings.date) {
            $.error('Date is not defined.');
        }

        // Elements
        var $elem = {
            $days: this.find('.days'),
            $hours: this.find('.hours'),
            $minutes: this.find('.minutes'),
            $seconds: this.find('.seconds'),
            $days_ref: this.find('.days_ref'),
            $hours_ref: this.find('.hours_ref'),
            $minutes_ref: this.find('.minutes_ref'),
            $seconds_ref: this.find('.seconds_ref')
        };

        // basic math variables
        var _second = 1000,
            _minute = _second * 60,
            _hour = _minute * 60,
            _day = _hour * 24;

        /**
         * Change client's local date to match offset timezone
         * @return {Object} Fixed Date object.
         */
        var currentDate = function () {
            // get client's current date
            var date = new Date(Date.now() + settings.clockDiff);

            // turn date to utc
            var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

            // set new Date object
            var new_date = new Date(utc + (3600000 * settings.offset));

            return new_date;
        };

        /**
         * Main downCount function that calculates everything
         */
        function countdown () {
            var target_date = new Date(settings.date), // set target date
                current_date = currentDate(); // get fixed current date

            // difference of dates
            var difference = target_date - current_date;

            // if difference is negative than it's pass the target date
            if (difference < 0) {
                if (callback && typeof callback === 'function') callback();
                return;
            }

            // calculate dates
            var days = Math.floor(difference / _day),
                hours = Math.floor((difference % _day) / _hour),
                minutes = Math.floor((difference % _hour) / _minute),
                seconds = Math.floor((difference % _minute) / _second);

                // fix dates so that it will show two digets
                days = (String(days).length >= 2) ? days : '0' + days;
                hours = (String(hours).length >= 2) ? hours : '0' + hours;
                minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

            // based on the date change the refrence wording
            var ref_days = (days < 2) ? settings.i18n.day : settings.i18n.days,
                ref_hours = (hours < 2) ? settings.i18n.hour : settings.i18n.hours,
                ref_minutes = (minutes < 2) ? settings.i18n.minute : settings.i18n.minutes,
                ref_seconds = (seconds < 2) ? settings.i18n.second : settings.i18n.seconds;


            // set to DOM
            $elem.$days.text(days);
            $elem.$hours.text(hours);
            $elem.$minutes.text(minutes);
            $elem.$seconds.text(seconds);

            $elem.$days_ref.text(ref_days);
            $elem.$hours_ref.text(ref_hours);
            $elem.$minutes_ref.text(ref_minutes);
            $elem.$seconds_ref.text(ref_seconds);

            setTimeout(countdown, 1000);
        }

        countdown();
        this.removeClass('invisible');
    };

})(jQuery);
