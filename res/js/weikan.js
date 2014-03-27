(function($) {
    $.query = function(url) {

        var u = url.split("?");

        var res = {};
        res["path"] = u[0];
        res["host"] = u[0].substring(0, u[0].lastIndexOf("/"));

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

    $.isArray = function(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }

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

                $(_li).on("click", function(e) {
                    var _this = this;
                    $(".wk-navitem").each(function(i, item) {
                        if (_this === item) {
                            if (!$(item).hasClass("current")) {
                                $(item).addClass("current");
                            }
                            if (_callback) {
                                _callback(i, item);
                            }
                        } else if ($(item).hasClass("current")) {
                            $(item).removeClass("current");
                        }
                    });
                    e.preventDefault();
                });

                $(_li).append(_a);
                $(_ul).append(_li);
            }
        }
        $(this).append(_ul);

    }
})(jQuery);

Weikan = function() {

    this.clearDiv = function() {
        return $('<div />').attr("class", "wk-clear");
    }
}

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
            {title: "首页", href: "index", width: 54}
            , {title: "防水雾气产品", href: "#", width: 108}
            , {title: "电子制造", href: "#", width: 88}
            , {title: "MRO", href: "#", width: 60}
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

    $(window).resize(function(e) {
        initRects();
    });

}