function t384_checkSize(recid) {
    var el = $("#rec" + recid);
    var sizer = el.find('.t-carousel__height');
    var height = sizer.height();
    var width = sizer.width();
    var ratio = width / height;
    var gallerywrapper = el.find(".t-carousel__checksize");
    var gallerywidth = gallerywrapper.width();
    if (height != $(window).height()) {
        gallerywrapper.css({'height': ((gallerywidth / ratio) + 'px')})
    }
}

function t396_init(recid) {
    var data = '';
    var res = t396_detectResolution();
    var ab = $('#rec' + recid).find('.t396__artboard');
    window.tn_window_width = $(window).width();
    window.tn_scale_factor = Math.round((window.tn_window_width / res) * 100) / 100;
    t396_initTNobj();
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_artboard_build(data, recid);
    $(window).resize(function () {
        tn_console('>>>> t396: Window on Resize event >>>>');
        t396_waitForFinalEvent(function () {
            if ($isMobile) {
                var ww = $(window).width();
                if (ww != window.tn_window_width) {
                    t396_doResize(recid)
                }
            } else {
                t396_doResize(recid)
            }
        }, 500, 'resizeruniqueid' + recid)
    });
    $(window).on("orientationchange", function () {
        tn_console('>>>> t396: Orient change event >>>>');
        t396_waitForFinalEvent(function () {
            t396_doResize(recid)
        }, 600, 'orientationuniqueid' + recid)
    });
    $(window).on('load', function () {
        t396_allelems__renderView(ab);
        if (typeof t_lazyload_update === 'function' && ab.css('overflow') === 'auto') {
            ab.bind('scroll', t_throttle(function () {
                if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
                    t_onFuncLoad('t_lazyload_update', function () {
                        t_lazyload_update()
                    })
                }
            }, 500))
        }
        if (window.location.hash !== '' && ab.css('overflow') === 'visible') {
            ab.css('overflow', 'hidden');
            setTimeout(function () {
                ab.css('overflow', 'visible')
            }, 1)
        }
    });
    var rec = $('#rec' + recid);
    if (rec.attr('data-connect-with-tab') == 'yes') {
        rec.find('.t396').bind('displayChanged', function () {
            var ab = rec.find('.t396__artboard');
            t396_allelems__renderView(ab)
        })
    }
    if (isSafari) rec.find('.t396').addClass('t396_safari');
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    if (isScaled && !isTildaModeEdit) t396_scaleBlock(recid)
}

function t396_getRotateValue(matrix) {
    var values = matrix.split('(')[1].split(')')[0].split(',');
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];
    var scale = Math.sqrt(a * a + b * b);
    var sin = b / scale;
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle
}

function t396_isOnlyScalableBrowser() {
    var isFirefox = navigator.userAgent.search("Firefox") !== -1;
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    return isFirefox || isOpera
}

function t396_scaleBlock(recid) {
    var isOnlyScalable = t396_isOnlyScalableBrowser();
    var res = t396_detectResolution();
    var rec = $('#rec' + recid);
    var $ab = rec.find('.t396__artboard');
    var abWidth = $ab.width();
    var updatedBlockHeight = Math.floor($ab.height() * window.tn_scale_factor);
    var ab_height_vh = t396_ab__getFieldValue($ab, 'height_vh');
    window.tn_scale_offset = (abWidth * window.tn_scale_factor - abWidth) / 2;
    if (ab_height_vh != '') {
        var ab_min_height = t396_ab__getFieldValue($ab, 'height');
        var ab_max_height = t396_ab__getHeight($ab);
        var scaledMinHeight = ab_min_height * window.tn_scale_factor;
        updatedBlockHeight = (scaledMinHeight >= ab_max_height) ? scaledMinHeight : ab_max_height
    }
    $ab.addClass('t396__artboard_scale');
    var styleStr = '<style class="t396__scale-style">' + '.t-rec#rec' + recid + ' { overflow: visible; }' + '#rec' + recid + ' .t396__carrier,' + '#rec' + recid + ' .t396__filter,' + '#rec' + recid + ' .t396__artboard {' + 'height: ' + updatedBlockHeight + 'px !important;' + 'width: 100vw !important;' + 'max-width: 100%;' + '}' + '<style>';
    $ab.append(styleStr);
    rec.find('.t396__elem').each(function () {
        var $el = $(this);
        var containerProp = t396_elem__getFieldValue($el, 'container');
        if (containerProp === 'grid') {
            if (isOnlyScalable) {
                var scaleProp = 'scale(' + window.tn_scale_factor + ')';
                $el.css('transform', scaleProp);
                $el.css('transform-origin', 'top left')
            } else {
                $el.css('zoom', window.tn_scale_factor);
                if ($el.attr('data-elem-type') === 'text' && res < 1200) $el.find('.tn-atom').css('-webkit-text-size-adjust', 'auto');
                $el.find('.tn-atom').css('transform-origin', 'center')
            }
        }
    })
}

function t396_doResize(recid) {
    var isOnlyScalable = t396_isOnlyScalableBrowser();
    var ww;
    var rec = $('#rec' + recid);
    if ($isMobile) {
        ww = $(window).width()
    } else {
        ww = window.innerWidth
    }
    var res = t396_detectResolution();
    rec.find('.t396__scale-style').remove();
    if (!isOnlyScalable) {
        rec.find('.t396__elem').css('zoom', '');
        rec.find('.t396__elem .tn-atom').css('transform-origin', '')
    }
    var ab = rec.find('.t396__artboard');
    var abWidth = ab.width();
    window.tn_window_width = ww;
    window.tn_scale_factor = Math.round((window.tn_window_width / res) * 100) / 100;
    window.tn_scale_offset = (abWidth * window.tn_scale_factor - abWidth) / 2;
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_ab__renderView(ab);
    t396_allelems__renderView(ab);
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    if (isScaled && !isTildaModeEdit) t396_scaleBlock(recid)
}

