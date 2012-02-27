/**
 * @module   datehelper
 * @requires core
 *
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 *
 *  lastModified: 2012-02-16 19:51:06.236222
 * -->
 *
 * <p>A <code>Date</code> helper module.</p>
 */
(function(framework) {
    'use strict';

/*    var _         = framework.protecteds;
    var alias     = _.alias;
    var attr      = _.getAttr;
    var construct = _.construct;
    var create    = _.create;
    var def       = _.define;
    var obj       = _.getObject;
    var proto     = _.proto;
    var require   = _.require;*/

    function use() {

    }

    /*
     * Aliases
     */
    var $ = use(framework.$);
    var format = use(framework.StringHelper.format);

    /*
     * i18n
     */
    var kSeconds = 'seconds';
    var kOneMinuteAgo = 'a minute ago';
    var kMinutes = 'minutes';
    var kOneMinuteFromNow = 'a minute from now';
    var kOneHourAgo = 'an hour ago';
    var kOneHourFromNow = 'an hour from now';
    var kHours = 'hours';
    var kYesterday = 'yesterday';
    var kTomorrow = 'tomorrow';
    var kDays = 'days';
    var kLastWeek = 'last week';
    var kNextWeek = 'next week';
    var kWeeks = 'weeks';
    var kLastMonth = 'last month';
    var kNextMonth = 'next month';
    var kMonths = 'months';
    var kLastYear = 'last year';
    var kNextYear = 'next year';
    var kYears = 'years';
    var kLastCentury = 'last century';
    var kNextCentury = 'next century';
    var kCenturies = 'centuries';
    var kAgo = 'ago';
    var kFromNow = 'from now';
    var kJustNow = 'just now';
    var kTokenizedText = '{0} {1} {2}';

    /*
     * Time Formats
     */
    var timeFormats = [
        [60, kSeconds, 1],
        [120, kOneMinuteAgo, kOneMinuteFromNow],
        [3600, kMinutes, 60],
        [7200, kOneHourAgo, kOneHourFromNow],
        [86400, kHours, 3600],
        [172800, kYesterday, kTomorrow],
        [604800, kDays, 86400],
        [1209600, kLastWeek, kNextWeek],
        [2419200, kWeeks, 604800],
        [4838400, kLastMonth, kNextMonth],
        [29030400, kMonths, 2419200],
        [58060800, kLastYear, kNextYear],
        [2903040000, kYears, 29030400],
        [5806080000, kLastCentury, kNextCentury],
        [58060800000, kCenturies, 2903040000]
    ];

    /*
     * Common Constants
     */
    var kString = 'string';

    /**
     * @class {static} o2.DateHelper
     *
     * <p>A date/time utilities class.</p>
     */
    var me = framework.DateHelper = {};

    /**
     * @function {static} o2.DateHelper.getPrettyDate
     *
     * <p>Prints a human-readable time string, by looking at the difference
     * between two timestamps.</p>
     *
     * @param {Integer} time - the offset time in milliseconds.
     * @param {Integer} currTime - (Optional, default to NOW) the base time
     * in milliseconds.
     */
    me.getPrettyDate = function(time, currTime) {
        var currentTime = currTime || $.now();
        var seconds = (new Date(currentTime) - new Date(time)) / 1000;
        var token = kAgo;
        var  listChoice = 1;

        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = kFromNow;
            listChoice = 2;
        }

        var i = 0;
        var currentFormat = timeFormats[i];

        while (currentFormat) {
            if (seconds < 5) {
                return kJustNow;
            }

            if (seconds < currentFormat[0]) {
                if (typeof currentFormat[2] === kString) {
                    return currentFormat[listChoice];
                }

                return format(kTokenizedText,
                    Math.floor(seconds / currentFormat[2]),
                    currentFormat[1],
                    token
                );
            }

            currentFormat = timeFormats[++i];
        }

        return time;
    };


    /**
     * @function {static} o2.DateHelper.getCurrentTime
     *
     * <p>An alias to {@link o2.now}.</p>
     *
     * @see o2.now
     */

    /**
     * @function {static} o2.DateHelper.currentTime
     *
     * <p>An alias to {@link o2.now}.</p>
     *
     * @see o2.now
     */

    /**
     * @function {static} o2.DateHelper.now
     *
     * <p>An alias to {@link o2.now}.</p>
     *
     * @see o2.now
     */
    me.now = me.currentTime = me.getCurrentTime = function() {
        return framework.now();
    };
}(this.o2));