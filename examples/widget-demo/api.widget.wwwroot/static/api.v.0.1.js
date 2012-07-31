/*
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 *
 *  lastModified: 2012-07-31 14:37:31.343400
 * -->
 */
(function(window, document, isDebugMode) {
    'use strict';

    /*
     * Query Formation
     */
    var kAnd    = '&';
    var kEmpty  = '';
    var kEquals = '=';
    var kQuery  = '?';

    /*
     * Parameter Names
     */
    var kGuid         = 'guid';
//    var kPassword     = 'p';
    var kRandom       = 'r';
//    var kUsername     = 'u';
    var kVersion      = 'v';

//    /*
//     * Event Types
//     */
//    var kClick = 'click';

    /*
     * Regular Expression
     */
    var kCompleteRegExp   = /loaded|complete/;

    /*
     * Tags
     */
//TOOD:
    var kHead   = 'head';
    var kScript = 'script';
//    var kDiv    = 'div';

    /*
     * Mime Types
     */
    var kScriptType = 'text/javascript';

    /*
     * Globals
     */
    var kO2Alias           = '_wd_o2';
    var kWidgetAlias       = '_wd';

    /*
     * Common Widget Keys
     */
    var kReadyState = 'readyState';

    /*
     * Widget Ready States
     */
    var readyState = {
        LOADED               : 1,
        LOADING_DEPENDENCIES : 2,
        LOADED_DEPENDENCIES  : 3,
        BEGIN_PROCESS_QUEUE  : 4,
        BEGIN_RENDER         : 5,
        COMPLETE             : 6
    };

    /*
     * URL
     */
    var url = {
        API_ROOT        : 'http://api.widget.www/',
        O2_ROOT         : 'http://api.widget.www/lib/o2.js/',
        WIDGET_LIB_ROOT : 'http://api.widget.www/lib/wd/v.0.1/'
    };

    /*
     * Path
     */
    var path = {
        BEACON : 'api/v.0.1/beacon',
        CSS    : 'css/v.0.1/widget.css',
        LOGIN  : 'api/v.0.1/login',
        PARAMS : 'api/v.0.1/params'
    };

    /*
     * Does nothing, and that's the point.
     */
    function noop() {}

    /*
     * Logs to console for debug mode.
     * Does nothing in release mode.
     */
    var log = function(stuff) {
        if (!!isDebugMode && !!window.console) {
            log = function(stuff) {
                window.console.log(stuff);
            };

            log(stuff);

            return;
        }

        log = noop;
    };

    // Publisher has forgotten to provide initialization data.
    if (!window[kWidgetAlias]) {
        log('Widget namespace cannot be found; exiting.');

        return;
    }

    // To avoid re-defining everything if the bootloader is included in
    // more than one place in the publisher's website.
    if (window[kWidgetAlias][kReadyState]) {
        log('Widget has already been loaded; exiting.');

        return;
    }

    window[kWidgetAlias].protecteds = {};

    /*
     * Should match beacon version timestamp.
     */
    var versionTimestamp = '20120720135547909116';

    /*
     * Resources to be loaded asynchronously.
     */
    var scriptQueue = [];

    /*
     * This will be set after resource initialization.
     */
    var o2 = null;

    /*
     * Sets the internal ready state.
     */
    function setReadyState(state) {
        window[kWidgetAlias][kReadyState] = state;
    }

    setReadyState(readyState.LOADED);

    /*
     * Asynchronously inserts a script element to the head
     * of the document.
     */
    function insertScript(root, src) {
        var s = document.createElement(kScript);
        var x = document.getElementsByTagName(kScript)[0] ||
            document.getElementsByTagName(kHead)[0];

        s.type  = kScriptType;
        s.async = true;
        s.src   = [root, src].join(kEmpty);

        x.parentNode.insertBefore(s, x);

        return s;
    }

    /*
     * Revalidates cache for this bootloader script, if there's a newer
     * version available. The changes will take effect only AFTER the user
     * refreshes the page.
     */
    function checkForUpdates() {
        log('o->checkForUpdates()');

        insertScript(url.API_ROOT, [path.BEACON, kQuery,
            kVersion,  kEquals, versionTimestamp , kAnd,
            kRandom, kEquals, (new Date()).getTime()
        ].join(kEmpty), noop);
    }

    //TODO: move above methods to apropriate modules.

    //
    // Bootloader logic below
    //

    /*
     * Initialize after loading prerequisites.
     */
    function initialize() {
        log('o->initialize()');

        var wp = window[kWidgetAlias].protecteds;

        if (!window.o2) {return;}

        window.o2.noConflict(kO2Alias);

        o2 = window[kO2Alias];

        // TODO:
        wp.log           = log;
        wp.setReadyState = setReadyState;
        wp.o2            = o2;
        wp.readyState    = readyState;
        wp.url           = url;
        wp.path          = path;
        wp.noop          = noop;

        setReadyState(readyState.LOADED_DEPENDENCIES);

        var config = wp.Config.get();

        config[kGuid] = o2.String.generateGuid();

        wp.Init.loadState(config);
    }

    /*
     * Loads the next resource after the former one
     * has loaded successfully.
     */
    function loadNext(root, loader, callback) {
        log('o->loadNext(');
        log(root);
        log(loader);
        log(callback);
        log(')');

        if (scriptQueue.length) {
            loader(root, scriptQueue.shift(), callback);

            return;
        }

        callback();
    }

    /*
     * Loads the given script.
     * <strong>callback</strong> is the function to be executed after
     * there's no resource left to be loeded next.
     */
    var loadScript = function(root, src, callback) {
        log('o->loadScript(');
        log(root);
        log(src);
        log(callback);
        log(')');

        var s = insertScript(root, src);

        function processNext() {
            loadNext(root, loadScript, callback);
        }

        s.onreadystatechange = function() {
            if(kCompleteRegExp.test(s.readyState)) {
                processNext();
            }
        };

        s.onload = function() {
            processNext();
        };
    };

    /*
     * Loads an array of scripts one after another.
     */
    function loadScripts(root, ar, callback) {
        log('o->loadScripts(');
        log(root);
        log(ar);
        log(callback);
        log(')');

        scriptQueue = ar;

        loadScript(root, scriptQueue.shift(), callback);
    }

    /*
     * Load necessary o2.js components in noConflict mode.
     */
    function loadDependencies(callback) {
        log('o->loadDependencies(');
        log(callback);
        log(')');

        setReadyState(readyState.LOADING_DEPENDENCIES);

        loadScripts(url.O2_ROOT, [
            'o2.meta.js',
            'o2.core.js',
            'o2.string.core.js',
            'o2.jsonp.core.js',
            'o2.dom.constants.js',
            'o2.dom.core.js',
            'o2.dom.load.js',
            'o2.event.constants.js',
            'o2.event.core.js',
            'o2.validation.core.js',
            'o2.method.core.js',
            'o2.collection.core.js'
        ], function() {
        loadScripts(url.WIDGET_LIB_ROOT, [
            'config.js',
            'dom.js',
            'event.js',
            'init.js',
            'queue.js',
            'rendering.js'
        ], callback);});
    }

    //
    // "Widget Initialization Flow" starts down below:
    //

    checkForUpdates(versionTimestamp);
    loadDependencies(initialize);
}(this, this.document, true));