function t396_detectResolution() {
    var ww;
    if ($isMobile) {
        ww = $(window).width()
    } else {
        ww = window.innerWidth
    }
    var res;
    res = 1200;
    if (ww < 1200) {
        res = 960
    }
    if (ww < 960) {
        res = 640
    }
    if (ww < 640) {
        res = 480
    }
    if (ww < 480) {
        res = 320
    }
    return (res)
}

function t396_initTNobj() {
    tn_console('func: initTNobj');
    window.tn = {};
    window.tn.canvas_min_sizes = ["320", "480", "640", "960", "1200"];
    window.tn.canvas_max_sizes = ["480", "640", "960", "1200", ""];
    window.tn.ab_fields = ["height", "width", "bgcolor", "bgimg", "bgattachment", "bgposition", "filteropacity", "filtercolor", "filteropacity2", "filtercolor2", "height_vh", "valign"]
}

function t396_updateTNobj() {
    tn_console('func: updateTNobj');
    if (typeof window.zero_window_width_hook != 'undefined' && window.zero_window_width_hook == 'allrecords' && $('#allrecords').length) {
        window.tn.window_width = parseInt($('#allrecords').width())
    } else {
        window.tn.window_width = parseInt($(window).width())
    }
    if ($isMobile) {
        window.tn.window_height = parseInt($(window).height())
    } else {
        window.tn.window_height = parseInt(window.innerHeight)
    }
    if (window.tn.curResolution == 1200) {
        window.tn.canvas_min_width = 1200;
        window.tn.canvas_max_width = window.tn.window_width
    }
    if (window.tn.curResolution == 960) {
        window.tn.canvas_min_width = 960;
        window.tn.canvas_max_width = 1200
    }
    if (window.tn.curResolution == 640) {
        window.tn.canvas_min_width = 640;
        window.tn.canvas_max_width = 960
    }
    if (window.tn.curResolution == 480) {
        window.tn.canvas_min_width = 480;
        window.tn.canvas_max_width = 640
    }
    if (window.tn.curResolution == 320) {
        window.tn.canvas_min_width = 320;
        window.tn.canvas_max_width = 480
    }
    window.tn.grid_width = window.tn.canvas_min_width;
    window.tn.grid_offset_left = parseFloat((window.tn.window_width - window.tn.grid_width) / 2)
}

var t396_waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId"
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId])
        }
        timers[uniqueId] = setTimeout(callback, ms)
    }
})();

function t396_switchResolution(res, resmax) {
    tn_console('func: switchResolution');
    if (typeof resmax == 'undefined') {
        if (res == 1200) resmax = '';
        if (res == 960) resmax = 1200;
        if (res == 640) resmax = 960;
        if (res == 480) resmax = 640;
        if (res == 320) resmax = 480
    }
    window.tn.curResolution = res;
    window.tn.curResolution_max = resmax
}

function t396_artboard_build(data, recid) {
    tn_console('func: t396_artboard_build. Recid:' + recid);
    tn_console(data);
    var ab = $('#rec' + recid).find('.t396__artboard');
    t396_ab__renderView(ab);
    ab.find('.tn-elem').each(function () {
        var item = $(this);
        if (item.attr('data-elem-type') == 'text') {
            t396_addText(ab, item)
        }
        if (item.attr('data-elem-type') == 'image') {
            t396_addImage(ab, item)
        }
        if (item.attr('data-elem-type') == 'shape') {
            t396_addShape(ab, item)
        }
        if (item.attr('data-elem-type') == 'button') {
            t396_addButton(ab, item)
        }
        if (item.attr('data-elem-type') == 'video') {
            t396_addVideo(ab, item)
        }
        if (item.attr('data-elem-type') == 'html') {
            t396_addHtml(ab, item)
        }
        if (item.attr('data-elem-type') == 'tooltip') {
            t396_addTooltip(ab, item)
        }
        if (item.attr('data-elem-type') == 'form') {
            t396_addForm(ab, item)
        }
        if (item.attr('data-elem-type') == 'gallery') {
            t396_addGallery(ab, item)
        }
    });
    $('#rec' + recid).find('.t396__artboard').removeClass('rendering').addClass('rendered');
    if (ab.attr('data-artboard-ovrflw') == 'visible') {
        $('#allrecords').css('overflow', 'hidden')
    }
    if ($isMobile) {
        $('#rec' + recid).append('<style>@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}</style>')
    }
}

function t396_ab__renderView(ab) {
    var fields = window.tn.ab_fields;
    for (var i = 0; i < fields.length; i++) {
        t396_ab__renderViewOneField(ab, fields[i])
    }
    var ab_min_height = t396_ab__getFieldValue(ab, 'height');
    var ab_max_height = t396_ab__getHeight(ab);
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
    if (isScaled && !isTildaModeEdit && ab_height_vh != '') var scaledMinHeight = parseInt(ab_min_height, 10) * window.tn_scale_factor;
    var offset_top = 0;
    if (ab_min_height == ab_max_height || (scaledMinHeight && scaledMinHeight >= ab_max_height)) {
        offset_top = 0
    } else {
        var ab_valign = t396_ab__getFieldValue(ab, 'valign');
        if (ab_valign == 'top') {
            offset_top = 0
        } else if (ab_valign == 'center') {
            if (scaledMinHeight) {
                offset_top = parseFloat((ab_max_height - scaledMinHeight) / 2).toFixed(1)
            } else {
                offset_top = parseFloat((ab_max_height - ab_min_height) / 2).toFixed(1)
            }
        } else if (ab_valign == 'bottom') {
            if (scaledMinHeight) {
                offset_top = parseFloat((ab_max_height - scaledMinHeight)).toFixed(1)
            } else {
                offset_top = parseFloat((ab_max_height - ab_min_height)).toFixed(1)
            }
        } else if (ab_valign == 'stretch') {
            offset_top = 0;
            ab_min_height = ab_max_height
        } else {
            offset_top = 0
        }
    }
    ab.attr('data-artboard-proxy-min-offset-top', offset_top);
    ab.attr('data-artboard-proxy-min-height', ab_min_height);
    ab.attr('data-artboard-proxy-max-height', ab_max_height);
    var filter = ab.find('.t396__filter');
    var carrier = ab.find('.t396__carrier');
    var abHeightVh = t396_ab__getFieldValue(ab, 'height_vh');
    abHeightVh = parseFloat(abHeightVh);
    if (window.isMobile && abHeightVh) {
        var height = document.documentElement.clientHeight * parseFloat(abHeightVh / 100);
        ab.css('height', height);
        filter.css('height', height);
        carrier.css('height', height)
    }
}

