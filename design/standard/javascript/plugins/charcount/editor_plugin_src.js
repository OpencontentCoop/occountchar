/**
 * editor_plugin_src.js
 *
 * Copyright 2017, OpenContent Scarl
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function () {
    tinymce.create('tinymce.plugins.CharCount', {
        block: 0,
        id: null,
        countre: null,
        cleanre: null,

        init: function (ed, url) {
            var t = this, last = 0, VK = tinymce.VK;

            t.countre = ed.getParam('charcount_countregex', /[\w\u2019\'-]+/g); // u2019 == &rsquo;
            t.cleanre = ed.getParam('charcount_cleanregex', /[.(),;:!?%#$?\'\"_+=\\\/-]*/g);
            t.update_rate = ed.getParam('charcount_update_rate', 1000);
            t.update_on_delete = ed.getParam('charcount_update_on_delete', true);
            t.id = ed.id + '-char-count';

            ed.onPostRender.add(function (ed, cm) {
                var row, id;

                // Add it to the specified id or the theme advanced path
                id = ed.getParam('charcount_target_id');
                if (!id) {
                    row = tinymce.DOM.get(ed.id + '_path_row');

                    if (row)
                        tinymce.DOM.add(row.parentNode, 'div', {'style': 'float: right'}, ed.getLang('charcount.chars', 'Chars: ') + '<span id="' + t.id + '">0</span>');
                } else {
                    tinymce.DOM.add(id, 'span', {}, '<span id="' + t.id + '">0</span>');
                }
            });

            ed.onInit.add(function (ed) {
                ed.selection.onSetContent.add(function () {
                    t._count(ed);
                });

                t._count(ed);
            });

            ed.onSetContent.add(function (ed) {
                t._count(ed);
            });

            function checkKeys(key) {
                return key !== last && (key === VK.ENTER || key === VK.SPACEBAR || key === VK.DELETE);
            }

            function checkDelOrBksp(key) {
                return key === VK.DELETE || key === VK.BACKSPACE;
            }

            ed.onKeyUp.add(function (ed, e) {
                if (checkKeys(e.keyCode) || t.update_on_delete && checkDelOrBksp(e.keyCode)) {
                    t._count(ed);
                }

                last = e.keyCode;
            });
        },

        _getCount: function (ed) {
            var tc = 0;
            var tx = ed.getContent({ format: 'raw' });
            var decoded = this._decodeHtml(tx);
            var decodedStripped = decoded.replace(/(<([^>]+)>)/ig, '');
            var tc = decodedStripped.length;
            return tc;
        },

        _decodeHtml: function(html) {
            var txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },

        _count: function (ed) {
            var t = this;

            // Keep multiple calls from happening at the same time
            if (t.block)
                return;

            t.block = 1;

            setTimeout(function () {
                if (!ed.destroyed) {
                    var tc = t._getCount(ed);
                    tinymce.DOM.setHTML(t.id, tc.toString());
                    setTimeout(function () {
                        t.block = 0;
                    }, t.update_rate);
                }
            }, 1);
        },

        getInfo: function () {
            return {
                longname: 'Char Count plugin',
                author: 'OpenContent Scarl',
                authorurl: 'http://www.opencontent.it',
                infourl: 'http://www.opencontent.it/TinyMCE:Plugins/charcount',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    tinymce.PluginManager.add('charcount', tinymce.plugins.CharCount);
})();
