(function($) {

    /*
     * 将URL装换成QUERY对象
     * 例如 var querystr = $.query("http://www.demo.com/a/b/c?arg0=value0&arg1=value1");
     *
     * querystr["protocol"] = "http"
     * querystr["host"] = "www.demo.com"
     * querystr["path"] = "a/b/c"
     * querystr["arg0"] = "value0"
     * querystr["arg1"] = "value1"
     */
    $.query = function(url) {

        var u = url.split("?");

        var res = {};
        var _proStartPos = u[0].indexOf("//:");
        res["_protocol"] = u[0].substring(0, _proStartPos);

        var _urlWithoutProtocol = u[0].substring(_proStartPos+3);
        var _firstPathPos = _urlWithoutProtocol.indexOf("/")
        res["_path"] = _urlWithoutProtocol.substring(_firstPathPos+1);
        res["_host"] = _urlWithoutProtocol.substring(0, _firstPathPos);

        if (u.length > 1) {
            var q = u[1];
            if (q) {
                var qs = q.split("&");
                var len = qs.length;
                for (var i=0; i<len; i++) {
                    var arg = qs[i].split("=");
                    res[arg[0]] = arg[1];
                }
            }
        }

        return res;
    }
    
    /**
     * 从制定name的meta中获取值
     * 一般用在详情弹窗中，用于接收从其他页面传递过来的值
     */
    $.getMetaValueForName = function(name) {
        var meta = $("meta[name='wk-"+name+"']");
        var content = $(meta).attr("content");
        if ($(meta).attr("isJson")) {
            return $.parseJSON(content);
        } else {
            return content;
        }
    }

    /*
     * 判断对象是否是数组
     */
    $.isArray = function(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }


    /**
     * 详情窗口
     * @param data 在窗口中显示的数据对象
     */
    $.detialwindow = function(data) {
        var _data = data;
        var _templateName;
        var _placeholder = $('<div />').addClass("wk-window-placeholder");
        var _wkBody = $("#wk-main").find("#wk-body");
        $(_placeholder).insertBefore(_wkBody);

        var WINDOW_WIDTH = 640;
        var WINDOW_HEIGHT = 580;

        var _ww = $(window).width();
        var _wh = $(window).height();

        var getCenterPoint = function(size) {
            var _cx = size.width / 2;
            var _cy = size.height / 2;

            return {
                x:_cx
                , y:_cy
            };
        };

        var getTopAndLeft = function(point) {
            var _left = point.x - WINDOW_WIDTH / 2;
            if (_left < 0) {
                _left = 0;
            }
            var _top = point.y - WINDOW_HEIGHT / 2;
            if (_top < 0) {
                _top = 0;
            }

            return {
                top : _top
                , left: _left
            };
        };

        var _centerPointer = getCenterPoint({width: _ww, height: _wh});
        var _topAndLeft = getTopAndLeft(_centerPointer);


        var _window = $('<div />').addClass("wk-window");
        $(_window).css({
            width: WINDOW_WIDTH + "px"
            , height: WINDOW_HEIGHT + "px"
            , position: "absolute"
            , top: _wh + "px"
            , left: _topAndLeft.left + "px"
            , background: "white"
            , display: "none"
        });

        var _windowContent = $('<div />').addClass("wk-window-content");
        $(_windowContent).css({
            width: WINDOW_WIDTH + "px"
            , height: WINDOW_HEIGHT + "px"
            , position: "relative"
            , top: "0px"
            , left: "0px"
        });

        var _btnClose = $('<img />')
            .attr({
                src: "./res/drawables/wk_window_btn_close.jpg"});
        $(_btnClose).css({
            width : "48px"
            , height : "48px"
            , position: "absolute"
            , top: "10px"
            , left: (WINDOW_WIDTH - 2) + "px"
        });

        var _wrapper = $('<div />').addClass("wk-window-wrapper");
        $(_wrapper).css({
            width: WINDOW_WIDTH + "px"
            , height: WINDOW_HEIGHT + "px"
            , position: "absolute"
            , top: "0px"
            , left: "0px"
        });

        $(_window).append(_windowContent);
        $(_windowContent).append(_btnClose);
        $(_windowContent).append(_wrapper);

        var _mask = $('<div />').addClass("wk-window-mask");
        $(_mask).css({
            width: _ww + "px"
            , height: _wh + "px"
            , position: "absolute"
            , top: "0px"
            , left: "0px"
            , display: "none"
        });
        $(_placeholder).append(_mask);
        $(_placeholder).append(_window);

        var _windowObject = {
            /**
             * 更新窗口的位置
             * 一般用在调整浏览看大小的时候
             */
            update : function() {

                var _newWw = $(window).width();
                var _newWh = $(window).height();

                var _newCenterPointer = getCenterPoint({width: _newWw, height: _newWh});
                var _newTopAndLeft = getTopAndLeft(_newCenterPointer);

                $(_placeholder).find(".wk-window").css({
                    width: WINDOW_WIDTH + "px"
                    , height: WINDOW_HEIGHT + "px"
                    , position: "absolute"
                    , top: _newTopAndLeft.top + "px"
                    , left: _newTopAndLeft.left + "px"
                    , background: "white"
                });

                $(_placeholder).find(".wk-window-mask").css({
                    width: _newWw + "px"
                    , height: _newWh + "px"
                    , position: "absolute"
                    , top: "0px"
                    , left: "0px"
                });
            }

            /**
             * 设置窗口内容的模板文件
             * @param tn 模板文件名
             * @returns {_windowObject}
             */
            , templateName : function(tn) {
                _templateName = tn;
                return this;
            }

            /**
             * 关闭窗口
             */
            , dismiss : function() {
                $(_mask).fadeOut(300);
                $(_window).animate({
                    opacity: "hide"
                }, 500, function() {
                    $(_placeholder).remove();
                });
            }

            /**
             * 显示窗口
             */
            , show : function() {
                $(_mask).fadeIn(500);
                $(_window).animate({
                    opacity: "show"
                    , top: _topAndLeft.top + "px"
                }, 500, function() {
                    $(_window).css({
                        width: WINDOW_WIDTH + "px"
                        , height: WINDOW_HEIGHT + "px"
                        , position: "absolute"
                        , top: _topAndLeft.top + "px"
                        , left: _topAndLeft.left + "px"
                        , background: "white"
                    });

                    if (_templateName) {
                        $.ajax({
                            url: _templateName
                            , success:function(d) {
                                var template = $(d);

                                for (var k in _data) {
                                    var content = _data[k];
                                    var attr = {
                                        content: content
                                        , name: "wk-" + k
                                    };
                                    if (typeof(content) === "object") {
                                        content = JSON.stringify(_data[k]);
                                        attr.content = content;
                                        attr.isJson = true;
                                    }
                                    var metaTitle = $("<meta />").attr(attr);
                                    $(template).append(metaTitle);
                                }

                                $(_windowContent).find(".wk-window-wrapper").html(template);

                            }
                        })
                    }
                });
            }
        }

        $(_mask).on("click", function(e) {
            _windowObject.dismiss();
        });

        $(_btnClose).on("click", function(e) {
            _windowObject.dismiss();
        })

        $(window).resize(function(e) {
            _windowObject.update();
        });

        return _windowObject;

    }

    /*
     * 将标签包装成footer样式
     */
    $.fn.footer = function(items) {
        var _ul = $('<ul />');
        if (items && items.length) {
            var n = items.length;
            for (var i = 0; i < n; i++) {
                var _li = $('<li />');
                var href = items[i].href;
                if (href.lastIndexOf(".") < 0) {
                    href += "." + Weikan.config.defpostfix;
                }
                var _a = $('<a />').attr({
                    "target" : "_self"
                    , "href" : href
                }).text(items[i].title);

                $(_li).append(_a);
                $(_ul).append(_li);
            }
        }
        $(this).append(_ul);
    }

    /*
     * 将标签包装成导航栏
     * param items      按钮项集合   必须
     * param current    高亮的位置   可选
     * param callback   事件回调    可选
     *
     */
    $.fn.navigationbar = function() {
        var args = arguments;
        var _items = null;
        var _current = -1;
        var _callback;
        if (args && args.length) {
            if ($.isArray(args[0])) {
                _items = args[0];
            }

            if (args.length > 1) {
                if ($.isArray(args[0])) {
                    _items = args[0];
                }
                if (typeof(args[1]) === "number") {
                    _current = parseInt(args[1]);
                } else if (typeof(args[1]) === "function") {
                    _callback = args[1];
                }
            }

            if (args.length > 2 && !_callback && typeof(args[2]) === "function") {
                _callback = args[2];
            }
        }
        var _ul = $('<ul />');
        if (_items && _items.length) {
            var n = _items.length;
            for (var i = 0; i < n; i++) {
                var _li = $('<li />').attr({"class": "wk-navitem"});
                $(_li).width(_items[i].width + "px");
                if (i === _current) {
                    $(_li).addClass("current");
                }
                _li[0].navitem = _items[i];
                var href = _items[i].href;
                if (href.lastIndexOf(".") < 0) {
                    href += "." + Weikan.config.defpostfix;
                }
                var _a = $('<a />').attr({
                    "target" : "_self"
                    , "href" : href
                }).text(_items[i].title);

                if (_items[i].subitems && _items[i].subitems.length) {
                    var _subul = $('<ul />').addClass("wk-navbar-subitems");
                    $(_subul).css({
                        "position": "absolute"
                        , "top": "8px"
                        , "left": _items[i].width + "px"
                        , "display": "none"});

                    var _subitems = _items[i].subitems;
                    var _subLength = _subitems.length;

                    for (var j = 0; j < _subLength; j++) {
                        var _subli = $('<li />');
                        var _suba = $('<a />');
                        var _subhref = _subitems[j].href;
                        if (_subhref.lastIndexOf(".") < 0) {
                            _subhref += "." + Weikan.config.defpostfix
                        }
                        $(_suba).text(_subitems[j].title).attr({"href": _subhref});

                        $(_subli).on("mouseenter mouseleave", function(e) {
                            var _eventType = e.type;
                            if (_eventType === "mouseenter") {
                                $(this).addClass("current");
                            } else if (_eventType === "mouseleave") {
                                $(this).removeClass("current");
                            }
                        });

                        $(_subli).append(_suba);
                        $(_subul).append(_subli);
                    }

                    $(_li).append(_subul);
                }

                $(_li).on("mouseenter mouseleave", function(e) {
                    var _eventType = e.type;
                    if (_eventType === "mouseenter") {
                        if (!$(this).hasClass("current")) {
                            $(this).addClass("current");
                            var _subitems = $(this).find(".wk-navbar-subitems");
                            $(_subitems).css({
                                "position": "absolute"
                                , "top": "8px"
                                , "left": this.width + "px"
                                , "display": "block"});

                        }
                    } else if (_eventType === "mouseleave") {
                        $(this).removeClass("current");
                        var _subitems = $(this).find(".wk-navbar-subitems");
                        $(_subitems).css({
                            "position": "absolute"
                            , "top": "8px"
                            , "left": this.width + "px"
                            , "display": "none"});
                    }
                });

                $(_li).append(_a);
                $(_ul).append(_li);
            }
        }
        $(this).append(_ul);

    }

    /*
     * 将标签包装成标题栏样式
     */
    $.fn.titlebar = function() {
        var LEFT_WIDTH = 18;
        var RIGHT_WIDTH = 15;

        var _title;
        if (arguments && arguments.length && typeof(arguments[0]) === "string") {
            _title = arguments[0];
        }

        var _self = $(this);
        var _render = $(_self).hasClass("wk-titlebar");

        if (!_render) {
            var _self = $(_self).addClass("wk-titlebar");
            if (!_title) {
                if ($(_self).attr("title")) {
                    _title = $(_self).attr("title");
                }
            }
            var _attrWidth = $(_self).attr("wk-width");
            var _width;
            if (_attrWidth) {
                if (_attrWidth === "match_parent") {
                    _width = $(_self).width();
                } else {
                    var w = parseInt(_attrWidth);
                    if (!isNaN(w) && w > 0) {
                        _width = w;
                    }
                }
            }

            var _mw = _width - LEFT_WIDTH - RIGHT_WIDTH;

            var _left = $('<div />').addClass("wk-titlebar-left");
            var _middle = $('<div />').addClass("wk-titlebar-middle");
            var _right = $('<div />').addClass("wk-titlebar-right");
            var _text = $('<span />');
            $(_text).text(_title);
            $(_middle).append(_text);
            if (_mw > 0) {
                $(_middle).width(_mw);
            }
            $(_self).append(_left).append(_middle).append(_right).append($('<div />').attr("class", "wk-clear"));
        } else {
            var _middle = $(".wk-titlebar-middle");
            var _attrWidth = $(_self).attr("wk-width");
            var _width;
            if (_attrWidth) {
                if (_attrWidth === "match_parent") {
                    _width = $(_self).width();
                } else {
                    var w = parseInt(_attrWidth);
                    if (!isNaN(w) && w > 0) {
                        _width = w;
                    }
                }
            }
            $(_middle).width(_width - LEFT_WIDTH - RIGHT_WIDTH);
        }

        return {
            title : function() {
                if (arguments && arguments.length && typeof(arguments[0]) === "string") {
                    $(_self).find(".wk-titlebar-middle span").text(arguments[0]);
                } else {
                    return $(_self).find(".wk-titlebar-middle span").text()
                }
            },
            width : function() {
                if (arguments && arguments.length && arguments[0]) {
                    $(_self).find(".wk-titlebar-middle").width(arguments[0] - LEFT_WIDTH - RIGHT_WIDTH);
                } else {
                    return $(_self).find(".wk-titlebar-middle").width()
                }
            }
        };
    }


})(jQuery);