function t396_addText(ab, el) {
    tn_console('func: addText');
    var fields_str = 'top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addImage(ab, el) {
    tn_console('func: addImage');
    var fields_str = 'img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    el.find('img').on("load", function () {
        t396_elem__renderViewOneField(el, 'top');
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != '') {
            setTimeout(function () {
                t396_elem__renderViewOneField(el, 'top')
            }, 2000)
        }
    }).each(function () {
        if (this.complete) $(this).trigger('load')
    });
    el.find('img').on('tuwidget_done', function (e, file) {
        t396_elem__renderViewOneField(el, 'top')
    })
}

function t396_addShape(ab, el) {
    tn_console('func: addShape');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addButton(ab, el) {
    tn_console('func: addButton');
    var fields_str = 'top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    return (el)
}

function t396_addVideo(ab, el) {
    tn_console('func: addVideo');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var viel = el.find('.tn-atom__videoiframe');
    var viatel = el.find('.tn-atom');
    viatel.css('background-color', '#000');
    var vihascover = viatel.attr('data-atom-video-has-cover');
    if (typeof vihascover == 'undefined') {
        vihascover = ''
    }
    if (vihascover == 'y') {
        viatel.click(function () {
            var viifel = viel.find('iframe');
            if (viifel.length) {
                var foo = viifel.attr('data-original');
                viifel.attr('src', foo)
            }
            viatel.css('background-image', 'none');
            viatel.find('.tn-atom__video-play-link').css('display', 'none')
        })
    }
    var autoplay = t396_elem__getFieldValue(el, 'autoplay');
    var showinfo = t396_elem__getFieldValue(el, 'showinfo');
    var loop = t396_elem__getFieldValue(el, 'loop');
    var mute = t396_elem__getFieldValue(el, 'mute');
    var startsec = t396_elem__getFieldValue(el, 'startsec');
    var endsec = t396_elem__getFieldValue(el, 'endsec');
    var tmode = $('#allrecords').attr('data-tilda-mode');
    var url = '';
    var viyid = viel.attr('data-youtubeid');
    if (typeof viyid != 'undefined' && viyid != '') {
        url = '//youtube.com/embed/';
        url += viyid + '?rel=0&fmt=18&html5=1';
        url += '&showinfo=' + (showinfo == 'y' ? '1' : '0');
        if (loop == 'y') {
            url += '&loop=1&playlist=' + viyid
        }
        if (startsec > 0) {
            url += '&start=' + startsec
        }
        if (endsec > 0) {
            url += '&end=' + endsec
        }
        if (mute == 'y') {
            url += '&mute=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            var instFlag = 'y';
            var iframeClass = '';
            if (autoplay == 'y' && mute == 'y' && window.lazy == 'y') {
                instFlag = 'lazy';
                iframeClass = ' class="t-iframe"'
            }
            viel.html('<iframe id="youtubeiframe"' + iframeClass + ' width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="' + instFlag + '"></iframe>');
            if (autoplay == 'y' && mute == 'y' && window.lazy == 'y') {
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            }
            if (autoplay == 'y' && mute == 'y') {
                viatel.trigger('click')
            }
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {
            } else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe id="youtubeiframe" class="t-iframe" width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            } else {
                viel.html('<iframe id="youtubeiframe" width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>')
            }
        }
    }
    var vivid = viel.attr('data-vimeoid');
    if (typeof vivid != 'undefined' && vivid > 0) {
        url = '//player.vimeo.com/video/';
        url += vivid + '?color=ffffff&badge=0';
        if (showinfo == 'y') {
            url += '&title=1&byline=1&portrait=1'
        } else {
            url += '&title=0&byline=0&portrait=0'
        }
        if (loop == 'y') {
            url += '&loop=1'
        }
        if (mute == 'y') {
            url += '&muted=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            viel.html('<iframe data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {
            } else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe class="t-iframe" data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            } else {
                viel.html('<iframe src="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
            }
        }
    }
}

function t396_addHtml(ab, el) {
    tn_console('func: addHtml');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addTooltip(ab, el) {
    tn_console('func: addTooltip');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var pinEl = el.find('.tn-atom__pin');
    var tipEl = el.find('.tn-atom__tip');
    var tipopen = el.attr('data-field-tipopen-value');
    if (isMobile || (typeof tipopen != 'undefined' && tipopen == 'click')) {
        t396_setUpTooltip_mobile(el, pinEl, tipEl)
    } else {
        t396_setUpTooltip_desktop(el, pinEl, tipEl)
    }
    setTimeout(function () {
        $('.tn-atom__tip-img').each(function () {
            var foo = $(this).attr('data-tipimg-original');
            if (typeof foo != 'undefined' && foo != '') {
                $(this).attr('src', foo)
            }
        })
    }, 3000)
}

function t396_addForm(ab, el) {
    tn_console('func: addForm');
    var fields_str = 'width,top,left,';
    fields_str += 'inputs,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addGallery(ab, el) {
    tn_console('func: addForm');
    var fields_str = 'width,height,top,left,';
    fields_str += 'imgs,container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_elem__setFieldValue(el, prop, val, flag_render, flag_updateui, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200 && prop != 'zindex') {
        el.attr('data-field-' + prop + '-res-' + res + '-value', val)
    } else {
        el.attr('data-field-' + prop + '-value', val)
    }
    if (flag_render == 'render') elem__renderViewOneField(el, prop);
    if (flag_updateui == 'updateui') panelSettings__updateUi(el, prop, val)
}

