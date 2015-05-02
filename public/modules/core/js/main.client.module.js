;(function ($) {
    'use strict';

    function defineMainPageBehaviors () {

        // Table elements (event infos)
        $('body').on('click', 'tr[data-uri]', function () {
            window.location.href = $(this).data('uri');
        });

        // Legal and Other tables
        $('#legal-year-select, #legal-country-select').on('change', function () {
            loadTable('legal');
        });
        $('#others-year-select, #others-country-select').on('change', function () {
            loadTable('others');
        });
    }

    function loadTable (category) {
        var $loader = $('#' + category + '-loader');
        var country = $('#' + category + '-country-select').val();
        var year = $('#' + category + '-year-select').val();

        $loader.removeClass('invisible');
        $.get([category, country, year].join('/')).then(function (data) {
            $('#table-' + category).fadeOut(500, function () {
                $(this).replaceWith(data);
                $loader.addClass('invisible');
            });
        });
    }

    $(document).ready(function () {

        if (window.nextHolidayDate) {
            $('#countdown').downCount({
                date: window.nextHolidayDate,
                offset: +1,
                clockDiff : (typeof window.now === 'number' && window.now > 0) ? (window.now - Date.now()) : 0    // Calculate the diff with user clock
            }, function () {
                $('body > .content').fadeOut(1000, function () {
                    window.location.reload();
                });
            });

            defineMainPageBehaviors();
        }

    });

})(jQuery);