Weikan = function() {

    this.clearDiv = function() {
        return $('<div />').attr("class", "wk-clear");
    }
}

/**
 * 默认配置项
 * @type {
 *      {
 *          title: string,          网站标题
 *          height: string,         页面高度
 *          root: string,           默认的根路径
 *          defpostfix: string,     默认的后缀
 *          body: {
 *              minHeight: number,  内容区域的最小高度
 *              minWidth: number    内容区域的最小宽度
 *          },
 *          navbar: {
 *              weight: number,     导航栏占页面的比例
 *              minWidth: number,   导航栏的最小宽度
 *              items: Array        导航栏
 *          },
 *          footerbar: {
 *              height: number,     footer的高度
 *              items: Array        footer链接项
 *          },
 *          organization: string    单位名称
 *      }
 * }
 */
Weikan.config = {
    title : "威侃"
    , height : "match-parent"
    , root : "."
    , defpostfix : "html"
    , body : {
        minHeight : 600
        , minWidth : 900
    }
    , navbar : {
        weight : 0.3
        , minWidth: 300
        , items:[
            {
                title: "首页"
                , href: "index"
                , width: 54
            }
            , {
                title: "防水雾气产品"
                , href: "index"
                , width: 108

            }
            , {
                title: "电子制造"
                , href: "index"
                , width: 88
                , subitems: [
                    {title:"高品质标签", href: "#"}
                    , {title:"丝网印刷标签", href: "#"}
                    , {title:"精密膜切加工", href: "#"}
                    , {title:"打印系统及软件", href: "#"}
                    , {title:"包装设计", href: "#"}
                    , {title:"VMI包装解决方案", href: "#"}
                    , {title:"包装产品", href: "#"}
                    , {title:"内包装辅料", href: "#"}
                    , {title:"包装附件", href: "#"}
                ]
            }
            , {
                title: "MRO"
                , href: "index"
                , width: 60
                , subitems: [
                    {title:"GT 1000", href: "#"}
                    , {title:"GT 2000", href: "#"}
                    , {title:"GT 2010", href: "#"}
                    , {title:"XT2000", href: "#"}
                    , {title:"DT4200", href: "#"}
                ]
            }
        ]
    }
    , footerbar : {
        height : 27
        , items:[
                {title: "网站地图", href: "map"}
                , {title: "客户服务", href: "service"}
                , {title: "关于威侃", href: "about"}
                , {title: "工作机会", href: "jd"}
                , {title: "联系我们", href: "contacts"}
                , {title: "免责声明", href: "exceptions"}
            ]
        }

    , organization : "上海威侃电子材料有限公司"

};