function t396_elem__getFieldValue(el, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = el.attr('data-field-' + prop + '-res-960-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-value')
            }
        }
        if (res == 640) {
            r = el.attr('data-field-' + prop + '-res-640-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-960-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-value')
                }
            }
        }
        if (res == 480) {
            r = el.attr('data-field-' + prop + '-res-480-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-640-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-960-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-value')
                    }
                }
            }
        }
        if (res == 320) {
            r = el.attr('data-field-' + prop + '-res-320-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-480-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-640-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-res-960-value');
                        if (typeof r == 'undefined') {
                            r = el.attr('data-field-' + prop + '-value')
                        }
                    }
                }
            }
        }
    } else {
        r = el.attr('data-field-' + prop + '-value')
    }
    return (r)
}

function t396_elem__renderView(el) {
    tn_console('func: elem__renderView');
    var fields = el.attr('data-fields');
    if (!fields) {
        return !1
    }
    fields = fields.split(',');
    for (var i = 0; i < fields.length; i++) {
        t396_elem__renderViewOneField(el, fields[i])
    }
}

function t396_elem__renderViewOneField(el, field) {
    var value = t396_elem__getFieldValue(el, field);
    if (field == 'left') {
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('left', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'top') {
        var ab = el.parents('.t396__artboard');
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('top', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'width') {
        value = t396_elem__getWidth(el, value);
        el.css('width', parseFloat(value).toFixed(1) + 'px');
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            var pinSvgIcon = el.find('.tn-atom__pin-icon');
            if (pinSvgIcon.length > 0) {
                var pinSize = parseFloat(value).toFixed(1) + 'px';
                pinSvgIcon.css({'width': pinSize, 'height': pinSize})
            }
            el.css('height', parseInt(value).toFixed(1) + 'px')
        }
        if (eltype == 'gallery') {
            var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');
            var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');
            if (borderStyle == 'none' || typeof borderStyle == 'undefined' || typeof borderWidth == 'undefined' || borderWidth == '') borderWidth = 0;
            value = value * 1 - borderWidth * 2;
            el.css('width', parseFloat(value).toFixed(1) + 'px');
            el.find('.t-slds__main').css('width', parseFloat(value).toFixed(1) + 'px');
            el.find('.tn-atom__slds-img').css('width', parseFloat(value).toFixed(1) + 'px')
        }
    }
    if (field == 'height') {
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            return
        }
        value = t396_elem__getHeight(el, value);
        el.css('height', parseFloat(value).toFixed(1) + 'px');
        if (eltype === 'gallery') {
            var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');
            var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');
            if (borderStyle == 'none' || typeof borderStyle == 'undefined' || typeof borderWidth == 'undefined' || borderWidth == '') borderWidth = 0;
            value = value * 1 - borderWidth * 2;
            el.css('height', parseFloat(value).toFixed(1) + 'px');
            el.find('.tn-atom__slds-img').css('height', parseFloat(value).toFixed(1) + 'px');
            el.find('.t-slds__main').css('height', parseFloat(value).toFixed(1) + 'px')
        }
    }
    if (field == 'container') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'width' || field == 'height' || field == 'fontsize' || field == 'fontfamily' || field == 'letterspacing' || field == 'fontweight' || field == 'img') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'inputs') {
        value = el.find('.tn-atom__inputs-textarea').val();
        try {
            t_zeroForms__renderForm(el, value)
        } catch (err) {
        }
    }
}

