/**
 * @module   stringhelper.core
 * @requires core
 *
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 *
 *  lastModified: 2012-03-15 08:31:32.736933
 * -->
 *
 * <p>A <code>String</code> helper.</p>
 */
(function(framework) {
    'use strict';

    var _         = framework.protecteds;
    var attr      = _.getAttr;
    var create    = attr(_, 'create');
    var def       = attr(_, 'define');
    var require   = attr(_, 'require');

    /*
     * Module Name
     */
    var kModuleName = 'StringHelper';

    /**
     * @class {static} o2.StringHelper
     *
     * <p>A <code>String</code> helper <strong>class</strong>.</p>
     */
    var me = create(kModuleName);

    /*
     * Aliases
     */
    var math   = Math;
    var floor  = attr(math, 'floor');
    var random = attr(math, 'random');
    var slice  = attr(Array.prototype, 'slice');

    var trim   = String.prototype.trim;

    /*
     * Common Constants
     */
    var kBlank          = ' ';
    var kDecimalPoint   = '.';
    var kEmpty          = '';
    var kFormatEnd      = '}';
    var kFormatStart    = '{';
    var kGlobal         = 'g';
    var kNumeric        = '([0-9]+)';
    var kRandomCharFeed = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

    /*
     * Default length for generating a random <code>String</code>s.
     */
    var kDefaultRandomLength = 8;

   /*
    * Common Regular Expressions
    */
    var kPrintfRegExp     = /(%(\w+):s)|(%s)/g;
    var kTrimRegExp       = /^\s+|\s+$/g;
    var kWhitespaceRegExp = /\s+/g;

    /*
     * Printf Replacement Indexes
     */
    var kAllIndex                   = 0;
    var kParametrizedMatchIndex     = 2;
    var kReplaceParameterStartIndex = 1;

    /*
     * Guid
     */
    var kGuidRadix = 36;
    var kGuidShift = 30;

    /**
     * @function {static} o2.StringHelper.concat
     *
     * <p>Concatanes all its arguments into a single <code>String</code>.
     * This is faster than adding those <code>String</code>s with
     * <code>+</code>.</p>
     *
     * @return the concataneted <code>String</code>.
     */
    def(me, 'concat', function() {
        return slice.call(arguments).join(kEmpty);
    });

    /*
     *
     */
    var concat = require(kModuleName, 'concat');

    /**
     * @function {static} o2.StringHelper.format
     *
     * <p>Works similar to <strong>C#</strong>'s
     * <code>String.Format</code>.</p>
     * <p>Usage Example:<p>
     * <pre>
     * o2.StrinHelper.format("Hello {0}. What's going on in {1}?", 'Ninja',
     * 'California');
     * //will return "Hello Ninja. What's going on in California"
     * </pre>
     *
     * @return the formated <code>String</code>.
     */
    def(me, 'format', function() {
        var args = arguments;

        if (args.length === 0) {
            return null;
        }

        if (args.length === 1) {
            return args[0];
        }

        var pattern = new RegExp([kFormatStart, kNumeric,
            kFormatEnd].join(kEmpty), kGlobal);

        return args[0].replace(pattern, function(match, index) {
            var dummy = null;
            dummy = match;

            return args[(+index) + 1];
        });
    });

    /**
     * @function {static} o2.StringHelper.generateGuid
     *
     * <p>Creates a globally unique identifier (i.e. <strong>GUID</strong>),
     * for that browsing session.</p>
     *
     * @return a <strong>GUID</strong>.
     */
    def(me, 'generateGuid', function() {
        return (
            (new Date()).getTime() + Math.random() * (1 << kGuidShift)
        ).toString(kGuidRadix).replace(kDecimalPoint, kEmpty);
    });

    /**
     * @function {static} o2.StringHelper.generateRandom
     *
     * <p>Generates a random <code>String</code>.</p>
     *
     * @param {Integer} length - (optional - default: {@link
     * StringHelper.config.constants.DEFAULT_RANDOM_LENGTH})
     * length of the <code>String</code> to be generated.
     *
     * @return the generated <code>String</code>.
     */
    def(me, 'generateRandom', function(length) {
        var len = length || kDefaultRandomLength;

        var chars = kRandomCharFeed;
        var charsLength = chars.length;

        var randomNumber = 0;
        var i = 0;

        var buffer = [];

        for (i = 0; i < len; i++) {
            randomNumber = floor(random() * charsLength);

            buffer.push(chars.substring(randomNumber, randomNumber + 1));
        }

        return buffer.join(kEmpty);
    });

    /**
     * @function {static} o2.StringHelper.printf
     *
     * <p>Works similar to <strong>C</strong>'s <strong>printf</strong>
     * function.</p>
     *
     * <p>Usage example:</p>
     *
     * <pre>
     * var test1 = 'lorem %s %s sit amet';
     * var test2 = 'lorem %1:s %2:s sit %2:s amet %1:s';
     *
     * //This will return 'lorem ipsum dolor sit amet''
     * o2.StringHelper.printf(test1, 'ipsum', 'dolor');
     *
     * //This will return 'lorem ipsum dolor sit dolor amet ipsum'
     * o2.StringHelper.printf(test1, 'ipsum', 'dolor');
     * </pre>
     *
     * @param {String} str - the <code>String</code> to format.
     *
     * @return the formatted <code>String</code>.
     */
    def(me, 'printf', function(str) {
        var lastMatch = 0;
        var buffer = [];

        var index = kReplaceParameterStartIndex;

        var result = kPrintfRegExp.exec(str);

        while (result) {
            buffer.push(str.substring(lastMatch, result.index));

            if (!result[kParametrizedMatchIndex]) {
                buffer.push(arguments[index++]);
            } else if (
                arguments.hasOwnProperty(result[kParametrizedMatchIndex])
            ) {
                buffer.push(arguments[result[kParametrizedMatchIndex]]);
            } else {
                buffer.push(result[kAllIndex]);
            }

            lastMatch = result.index + result[kAllIndex].length;

            result = kPrintfRegExp.exec(str);
        }

        buffer.push(str.substr(lastMatch));

        return buffer.join(kEmpty);
    });

    /**
     * @function {static} o2.StringHelper.remove
     *
     * <p>Simply removes the phrases that match the <code>RegExp</code> from
     * the <code>String</code>.</p>
     *
     * @param {String} str - the <code>String</code> to process.
     * @param {RegExp} regExp - the <code>RegExp</code> to process agains.
     *
     * @return the processed <code>String</code>.
     */
    def(me, 'remove', function(str, regExp) {
        return concat(kEmpty, str).replace(regExp, kEmpty);
    });

    if (trim) {

        /**
         * @function {static} o2.StringHelper.trim
         *
         * <p>Trims white space from beginning and end of the
         * <code>String</code>.</p>
         *
         * @param {String} str - the <code>String</code> to process.
         * @param {Boolean} shouldCompact - Optional (default:
         * <code>false</code>)
         *     if <code>true</code>, multiple whitespace is compacted into single
         * whitespace.
         *
         * @return the processed <code>String</code>.
         */
        def(me, 'trim', function(str, shouldCompact) {
            var willCompact = shouldCompact || false;

            var s = concat(kEmpty, str);

            return willCompact ?
                s.replace(kWhitespaceRegExp, kBlank).trim() :
                s.trim();
        });
    } else {
        def(me, 'trim', function(str, shouldCompact) {
            var willCompact = shouldCompact || false;

            var s = concat(kEmpty, str);

            return willCompact ?
                s.replace(kWhitespaceRegExp, kBlank).replace(
                    kTrimRegExp, kEmpty) :
                s.replace(kTrimRegExp, kEmpty);
        });
    }

    var strim = require(kModuleName, 'trim');

    /**
     * @function {static} o2.StringHelper.compact
     *
     * <p>Works identical to <code>StringHelper.trim(str,
     * true)</code>.</p>
     *
     * @param {String} str - the <code>String</code> to process.
     *
     * @return the processed <code>String</code>.
     *
     * @see StringHelper.trim
     */
    def(me, 'compact', function(str) {
        return strim(concat(kEmpty, str), true);
    });

}(this.o2));