/**
 * 加载CSS样式
 * @returns {Weikan}
 */
Weikan.prototype.css = function() {
    var args = arguments;
    if (args && args.length) {
        var _head = $("head").get(0);
        var n = args.length;
        for (var i = 0; i < n; i++) {
            var arg = args[i];
            if (typeof(arg) === "string") {
                var _link = $('<link />').attr({
                    type : "text/css",
                    href : "./res/css/" + arg + ".css",
                    rel : "stylesheet"
                });
                $(_head).append(_link);
            }
        }
    }

    return this;
}

/**
 * 加载JS
 * @returns {Weikan}
 */
Weikan.prototype.js = function() {
    var args = arguments;
    if (args && args.length) {
        var _head = $("head").get(0);
        var n = args.length;
        for (var i = 0; i < n; i++) {
            var arg = args[i];
            if (typeof(arg) === "string") {
                var _script = $('<script />').attr({
                    type : "text/javascript",
                    href : "./res/js/" + arg + ".js"
                });
                $(_head).append(_script);
            }
        }
    }

    return this;
}

Weikan.prototype.height = function() {
    var args = arguments;
    if (args && args.length) {
        var arg = args[0];
        Weikan.config.height = arg;
        return this;
    } else {
        return $(window).height();
    }

}

Weikan.prototype.run = function() {
    var title = Weikan.config.title;
    var url = window.location.href;
    var querystr = $.query(url);
    if (arguments && arguments.length) {
        var arg = arguments[0];
        if (arg.title) {
            title = arg.title;
        }
    } else {
        if (querystr["pagetitle"]) {
            title = decodeURI(querystr["pagetitle"]);
        }
    }
    document.title = title;

    var wkMain = $("#wk-main");
    var wkBody = $(wkMain).find("#wk-body");
    var wkNavbar = $('<div />').attr({id:"wk-navbar"});
    $(wkNavbar).insertBefore(wkBody);
    var wkFooter = $('<div />').attr({id:"wk-footer"});
    $(wkMain).append(wkFooter);
    $(this.clearDiv()).insertAfter(wkBody);

    var initRects = function() {
        var footerHeight = parseInt(Weikan.config.footerbar.height);
        var bodyConfig = Weikan.config.body;
        var navbarConfig = Weikan.config.navbar;
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var minBodyWidth = parseInt(bodyConfig.minWidth);
        var minBodyHeight = parseInt(bodyConfig.minHeight);
        var navbarWeight = parseFloat(navbarConfig.weight);
        var minNavbarWidth = parseInt(navbarConfig.minWidth);
        var navbarWidth = windowWidth * navbarWeight;
        var bodyWidth = parseInt(windowWidth - navbarWidth);
        if (bodyWidth < minBodyWidth) {
            bodyWidth = minBodyWidth;
            var mainWidth = bodyWidth / (1 - navbarWeight);
            navbarWidth = mainWidth - bodyWidth;
        }

        if (navbarWeight < minNavbarWidth) {
            navbarWidth = minNavbarWidth;
            bodyWidth =  windowWidth - navbarWidth;
        }

        if (bodyWidth < minBodyWidth) {
            bodyWidth = minBodyWidth;
        }

        var bodyHeight = windowHeight - footerHeight;
        if (bodyHeight < minBodyHeight) {
            bodyHeight = minBodyHeight;
        }
        var body = $("#wk-body");
        $(body).width(bodyWidth).height(bodyHeight);
        var navbar = $("#wk-navbar");
        navbar.width(navbarWidth).height(bodyHeight);
        $("#wk-main").width(navbarWidth + bodyWidth);
    }

    initRects();

    var _navbarItems = $('<div />').attr("id", "wk-navbar-items");
    var _currentIndex = -1;
    if (querystr["index"]) {
        _currentIndex = parseInt(querystr["index"]);
    }

    var _navItemCallback = function(i, item) {
        window.location.href = item.navitem.href + "." + Weikan.config.defpostfix;
    }
    if (_currentIndex >= 0) {
        $(_navbarItems).navigationbar(Weikan.config.navbar.items, _navItemCallback);
    } else {
        $(_navbarItems).navigationbar(Weikan.config.navbar.items, _currentIndex, _navItemCallback);
    }

    $("#wk-navbar").append(_navbarItems);

    var _footerItems = $('<div />').attr("id", "wk-footer-items");
    var _copyright = $('<div />').attr("id", "wk-footer-copyright");
    $(_copyright).text("版权所有:" + Weikan.config.organization);
    $("#wk-footer").append(_footerItems).append(_copyright).append(this.clearDiv());

    $(_footerItems).footer(Weikan.config.footerbar.items);

    $("div[wk-widget='titlebar']").each(function(i, item) {
        $(item).titlebar();
    });

    $("div[wk-widget='window']").click(function(e) {

    });

    $(window).resize(function(e) {
        initRects();

        $("div[wk-widget='titlebar']").each(function(i, item) {
            $(item).titlebar();
        });
    });

}