function t396_elem__convertPosition__Local__toAbsolute(el, field, value) {
    var ab = el.parents('.t396__artboard');
    var blockVAlign = t396_ab__getFieldValue(ab, 'valign');
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isOnlyScalable = t396_isOnlyScalableBrowser();
    var isScaledElement = !isTildaModeEdit && isScaled && isOnlyScalable;
    var isZoomedElement = !isTildaModeEdit && isScaled && !isOnlyScalable;
    var el_axisy = t396_elem__getFieldValue(el, 'axisy');
    value = parseInt(value);
    if (field == 'left') {
        var el_container, offset_left, el_container_width, el_width;
        var container = t396_elem__getFieldValue(el, 'container');
        if (container === 'grid') {
            el_container = 'grid';
            offset_left = window.tn.grid_offset_left;
            el_container_width = window.tn.grid_width
        } else {
            el_container = 'window';
            offset_left = 0;
            el_container_width = window.tn.window_width
        }
        var el_leftunits = t396_elem__getFieldValue(el, 'leftunits');
        if (el_leftunits === '%') {
            value = t396_roundFloat(el_container_width * value / 100)
        }
        if (!isTildaModeEdit && isScaled) {
            if (container === 'grid' && isOnlyScalable) value = value * window.tn_scale_factor
        } else {
            value = offset_left + value
        }
        var el_axisx = t396_elem__getFieldValue(el, 'axisx');
        if (el_axisx === 'center') {
            el_width = t396_elem__getWidth(el);
            if (isScaledElement && el_container !== 'window') {
                el_container_width *= window.tn_scale_factor;
                el_width *= window.tn_scale_factor
            }
            value = el_container_width / 2 - el_width / 2 + value
        }
        if (el_axisx === 'right') {
            el_width = t396_elem__getWidth(el);
            if (isScaledElement && el_container !== 'window') {
                el_container_width *= window.tn_scale_factor;
                el_width *= window.tn_scale_factor
            }
            value = el_container_width - el_width + value
        }
    }
    if (field === 'top') {
        var el_container, offset_top, el_container_height, el_height;
        var ab = el.parent();
        var container = t396_elem__getFieldValue(el, 'container');
        if (container === 'grid') {
            el_container = 'grid';
            offset_top = parseFloat(ab.attr('data-artboard-proxy-min-offset-top'));
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-min-height'))
        } else {
            el_container = 'window';
            offset_top = 0;
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-max-height'))
        }
        var el_topunits = t396_elem__getFieldValue(el, 'topunits');
        if (el_topunits === '%') {
            value = (el_container_height * (value / 100))
        }
        if (isScaledElement && el_container !== 'window') {
            value *= window.tn_scale_factor
        }
        if (isZoomedElement && el_container !== 'window') {
            offset_top = blockVAlign === 'stretch' ? 0 : (offset_top / window.tn_scale_factor)
        }
        value = offset_top + value;
        var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
        var ab_min_height = t396_ab__getFieldValue(ab, 'height');
        var ab_max_height = t396_ab__getHeight(ab);
        if (isScaled && !isTildaModeEdit && ab_height_vh != '') {
            var scaledMinHeight = parseInt(ab_min_height, 10) * window.tn_scale_factor
        }
        if (el_axisy === 'center') {
            el_height = t396_elem__getHeight(el);
            if (el.attr('data-elem-type') === 'image') {
                el_width = t396_elem__getWidth(el);
                var fileWidth = t396_elem__getFieldValue(el, 'filewidth');
                var fileHeight = t396_elem__getFieldValue(el, 'fileheight');
                if (fileWidth && fileHeight) {
                    var ratio = parseInt(fileWidth) / parseInt(fileHeight);
                    el_height = el_width / ratio
                }
            }
            if (isScaledElement && el_container !== 'window') {
                if (blockVAlign !== 'stretch') {
                    el_container_height = el_container_height * window.tn_scale_factor
                } else {
                    if (scaledMinHeight) {
                        el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                    } else {
                        el_container_height = ab.height()
                    }
                }
                el_height *= window.tn_scale_factor
            }
            if (!isTildaModeEdit && isScaled && !isOnlyScalable && el_container !== 'window' && blockVAlign === 'stretch') {
                if (scaledMinHeight) {
                    el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                } else {
                    el_container_height = ab.height()
                }
                el_container_height = el_container_height / window.tn_scale_factor
            }
            value = el_container_height / 2 - el_height / 2 + value
        }
        if (el_axisy === 'bottom') {
            el_height = t396_elem__getHeight(el);
            if (el.attr('data-elem-type') === 'image') {
                el_width = t396_elem__getWidth(el);
                var fileWidth = t396_elem__getFieldValue(el, 'filewidth');
                var fileHeight = t396_elem__getFieldValue(el, 'fileheight');
                if (fileWidth && fileHeight) {
                    var ratio = parseInt(fileWidth) / parseInt(fileHeight);
                    el_height = el_width / ratio
                }
            }
            if (isScaledElement && el_container !== 'window') {
                if (blockVAlign !== 'stretch') {
                    el_container_height = el_container_height * window.tn_scale_factor
                } else {
                    if (scaledMinHeight) {
                        el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                    } else {
                        el_container_height = ab.height()
                    }
                }
                el_height *= window.tn_scale_factor
            }
            if (!isTildaModeEdit && isScaled && !isOnlyScalable && el_container !== 'window' && blockVAlign === 'stretch') {
                if (scaledMinHeight) {
                    el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                } else {
                    el_container_height = ab.height()
                }
                el_container_height = el_container_height / window.tn_scale_factor
            }
            value = el_container_height - el_height + value
        }
    }
    return (value)
}

function t396_ab__setFieldValue(ab, prop, val, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200) {
        ab.attr('data-artboard-' + prop + '-res-' + res, val)
    } else {
        ab.attr('data-artboard-' + prop, val)
    }
}

function t396_ab__getFieldValue(ab, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = ab.attr('data-artboard-' + prop + '-res-960');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '')
            }
        }
        if (res == 640) {
            r = ab.attr('data-artboard-' + prop + '-res-640');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-960');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '')
                }
            }
        }
        if (res == 480) {
            r = ab.attr('data-artboard-' + prop + '-res-480');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-640');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-960');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '')
                    }
                }
            }
        }
        if (res == 320) {
            r = ab.attr('data-artboard-' + prop + '-res-320');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-480');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-640');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '-res-960');
                        if (typeof r == 'undefined') {
                            r = ab.attr('data-artboard-' + prop + '')
                        }
                    }
                }
            }
        }
    } else {
        r = ab.attr('data-artboard-' + prop)
    }
    return (r)
}

function t396_ab__renderViewOneField(ab, field) {
    var value = t396_ab__getFieldValue(ab, field)
}

function t396_allelems__renderView(ab) {
    tn_console('func: allelems__renderView: abid:' + ab.attr('data-artboard-recid'));
    ab.find(".tn-elem").each(function () {
        t396_elem__renderView($(this))
    })
}

function t396_ab__filterUpdate(ab) {
    var filter = ab.find('.t396__filter');
    var c1 = filter.attr('data-filtercolor-rgb');
    var c2 = filter.attr('data-filtercolor2-rgb');
    var o1 = filter.attr('data-filteropacity');
    var o2 = filter.attr('data-filteropacity2');
    if ((typeof c2 == 'undefined' || c2 == '') && (typeof c1 != 'undefined' && c1 != '')) {
        filter.css("background-color", "rgba(" + c1 + "," + o1 + ")")
    } else if ((typeof c1 == 'undefined' || c1 == '') && (typeof c2 != 'undefined' && c2 != '')) {
        filter.css("background-color", "rgba(" + c2 + "," + o2 + ")")
    } else if (typeof c1 != 'undefined' && typeof c2 != 'undefined' && c1 != '' && c2 != '') {
        filter.css({background: "-webkit-gradient(linear, left top, left bottom, from(rgba(" + c1 + "," + o1 + ")), to(rgba(" + c2 + "," + o2 + ")) )"})
    } else {
        filter.css("background-color", 'transparent')
    }
}

