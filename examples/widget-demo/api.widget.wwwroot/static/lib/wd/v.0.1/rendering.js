/*
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 *
 *  lastModified: 2012-07-31 14:32:45.318637
 * -->
 */
(function(window) {
    'use strict';

    if (!window._wd) {
        return;
    }

    var wd = window._wd;

    var p = wd.protecteds;

    /*
     * Aliases
     */
    function log(stuff) { p.log(stuff); }

    /*
     *
     */
    var me = p.Rendering = {};

    /*
     * Things done after the initial view is rendered.
     */
    function processPostRenderActions() {
        p.Event.delegate();

        p.Queue.process();

        p.Queue.override();

        //TODO: p.setReadyState('COMPLETE');
        p.setReadyState(p.readyState.COMPLETE);

        p.Init.fireAsyncInit();
    }

    /*
     * Does the actual rendering.
     */
    function renderWidget(container, html) {
        log('o->renderWidget(');
        log(container);
        log(html);
        log(')');

        if (!container) {
            return;
        }

        //TODO: to p.Dom
        container.innerHTML = html;
    }

    /*
     * Renders the widget
     */
    me.render = function(state) {
        log('o->render(');
        log(state);
        log(')');

        var div  = p.Dom.getWidgetAnchor();
        var o2   = p.o2;
        var url  = p.url;
        var path = p.path;

        if (!div) {
            return;
        }

        //TODO: to p.dom
        o2.Dom.loadCss(
            o2.String.concat(url.API_ROOT, path.CSS),
            function() {
                renderWidget(div, state.data);

                //TODO: use events.
                processPostRenderActions();
            }
        );
    };
}(this));