function t396_ab__getHeight(ab, ab_height) {
    if (typeof ab_height == 'undefined') ab_height = t396_ab__getFieldValue(ab, 'height');
    ab_height = parseFloat(ab_height);
    var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
    if (ab_height_vh != '') {
        ab_height_vh = parseFloat(ab_height_vh);
        if (isNaN(ab_height_vh) === !1) {
            var ab_height_vh_px = parseFloat(window.tn.window_height * parseFloat(ab_height_vh / 100));
            if (ab_height < ab_height_vh_px) {
                ab_height = ab_height_vh_px
            }
        }
    }
    return (ab_height)
}

function t396_hex2rgb(hexStr) {
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b]
}

String.prototype.t396_replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement)
};

function t396_elem__getWidth(el, value) {
    if (typeof value == 'undefined') value = parseFloat(t396_elem__getFieldValue(el, 'width'));
    var el_widthunits = t396_elem__getFieldValue(el, 'widthunits');
    if (el_widthunits == '%') {
        var el_container = t396_elem__getFieldValue(el, 'container');
        if (el_container == 'window') {
            value = parseFloat(window.tn.window_width * parseFloat(parseInt(value) / 100))
        } else {
            value = parseFloat(window.tn.grid_width * parseFloat(parseInt(value) / 100))
        }
    }
    return (value)
}

function t396_elem__getHeight(el, value) {
    if (typeof value == 'undefined') value = t396_elem__getFieldValue(el, 'height');
    value = parseFloat(value);
    if (el.attr('data-elem-type') == 'shape' || el.attr('data-elem-type') == 'video' || el.attr('data-elem-type') == 'html' || el.attr('data-elem-type') == 'gallery') {
        var el_heightunits = t396_elem__getFieldValue(el, 'heightunits');
        if (el_heightunits == '%') {
            var ab = el.parent();
            var ab_min_height = parseFloat(ab.attr('data-artboard-proxy-min-height'));
            var ab_max_height = parseFloat(ab.attr('data-artboard-proxy-max-height'));
            var el_container = t396_elem__getFieldValue(el, 'container');
            if (el_container == 'window') {
                value = parseFloat(ab_max_height * parseFloat(value / 100))
            } else {
                value = parseFloat(ab_min_height * parseFloat(value / 100))
            }
        }
    } else if (el.attr('data-elem-type') == 'button') {
        value = value
    } else {
        value = parseFloat(el.innerHeight())
    }
    return (value)
}

function t396_roundFloat(n) {
    n = Math.round(n * 100) / 100;
    return (n)
}

function tn_console(str) {
    if (window.tn_comments == 1) console.log(str)
}

function t396_setUpTooltip_desktop(el, pinEl, tipEl) {
    var timer;
    pinEl.mouseover(function () {
        $('.tn-atom__tip_visible').each(function () {
            var thisTipEl = $(this).parents('.t396__elem');
            if (thisTipEl.attr('data-elem-id') != el.attr('data-elem-id')) {
                t396_hideTooltip(thisTipEl, $(this))
            }
        });
        clearTimeout(timer);
        if (tipEl.css('display') == 'block') {
            return
        }
        t396_showTooltip(el, tipEl)
    });
    pinEl.mouseout(function () {
        timer = setTimeout(function () {
            t396_hideTooltip(el, tipEl)
        }, 300)
    })
}

function t396_setUpTooltip_mobile(el, pinEl, tipEl) {
    pinEl.on('click', function (e) {
        if (tipEl.css('display') == 'block' && $(e.target).hasClass("tn-atom__pin")) {
            t396_hideTooltip(el, tipEl)
        } else {
            t396_showTooltip(el, tipEl)
        }
    });
    var id = el.attr("data-elem-id");
    $(document).click(function (e) {
        var isInsideTooltip = ($(e.target).hasClass("tn-atom__pin") || $(e.target).parents(".tn-atom__pin").length > 0);
        if (isInsideTooltip) {
            var clickedPinId = $(e.target).parents(".t396__elem").attr("data-elem-id");
            if (clickedPinId == id) {
                return
            }
        }
        t396_hideTooltip(el, tipEl)
    })
}

function t396_hideTooltip(el, tipEl) {
    tipEl.css('display', '');
    tipEl.css({"left": "", "transform": "", "right": ""});
    tipEl.removeClass('tn-atom__tip_visible');
    el.css('z-index', '')
}

function t396_showTooltip(el, tipEl) {
    var pos = el.attr("data-field-tipposition-value");
    if (typeof pos == 'undefined' || pos == '') {
        pos = 'top'
    }
    ;var elSize = el.height();
    var elTop = el.offset().top;
    var elBottom = elTop + elSize;
    var elLeft = el.offset().left;
    var elRight = el.offset().left + elSize;
    var winTop = $(window).scrollTop();
    var winWidth = $(window).width();
    var winBottom = winTop + $(window).height();
    var tipElHeight = tipEl.outerHeight();
    var tipElWidth = tipEl.outerWidth();
    var padd = 15;
    if (pos == 'right' || pos == 'left') {
        var tipElRight = elRight + padd + tipElWidth;
        var tipElLeft = elLeft - padd - tipElWidth;
        if ((pos == 'right' && tipElRight > winWidth) || (pos == 'left' && tipElLeft < 0)) {
            pos = 'top'
        }
    }
    if (pos == 'top' || pos == 'bottom') {
        var tipElRight = elRight + (tipElWidth / 2 - elSize / 2);
        var tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);
        if (tipElRight > winWidth) {
            var rightOffset = -(winWidth - elRight - padd);
            tipEl.css({"left": "auto", "transform": "none", "right": rightOffset + "px"})
        }
        if (tipElLeft < 0) {
            var leftOffset = -(elLeft - padd);
            tipEl.css({"left": leftOffset + "px", "transform": "none"})
        }
    }
    if (pos == 'top') {
        var tipElTop = elTop - padd - tipElHeight;
        var tipElBottom = elBottom + padd + tipElHeight;
        if (winBottom > tipElBottom && winTop > tipElTop) {
            pos = 'bottom'
        }
    }
    if (pos == 'bottom') {
        var tipElTop = elTop - padd - tipElHeight;
        var tipElBottom = elBottom + padd + tipElHeight;
        if (winBottom < tipElBottom && winTop < tipElTop) {
            pos = 'top'
        }
    }
    tipEl.attr('data-tip-pos', pos);
    tipEl.css('display', 'block');
    tipEl.addClass('tn-atom__tip_visible');
    el.css('z-index', '1000')
}

function t396_hex2rgba(hexStr, opacity) {
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b, parseFloat(opacity)]
}

function t456_setListMagin(recid, imglogo) {
    if ($(window).width() > 980) {
        var t456__menu = $('#rec' + recid + ' .t456');
        var t456__leftpart = t456__menu.find('.t456__leftwrapper');
        var t456__listpart = t456__menu.find('.t456__list');
        if (imglogo) {
            t456__listpart.css("margin-right", t456__leftpart.width())
        } else {
            t456__listpart.css("margin-right", t456__leftpart.width() + 30)
        }
    }
}

function t456_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t456__list_item a[href='" + url + "']").addClass("t-active");
    $(".t456__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t456__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t456__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t456__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t456__list_item a[href='/" + pathname + "/']").addClass("t-active")
}

function t456_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t456_navLinks = $("#rec" + recid + " .t456__list_item a:not(.tooltipstered)[href*='#']");
        if (t456_navLinks.length > 0) {
            t456_catchScroll(t456_navLinks)
        }
    }
}

function t456_catchScroll(t456_navLinks) {
    var t456_clickedSectionId = null, t456_sections = new Array(), t456_sectionIdTonavigationLink = [],
        t456_interval = 100, t456_lastCall, t456_timeoutId;
    t456_navLinks = $(t456_navLinks.get().reverse());
    t456_navLinks.each(function () {
        var t456_cursection = t456_getSectionByHref($(this));
        if (typeof t456_cursection !== "undefined") {
            if (typeof t456_cursection.attr("id") != "undefined") {
                t456_sections.push(t456_cursection)
            }
            t456_sectionIdTonavigationLink[t456_cursection.attr("id")] = $(this)
        }
    });
    t456_updateSectionsOffsets(t456_sections);
    t456_sections.sort(function (a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top")
    });
    $(window).bind('resize', t_throttle(function () {
        t456_updateSectionsOffsets(t456_sections)
    }, 200));
    $('.t456').bind('displayChanged', function () {
        t456_updateSectionsOffsets(t456_sections)
    });
    setInterval(function () {
        t456_updateSectionsOffsets(t456_sections)
    }, 5000);
    t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
    t456_navLinks.click(function () {
        var t456_clickedSection = t456_getSectionByHref($(this));
        if (typeof t456_clickedSection !== "undefined" && !$(this).hasClass("tooltipstered") && typeof t456_clickedSection.attr("id") != "undefined") {
            t456_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t456_clickedSectionId = t456_getSectionByHref($(this)).attr("id")
        }
    });
    $(window).scroll(function () {
        var t456_now = new Date().getTime();
        if (t456_lastCall && t456_now < (t456_lastCall + t456_interval)) {
            clearTimeout(t456_timeoutId);
            t456_timeoutId = setTimeout(function () {
                t456_lastCall = t456_now;
                t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId)
            }, t456_interval - (t456_now - t456_lastCall))
        } else {
            t456_lastCall = t456_now;
            t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId)
        }
    })
}

function t456_updateSectionsOffsets(sections) {
    $(sections).each(function () {
        var t456_curSection = $(this);
        t456_curSection.attr("data-offset-top", t456_curSection.offset().top)
    })
}

function t456_getSectionByHref(curlink) {
    var hash = curlink.attr("href").replace(/\s+/g, '').replace(/.*#/, '');
    var block = $(".r[id='" + hash + "']");
    var anchor = $(".r[data-record-type='215']").has("a[name='" + hash + "']");
    if (curlink.is('[href*="#rec"]')) {
        return block
    } else if (anchor.length === 1) {
        return anchor
    } else {
        return undefined
    }
}

function t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId) {
    var t456_scrollPosition = $(window).scrollTop(), t456_valueToReturn = t456_clickedSectionId;
    if (t456_sections.length != 0 && t456_clickedSectionId == null && t456_sections[t456_sections.length - 1].attr("data-offset-top") > (t456_scrollPosition + 300)) {
        t456_navLinks.removeClass('t-active');
        return null
    }
    $(t456_sections).each(function (e) {
        var t456_curSection = $(this), t456_sectionTop = t456_curSection.attr("data-offset-top"),
            t456_id = t456_curSection.attr('id'), t456_navLink = t456_sectionIdTonavigationLink[t456_id];
        if (((t456_scrollPosition + 300) >= t456_sectionTop) || (t456_sections[0].attr("id") == t456_id && t456_scrollPosition >= $(document).height() - $(window).height())) {
            if (t456_clickedSectionId == null && !t456_navLink.hasClass('t-active')) {
                t456_navLinks.removeClass('t-active');
                t456_navLink.addClass('t-active');
                t456_valueToReturn = null
            } else {
                if (t456_clickedSectionId != null && t456_id == t456_clickedSectionId) {
                    t456_valueToReturn = null
                }
            }
            return !1
        }
    });
    return t456_valueToReturn
}

function t456_setPath() {
}

function t456_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t456").each(function () {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t456").each(function () {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t456_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t456").each(function () {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        el.animate({"opacity": "1", "top": "0px"}, 200, function () {
                        })
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden")
                }
            }
        })
    }
}

function t456_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t456").each(function () {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t456_createMobileMenu(recid) {
    var window_width = $(window).width(), el = $("#rec" + recid), menu = el.find(".t456"),
        burger = el.find(".t456__mobile");
    burger.click(function (e) {
        menu.fadeToggle(300);
        $(this).toggleClass("t456_opened")
    });
    $(window).bind('resize', t_throttle(function () {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0)
        }
    }, 200))
}

function t698_fixcontentheight(id) {
    var el = $("#rec" + id);
    var hcover = el.find(".t-cover").height();
    var hcontent = el.find("div[data-hook-content]").outerHeight();
    if (hcontent > 300 && hcover < hcontent) {
        var hcontent = hcontent + 120;
        if (hcontent > 1000) {
            hcontent += 100
        }
        console.log('auto correct cover height: ' + hcontent);
        el.find(".t-cover").height(hcontent);
        el.find(".t-cover__filter").height(hcontent);
        el.find(".t-cover__carrier").height(hcontent);
        el.find(".t-cover__wrapper").height(hcontent);
        el.find(".t-cover__container").height(hcontent);
        if ($isMobile == !1) {
            setTimeout(function () {
                var divvideo = el.find(".t-cover__carrier");
                if (divvideo.find('iframe').length > 0) {
                    console.log('correct video from cover_fixcontentheight');
                    setWidthHeightYoutubeVideo(divvideo, hcontent + 'px')
                }
            }, 2000)
        }
    }
}

function t698_onSuccess(t698_form) {
    var t698_inputsWrapper = t698_form.find('.t-form__inputsbox');
    var t698_inputsHeight = t698_inputsWrapper.height();
    var t698_inputsOffset = t698_inputsWrapper.offset().top;
    var t698_inputsBottom = t698_inputsHeight + t698_inputsOffset;
    var t698_targetOffset = t698_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t698_target = t698_targetOffset - 200
    } else {
        var t698_target = t698_targetOffset - 100
    }
    if (t698_targetOffset > $(window).scrollTop() || ($(document).height() - t698_inputsBottom) < ($(window).height() - 100)) {
        t698_inputsWrapper.addClass('t698__inputsbox_hidden');
        setTimeout(function () {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({opacity: 0}, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({scrollTop: t698_target}, 400);
        setTimeout(function () {
            t698_inputsWrapper.addClass('t698__inputsbox_hidden')
        }, 400)
    }
    var successurl = t698_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function () {
            window.location.href = successurl
        }, 500)
    }
}

function t868_setHeight(recid) {
    var rec = $('#rec' + recid);
    var div = rec.find('.t868__video-carier');
    var height = div.width() * 0.5625;
    div.height(height);
    div.parent().height(height)
}

function t868_initPopup(recid) {
    var rec = $('#rec' + recid);
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup');
    var hook = el.attr('data-tooltip-hook');
    var analitics = el.attr('data-track-popup');
    var customCodeHTML = t868__readCustomCode(rec);
    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function (e) {
            t868_showPopup(recid, customCodeHTML);
            t868_resizePopup(recid);
            e.preventDefault();
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t868__readCustomCode(rec) {
    var customCode = rec.find('.t868 .t868__code-wrap').html();
    rec.find('.t868 .t868__code-wrap').remove();
    return customCode
}

function t868_showPopup(recid, customCodeHTML) {
    var rec = $('#rec' + recid);
    var popup = rec.find('.t-popup');
    var popupContainer = rec.find('.t-popup__container');
    popupContainer.append(customCodeHTML);
    popup.css('display', 'block');
    t868_setHeight(recid);
    setTimeout(function () {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed');
    rec.find('.t-popup').click(function (e) {
        var container;
        if (e.target) {
            container = e.target.closest('.t-popup__container')
        }
        if (!container) {
            t868_closePopup(recid)
        }
    });
    rec.find('.t-popup__close').click(function (e) {
        t868_closePopup(recid)
    });
    rec.find('a[href*="#"]').click(function (e) {
        var url = $(this).attr('href');
        if (url.indexOf('#order') != -1) {
            var popupContainer = rec.find('.t-popup__container');
            setTimeout(function () {
                popupContainer.empty()
            }, 600)
        }
        if (!url || url.substring(0, 7) != '#price:') {
            t868_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function () {
                    $('body').addClass('t-body_popupshowed')
                }, 300)
            }
        }
    });
    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t868_closePopup(recid)
        }
    })
}

function t868_closePopup(recid) {
    var rec = $('#rec' + recid);
    var popup = rec.find('.t-popup');
    var popupContainer = rec.find('.t-popup__container');
    $('body').removeClass('t-body_popupshowed');
    $('#rec' + recid + ' .t-popup').removeClass('t-popup_show');
    popupContainer.empty();
    setTimeout(function () {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t868_resizePopup(recid) {
    var rec = $('#rec' + recid);
    var div = rec.find('.t-popup__container').height();
    var win = $(window).height();
    var popup = rec.find('.t-popup__container');
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t868_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (ga) {
        if (window.mainTracker != 'tilda') {
            ga('send', {'hitType': 'pageview', 'page': virtPage, 'title': virtTitle})
        }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
        window[window.mainMetrika].hit(virtPage, {title: virtTitle, referer: window.location.href})
    }
}