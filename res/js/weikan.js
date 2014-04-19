(function($) {

    /**
     * 将URL装换成QUERY对象
     * @param url 地址
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

    $.getMetaValueForName = function(name) {
        var meta = $("meta[name='wk-"+name+"']");
        var content = $(meta).attr("content");
        if ($(meta).attr("isJson")) {
            return $.parseJSON(content);
        } else {
            return content;
        }
    }

    /**
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
        var _self = this;
        var _data = data;
        var _token;
        var _templateName;
        var _onLoadCallback;
        var _placeholder = $('<div />').addClass("wk-window-placeholder");
        var _wkBody = $("#wk-main").find(".wk-header");
        $(_placeholder).insertBefore(_wkBody);

        var WINDOW_WIDTH = 860;
        var WINDOW_HEIGHT = 700;

        var _ww = $(window).width();
        var _wh = $(window).height();

        var getCenterPoint = function(size) {
            var _cx = size.width / 2;
            var _cy = size.height / 2;

            return {
                x   :_cx
                , y :_cy
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
                top     : _top + $(window).scrollTop()
                , left  : _left
            };
        };

        var _centerPointer = getCenterPoint({width: _ww, height: _wh});
        var _topAndLeft = getTopAndLeft(_centerPointer);


        var _window = $('<div />').addClass("wk-window");
        $(_window).css({
            width: WINDOW_WIDTH + "px"
            , height                : WINDOW_HEIGHT + "px"
            , position              : "absolute"
            , top                   : _wh + "px"
            , left                  : _topAndLeft.left + "px"
            , background            : "white"
            , display               : "none"
            , zIndex                : "9999"
            , border                : "none"
            , mozBorderRadius       : "3px"
            , webkitBorderRadius    : "3px"
            , borderRadius          : "3px"
        });

        var _windowContent = $('<div />').addClass("wk-window-content");
        $(_windowContent).css({
            width       : WINDOW_WIDTH + "px"
            , height    : WINDOW_HEIGHT + "px"
            , position  : "relative"
            , top       : "0px"
            , left      : "0px"
        });

        var _btnClose = $('<img />')
            .attr({
                src: "./res/drawables/wk_window_btn_close.jpg"});
        $(_btnClose).css({
            width       : "48px"
            , height    : "48px"
            , position  : "absolute"
            , top       : "10px"
            , left      : (WINDOW_WIDTH - 2) + "px"
        });

        var _wrapper = $('<div />').addClass("wk-window-wrapper");
        $(_wrapper).css({
            width       : WINDOW_WIDTH + "px"
            , height    : WINDOW_HEIGHT + "px"
            , position  : "absolute"
            , top       : "0px"
            , left      : "0px"
        });

        $(_window).append(_windowContent);
        $(_windowContent).append(_btnClose);
        $(_windowContent).append(_wrapper);

        var _mask = $('<div />').addClass("wk-window-mask");
        $(_mask).css({
            width       : _ww + "px"
            , height    : _wh + "px"
            , position  : "absolute"
            , top       : $(window).scrollTop() + "px"
            , left      : "0px"
            , display   : "none"
            , zIndex    : "9998"
        });
        $(_placeholder).append(_mask);
        $(_placeholder).append(_window);

        var _windowObject = {

            _template : null
            /**
             * 更新窗口的位置
             * 一般用在调整浏览看大小的时候
             */
            , update : function() {

                var _newWw = $(window).width();
                var _newWh = $(window).height();

                var _newCenterPointer = getCenterPoint({width: _newWw, height: _newWh});
                var _newTopAndLeft = getTopAndLeft(_newCenterPointer);

                $(_placeholder).find(".wk-window").css({
                    width       : WINDOW_WIDTH + "px"
                    , height    : WINDOW_HEIGHT + "px"
                    , position  : "absolute"
                    , top       : _newTopAndLeft.top + "px"
                    , left      : _newTopAndLeft.left + "px"
                    , background: "white"
                    , zIndex    : "9999"
                });

                $(_placeholder).find(".wk-window-mask").css({
                    width       : _newWw + "px"
                    , height    : _newWh + "px"
                    , position  : "absolute"
                    , top       : $(window).scrollTop() + "px"
                    , left      : "0px"
                    , zIndex    : "9998"
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

            , onLoad : function(callback) {
                if (typeof callback === "function") {
                    _onLoadCallback = callback;
                }

                return this;
            }

            , token : function() {
                if (arguments && arguments.length) {
                    _token = arguments[0];
                    return this;
                } else {
                    return _token;
                }
            }

            , setImage : function(imagePath) {
                if (_template) {
                    $(_template).find("#wk-window-header-image").attr({
                        "src" : imagePath
                    })
                }
                return this;
            }

            , setTitle : function(title) {
                if (_template) {
                    $(_template).find("#wk-window-title-text").text(title);
                }
                return this;
            }

            , addParagraph : function(p) {
                if (_template) {
                    $(_template).find("#wk-window-content")
                        .append(
                            $('<p />').addClass("wk-window-content-paragraph")
                                .text(p));
                }
                return this;
            }

            , addList : function(list) {
                if (_template) {
                    if ($.isArray(list) && list.length) {
                        var _n = list.length;
                        var _ul = $('<ul />').addClass("wk-window-content-list");
                        for (var i = 0; i < _n; i++) {
                            var _li = $('<li />');
                            $(_li).append($('<span />').addClass("wk-list-order").text((i + 1) + "、"));
                            $(_li).append($('<span />').text(list[i]));
                            $(_ul).append(_li);
                        }

                        $(_template).find("#wk-window-content").append(_ul);
                    }
                }
                return;
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
                        width       : WINDOW_WIDTH + "px"
                        , height    : WINDOW_HEIGHT + "px"
                        , position  : "absolute"
                        , top       : _topAndLeft.top + "px"
                        , left      : _topAndLeft.left + "px"
                        , background: "white"
                    });

                    if (_templateName) {
                        $.ajax({
                            url: _templateName
                            , success:function(d) {
                                _template = $(d);

//                                for (var k in _data) {
//                                    var content = _data[k];
//                                    var attr = {
//                                        content: content
//                                        , name: "wk-" + k
//                                    };
//                                    if (typeof(content) === "object") {
//                                        content = JSON.stringify(_data[k]);
//                                        attr.content = content;
//                                        attr.isJson = true;
//                                    }
//                                    var metaTitle = $("<meta />").attr(attr);
//                                    $(template).append(metaTitle);
//                                }

                                if (_onLoadCallback) {
                                    _onLoadCallback.apply(_self, [_token, _windowObject, _template]);
                                }

                                $(_windowContent).find(".wk-window-wrapper").html(_template);

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

        $(window).scroll(function(e) {
            _windowObject.update();
        });

        return _windowObject;

    }

    /**
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
                    target  : "_self"
                    , href  : href
                }).text(items[i].title);

                $(_li).append(_a);
                $(_ul).append(_li);
            }
        }
        $(this).append(_ul);
    }

    /**
     * 将标签包装成导航栏
     * @param items      按钮项集合   必须
     * @param current    高亮的位置   可选
     * @param callback   事件回调    可选
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
                var _li = $('<li />').addClass("wk-navitem");
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
                    var _offset = 0;
                    if (_items[i].positionoffset) {
                        _offset = _items[i].positionoffset;
                    }
                    $(_subul).css({
                        "position"  : "absolute"
                        , "top"     : "8px"
                        , "left"    : _items[i].width + "px"
                        , "display" : "none"});

                    var _subitems = _items[i].subitems;
                    var _subLength = _subitems.length;

                    for (var j = 0; j < _subLength; j++) {
                        var _subli = $('<li />');
                        var _suba = $('<a />').css({
                            paddingLeft : _offset + "px"
                        });
                        var _subhref = _subitems[j].href;
                        $(_suba).text(_subitems[j].title)
                            .addClass("wk-responer")
                            .attr({
                                "wk-uri" : _subhref
                            });

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
                        }
                        var _subitems = $(this).find(".wk-navbar-subitems");
                        $(_subitems).css({
                            "position"  : "absolute"
                            , "top"     : "8px"
                            , "left"    : this.width + "px"
                            , "display" : "block"});

                    } else if (_eventType === "mouseleave") {
                        var _this = this;
                        var _index = -1;
                        $(".wk-navitem").each(function(index, item) {
                            if (_this == item) {
                                _index = index;
                                return false;
                            }
                        });
                        if (_index != _current) {
                            $(this).removeClass("current");
                        }

                        var _subitems = $(this).find(".wk-navbar-subitems");
                        $(_subitems).css({
                            "position"  : "absolute"
                            , "top"     : "8px"
                            , "left"    : this.width + "px"
                            , "display" : "none"});
                    }
                });

                $(_li).append(_a);
                $(_ul).append(_li);
            }
        }
        $(this).append(_ul);

    }

    /**
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
            } else {
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

    /**
     * 将指定标签渲染成搜索栏
     * @param callback 搜索事件回调，回调参数返回当前输入的关键字
     */
    $.fn.searchbar = function() {
        var _self = this;
        var _currentValue = null;
        var BUTTON_SIZE = {
            width   : 21
            , height: 21
        };
        var INPUT_SIZE = {
            width   : 172
            , height: 21
        };
        var _callback;

        if (arguments && arguments.length && typeof(arguments[0]) === "function") {
            _callback = arguments[0];
        }

        $(_self).width(INPUT_SIZE.width + BUTTON_SIZE.width + 2);

        var _input = $("<input />")
            .attr({
                type : "text"
            }).css({
                border  : "none"
                , float : "left"
                , fontStyle:"italic"
                , color : "#b3b3b3"
            }).width(INPUT_SIZE.width)
            .height(INPUT_SIZE.height - 2)
            .val("产品搜索");

        var _button = $("<img />")
            .attr({
                src : "./res/drawables/wk_searchbar_btn.png"
            }).css({
                float   : "right"
            }).width(BUTTON_SIZE.width)
            .height(BUTTON_SIZE.height)
            .addClass("wk-responer");

        $(_self).append(_input).append(_button)
            .append($("<div />").addClass("wk-clear"));

        $(_button).on("click", function(e) {
            if (_callback) {
                _callback.apply(_self, [$(_input).val()])
            }
        });

        $(_input).on("focus blur propertychange input", function(e) {
            if (e.type === "focus") {   //用户激活搜索栏时
                $(_input).on("keydown", function(e) {
                    if (e.keyCode === 13) { //回车键
                        if (_callback) {
                            _callback.apply(_self, [$(_input).val()])
                        }
                    }
                });

                var _v = $(this).val();
                if (_v === "产品搜索") {
                    $(this).val("").css({
                        fontStyle:"normal"
                        , color : "#000000"
                    });
                }

            } else if (e.type === "blur") { //搜索栏焦点消失
                $(_input).off("keydown");
                if (!_currentValue || _currentValue === "") {
                    $(this).val("产品搜索")
                        .css({
                            fontStyle:"italic"
                        , color : "#b3b3b3"
                    });
                }
            } else if (e.type === "propertychange" || e.type === "input") {
                _currentValue = $(this).val();
                if (!_currentValue || _currentValue === "") {
                    $(this).val("产品搜索")
                        .css({
                            fontStyle:"italic"
                        , color : "#b3b3b3"
                    });
                    _currentValue = null;
                }
            }
        });
    }

    /**
     * 将指定控件渲染成标签栏
     * @param items 标签项
     * @param currentPosition 默认当前高亮的位置
     * @param callback 点击事件回调
     */
    $.fn.tabbar = function() {

        var DEFAULT_HEIGHT = 30;


        var _self = this;

        var _items;
        var _currentPosition;
        var _currentItem;
        var _callback;
        var _args = arguments;
        var _style;
        if (_args && _args.length) {
            if ($.isArray(_args[0])) {
                _items = _args[0];
            }

            if (_args.length > 1) {
                if (typeof _args[1] === "number") {
                    _currentPosition = _args[1];
                } else if (typeof _args[1] === "function") {
                    _callback = _args[1];
                } else if (typeof _args[1] === "object") {
                    _style = _args[1];
                }
            }

            if (!_callback && _args.length > 2) {
                if (typeof _args[2] === "function") {
                    _callback = _args[2];
                } else if (typeof _args[2] === "object") {
                    _style = _args[2];
                }
            }

            if (_args.length > 3) {
                if (typeof _args[3] === "object") {
                    _style = _args[3];
                }
            }
        }

        if (!_items || !_items.length) {
            return;
        }

        var _count = _items.length;

        var _width = 0;
        if ($(_self).attr("wk-width")) {
            _width = parseInt($(_self).attr("wk-width"));
        } else {
            _width = $(_self).width();
        }

        if (isNaN(_width) || _width <= 0) {
            return;
        }

        var _height = DEFAULT_HEIGHT;
        if ($(_self).attr("wk-height")) {
            _height = parseInt($(_self).attr("wk-height"));
        }

        if (isNaN(_height) || _height <= 0) {
            _height = DEFAULT_HEIGHT;
        }

        var _itemWidth = parseInt(_width / _count);

        var _ul = $('<ul />').css({
            listStyle : "none"
        }).width(_width).height(_height);

        for (var i = 0; i < _count; i++) {
            var _li = $('<li />')
                .addClass("wk-responer")
                .addClass("wk-tabbar-item")
                .addClass("wk-tabbar-item-normal")
                .text(_items[i].title)
                .width(_itemWidth)
                .height(_height)
                .css({
                    lineHeight:_height + "px"
                });
            if (i == 0) {
                $(_li).addClass("wk-tabbar-item-left");
            } else if (i == _count - 1) {
                $(_li).addClass("wk-tabbar-item-right");
            }

            if (!isNaN(_currentPosition) && _currentPosition >= 0 && i === _currentPosition) {
                _currentItem = _li;

                $(_li).removeClass("wk-tabbar-item-normal");
                $(_li).addClass("wk-tabbar-item-current");
            }

            $(_li).on("mouseenter mouseleave click", function(e) {
                if (e.type === "mouseenter") {
                    if ($(this).hasClass("wk-tabbar-item-normal")) {
                        $(this).removeClass("wk-tabbar-item-normal");
                    }
                    if (!$(this).hasClass("wk-tabbar-item-current")) {
                        $(this).addClass("wk-tabbar-item-current");
                    }

                } else if (e.type === "mouseleave") {
                    if (_currentItem !== this) {
                        if ($(this).hasClass("wk-tabbar-item-current")) {
                            $(this).removeClass("wk-tabbar-item-current");
                        }
                        if (!$(this).hasClass("wk-tabbar-item-normal")) {
                            $(this).addClass("wk-tabbar-item-normal");
                        }
                    }

                } else if (e.type === "click") {
                    if (_currentItem) {
                        if ($(_currentItem).hasClass("wk-tabbar-item-current")) {
                            $(_currentItem).removeClass("wk-tabbar-item-current");
                        }
                        if (!$(_currentItem).hasClass("wk-tabbar-item-normal")) {
                            $(_currentItem).addClass("wk-tabbar-item-normal");
                        }
                    }

                    if ($(this).hasClass("wk-tabbar-item-normal")) {
                        $(this).removeClass("wk-tabbar-item-normal");
                    }
                    if (!$(this).hasClass("wk-tabbar-item-current")) {
                        $(this).addClass("wk-tabbar-item-current");
                    }

                    _currentItem = this;

                    if (_callback) {
                        var _index = 0;
                        $(this).parent().children().each(function(index, item) {
                            if (item === _currentItem) {
                                _index = index;
                                return false;
                            }
                        })
                        _callback.apply(_self, [_index, _currentItem, _items[_index]]);
                    }
                }
            });

            $(_ul).append(_li);
        }

        $(_self).append(_ul);

    }

    /**
     * 将指定控件渲染成子标题栏
     * @param items 标题项
     * @param currentPosition 默认当前高亮的位置
     * @param callback 点击事件回调
     */
    $.fn.subtitlebar = function() {

        var DEFAULT_HEIGHT = 28;
        var DEFAULT_ITEM_WIDTH = 80;

        var _self = this;

        var _items;
        var _currentPosition;
        var _currentItem;
        var _callback;
        var _args = arguments;
        var _style;
        if (_args && _args.length) {
            if ($.isArray(_args[0])) {
                _items = _args[0];
            }

            if (_args.length > 1) {
                if (typeof _args[1] === "number") {
                    _currentPosition = _args[1];
                } else if (typeof _args[1] === "function") {
                    _callback = _args[1];
                } else if (typeof _args[1] === "object") {
                    _style = _args[1];
                }
            }

            if (!_callback && _args.length > 2) {
                if (typeof _args[2] === "function") {
                    _callback = _args[2];
                } else if (typeof _args[2] === "object") {
                    _style = _args[2];
                }
            }

            if (_args.length > 3) {
                if (typeof _args[3] === "object") {
                    _style = _args[3];
                }
            }
        }

        if (!_items || !_items.length) {
            return;
        }

        var _count = _items.length;

        var _itemWidth = DEFAULT_ITEM_WIDTH;
        if ($(_self).attr("wk-itemWidth")) {
            _itemWidth = parseInt($(_self).attr("wk-itemWidth"));
        }

        if (isNaN(_itemWidth) || _itemWidth <= 0) {
            _itemWidth = DEFAULT_HEIGHT;
        }
        var _width = (_itemWidth + 2) * _count + 2;

        var _height = DEFAULT_HEIGHT;
        if ($(_self).attr("wk-height")) {
            _height = parseInt($(_self).attr("wk-height"));
        }

        if (isNaN(_height) || _height <= 0) {
            _height = DEFAULT_HEIGHT;
        }

        var _ul = $('<ul />').css({
            listStyle : "none"
        }).width(_width).height(_height);

        var _itemHeight = _height - 4;

        for (var i = 0; i < _count; i++) {
            var _css = {
                lineHeight:_itemHeight + "px"
            };
            if (i < _count - 1) {
                _css.borderRight = "none";
            }
            var _li = $('<li />')
                .addClass("wk-responer")
                .addClass("wk-subtitlebar-item")
                .addClass("wk-subtitlebar-item-normal")
                .text(_items[i].title)
                .width(_itemWidth)
                .height(_itemHeight)
                .css(_css);

            if (!isNaN(_currentPosition) && _currentPosition >= 0 && i === _currentPosition) {
                _currentItem = _li;

                $(_li).removeClass("wk-subtitlebar-item-normal");
                $(_li).addClass("wk-subtitlebar-item-current");
            }

            $(_li).on("mouseenter mouseleave click", function(e) {
                if (e.type === "mouseenter") {
                    if ($(this).hasClass("wk-subtitlebar-item-normal")) {
                        $(this).removeClass("wk-subtitlebar-item-normal");
                    }
                    if (!$(this).hasClass("wk-subtitlebar-item-current")) {
                        $(this).addClass("wk-subtitlebar-item-current");
                    }

                } else if (e.type === "mouseleave") {
                    if (_currentItem !== this) {
                        if ($(this).hasClass("wk-subtitlebar-item-current")) {
                            $(this).removeClass("wk-subtitlebar-item-current");
                        }
                        if (!$(this).hasClass("wk-subtitlebar-item-normal")) {
                            $(this).addClass("wk-subtitlebar-item-normal");
                        }
                    }

                } else if (e.type === "click") {
                    if (_currentItem) {
                        if ($(_currentItem).hasClass("wk-subtitlebar-item-current")) {
                            $(_currentItem).removeClass("wk-subtitlebar-item-current");
                        }
                        if (!$(_currentItem).hasClass("wk-subtitlebar-item-normal")) {
                            $(_currentItem).addClass("wk-subtitlebar-item-normal");
                        }
                    }

                    if ($(this).hasClass("wk-subtitlebar-item-normal")) {
                        $(this).removeClass("wk-subtitlebar-item-normal");
                    }
                    if (!$(this).hasClass("wk-subtitlebar-item-current")) {
                        $(this).addClass("wk-subtitlebar-item-current");
                    }

                    _currentItem = this;

                    if (_callback) {
                        var _index = 0;
                        $(this).parent().children().each(function(index, item) {
                            if (item === _currentItem) {
                                _index = index;
                                return false;
                            }
                        })
                        _callback.apply(_self, [_index, _currentItem, _items[_index]]);
                    }
                }
            });

            $(_ul).append(_li);
        }

        $(_self).append(_ul);

    }

    $.fn.coverflow = function() {

        var _args = arguments;
        if (!_args || !_args.length) {
            return;
        }

        var _self = this;
        var _width = $(_self).width();
        var _height = $(_self).height();

        var _items;
        var _itemWidth = 278;
        var _itemHeight = _height;
        var _showShadow = true;
        if (_args.length > 0 && $.isArray(_args[0])) {
            _items = _args[0];
        }

        var _showCount = 3

        var _animating = false;

        if (_items) {
            if (_args.length > 1 && (typeof(_args[1]) === "number")) {
                _showCount = _args[1];
            }
            if (_args.length > 1 && (typeof(_args[1]) === "object")) {
                var _configArg = _args[1];
                if (_configArg.showcount) {
                    _showCount = parseInt(_configArg.showcount);
                }
                if (_configArg.itemwidth) {
                    _itemWidth = parseInt(_configArg.itemwidth);
                }
                if (_configArg.itemheight) {
                    _itemHeight = parseInt(_configArg.itemheight);
                }
                _showShadow = _configArg.shadow;
            }
        }

        if (!_items.length || _showCount <= 0) {
            return;
        }

        var _window = $("<div />")
            .css({
                width       : _width + "px"
                , height    : _height + "px"
                , position  : "relative"
                , top       : "0px"
                , left      : "0px"
                , overflow  : "hidden"
            });

        $(_self).append(_window);

        var _count = _items.length;

        var _marginHorizonal = parseInt((_width - _itemWidth * 3) / 6);

        var createCoverWithItem = function(item, size, position) {

            var ICON_NAME = [
                "wk_item_title_icon_red.png"
                , "wk_item_title_icon_green.png"
                , "wk_item_title_icon_blue.png"
            ];

            var SHADOW_WIDTH = _itemWidth;
            var SHADOW_HEIGHT = _showShadow ? 27 : 0;
            var SHADOW_MARGIN_TOP = 15;

            var COVER_PADDING = 5;

            var _s = size;

            var _coverHeight = _s.height - SHADOW_MARGIN_TOP - SHADOW_HEIGHT - COVER_PADDING * 2;
            var _coverWidth = _s.width - COVER_PADDING * 2;

            var _coverItem = $("<div />")
                .addClass("wk-cover-item")
                .css({
                    width       : _s.width + "px"
                    , height    : _s.height + "px"
                    , position  : "absolute"
                    , top       : "0px"
                    , left      : ((_s.width + _marginHorizonal * 2) * position + _marginHorizonal) + "px"
                });

            if (item.href) {
                $(_coverItem)
                    .addClass("wk-responer")
                    .attr({
                        "wk-uri" : item.href
                    })
            }

            $(_coverItem).on("mouseenter mouseleave click", function(e) {
                if (e.type === "mouseenter") {
                    $(this).css({
                        cursor : "pointer"
                    });
                } else if (e.type === "mouseleave") {
                    $(this).css({
                        cursor : "auto"
                    });
                } else if (e.type === "click") {
                    if ($(this).attr("wk-uri")) {
                        route.route($(this).attr("wk-uri"));
                    }
                }
            });

            var _cover = $("<div />")
                .css({
                    height                  : _coverHeight + "px"
                    , width                 : _coverWidth + "px"
                    , padding               : "5px"
                    , mozBorderRadius       : "5px"
                    , webkitBorderRadius    : "5px"
                    , borderRadius          : "5px"
                    , background            : "#e3e4e6"
                });

            var _coverBody = $("<div />")
                .css({
                    height                  : _coverHeight + "px"
                    , width                 : _coverWidth + "px"
                    , position              : "relative"
                    , top                   : "0px"
                    , left                  : "0px"
                });

            var _coverImage = $("<img />")
                .attr({
                    src     : "./data/" + item.coverImage
                    , width : _coverWidth + "px"
                    , height: _coverHeight
                }).css({
                    position: "absolute"
                    , top   : "0px"
                    , left  : "0px"
                    , mozBorderRadius       : "3px"
                    , webkitBorderRadius    : "3px"
                    , borderRadius          : "3px"
                });

            var TITLE_HEIGHT = 34;

            var _coverTitle = $("<div />")
                .addClass("wk-item-title")
                .css({
                    width       : _coverWidth + "px"
                    , height    : TITLE_HEIGHT + "px"
                    , position  : "absolute"
                    , top       : (_coverHeight - TITLE_HEIGHT) + "px"
                    , left      : "0px"
                    , mozBorderRadiusBottomleft     : "3px"
                    , mozBorderRadiusBottomright    : "3px"
                    , webkitBorderBottomLeftRadius  : "3px"
                    , webkitBorderBottomRightRadius : "3px"
                    , borderBottomLeftRadius        : "3px"
                    , borderBottomRightRadius       : "3px"
                });

            var _coverTitleIcon = $("<img />")
                .attr({
                    src     : "./res/drawables/" + ICON_NAME[position % 3]
                    , width : "3px"
                    , height: "17px"
                }).css({
                    float       : "left"
                    , marginLeft: "20px"
                    , marginTop : "8px"

                });

            var _coverTitleText = $("<h1 />")
                .css({
                    float       : "left"
                    , marginTop : "4px"
                    , marginLeft: "10px"
                    , fontSize  : "2.2em"
                    , color     : "white"
                    , lineHeight: "22px"
                    , fontWeight: "normal"
                })
                .text(item.title);

            var _shadow = $("<img />").attr({
                src     : "./res/drawables/wk_cover_shadow.png"
                , width : SHADOW_WIDTH + "px"
                , height: SHADOW_HEIGHT + "px"
            }).css({
                    marginTop : SHADOW_MARGIN_TOP + "px"
                });

            $(_coverBody).append(_coverImage);
            if (item.title) {
                $(_coverTitle).append(_coverTitleIcon);
                $(_coverTitle).append(_coverTitleText);
                $(_coverTitle).append($('<div />').attr("class", "wk-clear"));
                $(_coverBody).append(_coverTitle);
            }

            $(_cover).append(_coverBody);
            $(_coverItem).append(_cover);
            if (_showShadow) {
                $(_coverItem).append(_shadow);
            }


            return _coverItem;
        }

        var _itemSize = {
            width   : _itemWidth
            , height: _itemHeight
        };

        var _currentItem = 0;
        for (var i = 0; i < _count; i++) {
            var _coverItem = createCoverWithItem(_items[i], _itemSize, i);
            if (i < _showCount) {
                $(_window).append(_coverItem);
                continue;
            }

            break;
        }

        var _coverFlowObject = {

            update : function() {
            }

            , prev : function() {
                if (_animating) {
                    return;
                }

                _animating = true;

                _currentItem--;
                if (_currentItem < 0) {
                    _currentItem = _count - 1;
                }
                var _prevPos = _currentItem;
                var _prevCoverItem = createCoverWithItem(_items[_prevPos], _itemSize, _prevPos);
                $(_prevCoverItem).css({
                    width       : _itemSize.width + "px"
                    , height    : _itemSize.height + "px"
                    , position  : "absolute"
                    , top       : "0px"
                    , left      : (-(_itemSize.width + _marginHorizonal)) + "px"
                    , display   : "none"
                });
                $(_window).prepend(_prevCoverItem);

                $(_prevCoverItem).animate({
                    opacity : "show"
                    , left  : _marginHorizonal + "px"
                }, 500, function() {
                    $(_prevCoverItem).css({
                        width       : _itemSize.width + "px"
                        , height    : _itemSize.height + "px"
                        , position  : "absolute"
                        , top       : "0px"
                        , left      : _marginHorizonal + "px"
                    });

                    _animating = false;
                });

                $(_window).children().each(function(i, item) {
                    if (i > 0) {
                        var newLeft = (_itemSize.width + _marginHorizonal * 2) * i + _marginHorizonal;
                        var prop = {
                            left : newLeft + "px"
                        };
                        if (i === _showCount) {
                            prop.opacity = "hide";
                        }
                        $(item).animate(prop, 500, function() {
                            if (i < _showCount) {
                                $(item).css({
                                    width       : _itemSize.width + "px"
                                    , height    : _itemSize.height + "px"
                                    , position  : "absolute"
                                    , top       : "0px"
                                    , left      : newLeft + "px"
                                });
                            } else {
                                $(item).remove();
                            }
                        })
                    }
                });

            }

            , next : function() {
                if (_animating) {
                    return;
                }

                _animating = true;

                _currentItem++;
                if (_currentItem >= _count) {
                    _currentItem = 0;
                }
                var _nextPos = (_currentItem + 2) % _count;
                var _nextCoverItem = createCoverWithItem(_items[_nextPos], _itemSize, _nextPos - 1);
                $(_nextCoverItem).css({
                    width       : _itemSize.width + "px"
                    , height    : _itemSize.height + "px"
                    , position  : "absolute"
                    , top       : "0px"
                    , left      : ((_itemSize.width + _marginHorizonal * 2) * _showCount + _marginHorizonal) + "px"
                    , display   : "none"
                });

                $(_window).append(_nextCoverItem);

                $(_nextCoverItem).animate({
                    opacity : "show"
                    , left  : ((_itemSize.width + _marginHorizonal * 2) * (_showCount - 1) + _marginHorizonal) + "px"
                }, 500, function() {
                    $(_nextCoverItem).css({
                        width       : _itemSize.width + "px"
                        , height    : _itemSize.height + "px"
                        , position  : "absolute"
                        , top       : "0px"
                        , left      : ((_itemSize.width + _marginHorizonal * 2) * (_showCount - 1) + _marginHorizonal) + "px"
                    });

                    _animating = false;
                });

                $(_window).children().each(function(i, item) {
                    if (i < _showCount) {
                        var newLeft = (_itemSize.width + _marginHorizonal * 2) * (i - 1) + _marginHorizonal;
                        var prop = {
                            left : newLeft + "px"
                        };
                        if (i === 0) {
                            prop.opacity = "hide";
                        }
                        $(item).animate(prop, 500, function() {
                            if (i > 0) {
                                $(item).css({
                                    width       : _itemSize.width + "px"
                                    , height    : _itemSize.height + "px"
                                    , position  : "absolute"
                                    , top       : "0px"
                                    , left      : newLeft + "px"
                                });
                            } else {
                                $(item).remove();
                            }
                        })
                    }
                });
            }

        }

        return _coverFlowObject;
    }


})(jQuery);

Route = function() {
    this.routeTable = {};
}

Route.prototype.match = function(path, handler) {
    this.routeTable[path] = handler;
}

Route.prototype.route = function(path) {
    var pos = -1;
    var p = path;
    var d = null;
    if ((pos = path.indexOf("/")) > 0) {
        p = path.substring(0, pos);
        d = path.substring(pos + 1);
    }
    var handler = this.routeTable[p]
    if (handler && typeof handler === 'function') {
        handler.apply(this, [p, d]);
    }
}

route = new Route();
route.match("electron", function(path, ds) {
    window.location.href = "productdetail.html?index=2&ds=" + ds + "&pagetitle=" + ds;
});

route.match("mro", function(path, ds) {
    window.location.href = "mrodetails.html?index=3&ds=" + ds + "&pagetitle=" + ds;
});

Weikan = function() {

    this.onPrepareShowWindowHandler = null;
}

Weikan.MATCH_PARENT = -1;

Weikan.WRAP_CONTENT = -2;

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
    logo : {
        image : "logo.png"
        , href : "index"
    }
    , title : "威侃"
    , height : Weikan.MATCH_PARENT
    , root : "."
    , dataRootName : "data"
    , resourceRootName : "res"
    , defpostfix : "html"
    , body : {
        minHeight : 550
        , minWidth : 900
    }
    , headerbar : {
        height : 100
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
                title: "MRO"
                , href: "index"
                , width: 60
                , positionoffset : 80
                , subitems: [
                    {title:"GT 1000", href: "mro/gt1000"}
                    , {title:"GT 2000", href: "mro/gt2000"}
                    , {title:"GT 2010", href: "mro/gt2010"}
                    , {title:"XT2000", href: "mro/xt2000"}
                    , {title:"DT4200", href: "mro/dt4200"}
                ]
            }
            , {
                title: "电子制造"
                , href: "index"
                , width: 88
                , positionoffset : 40
                , subitems: [
                    {title:"高品质标签", href: "electron/electron_0"}
                    , {title:"丝网印刷标签", href: "#"}
                    , {title:"精密膜切加工", href: "electron/electron_2"}
                    , {title:"打印系统及软件", href: "#"}
                    , {title:"包装设计", href: "#"}
                    , {title:"VMI包装解决方案", href: "#"}
                    , {title:"包装产品", href: "#"}
                    , {title:"内包装辅料", href: "#"}
                    , {title:"包装附件", href: "#"}
                ]
            }
            , {
                title: "防水透气产品"
                , href: "index"
                , width: 108
            }
        ]
    }
    , bottomExpand : {
        height : 0
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

Weikan.prototype.clearDiv = function() {
    return $('<div />').attr("class", "wk-clear");
}

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

Weikan.prototype.onPrepareShowWindow = function() {
    var args = arguments;
    if (args && args.length && typeof args[0] === "function") {
        this.onPrepareShowWindowHandler = args[0];
    }

    return this;
}

Weikan.prototype.run = function() {
    var _self = this;
    var title = Weikan.config.title;
    var url = window.location.href;
    var dataCallback = null;
    var querystr = $.query(url);
    var titled = false;
    if (arguments && arguments.length) {
        var arg = arguments[0];
        if (typeof arg === "object") {
            if (arg.title) {
                title = arg.title;
                titled = true;
            }
            if (arg.dataHandler && typeof arg.dataHandler === "function") {
                dataCallback = arg.dataHandler;
            }
        } else if (typeof arguments[0] === "function") {
            dataCallback = arguments[0];
        }

    }

    if (!titled) {
        if (querystr["pagetitle"]) {
            title = decodeURI(querystr["pagetitle"]);
        }
    }

    document.title = title;

    var wkMain = $("#wk-main");

    var wkBackground = $('<div />').attr({
        id : "wk-body-background"
    });
    $(wkBackground).insertBefore(wkMain);
    var wkBody = $(wkMain).find("#wk-body");
    var wkHeader = $("<div />").addClass("wk-header")
        .height(Weikan.config.headerbar.height);
    var imgLogo = $("<img />")
        .attr({
            src : Weikan.config.root + "/res/drawables/" + Weikan.config.logo.image
        }).css({
            position: "relative"
            , top   : "40px"
            , left  : "40px"
        })
        .addClass("wk-responer");

    $(imgLogo).on("click", function(e) {
        window.location.href = Weikan.config.root + "/" + Weikan.config.logo.href + "." + Weikan.config.defpostfix
    });

    var right = $('<div />')
        .css({
            float           :"right"
            , marginRight   :"50px"
            , marginTop     :"30px"
        });

    var cn = $('<span />')
        .text("中文")
        .css({
            float:"right"
            , marginRight:"50px"
        }).addClass("wk-responer");

    var en = $('<span />')
        .text("ENGLISH")
        .css({
            float:"right"
        }).addClass("wk-responer");

    var searchbar = $("<div />")
        .attr({"wk-widget" : "searchbar"})
        .css({
            marginTop:"10px"
        });

    $(right).append(en).append(cn).append($('<div />').addClass("wk-clear")).append(searchbar);

    $(wkHeader).append(imgLogo).append(right);
    $(wkMain).prepend(wkHeader);
    var wkNavbar = $('<div />').attr({id:"wk-navbar"});
    $(wkNavbar).insertBefore(wkBody);
    var wkFooter = $('<div />').attr({id:"wk-footer"})
        .height(Weikan.config.footerbar.height);
    $(wkMain).append(wkFooter);
    $(this.clearDiv()).insertAfter(wkBody);

    var wkBottomExpand = $('<div />')
        .attr({id:"wk-bottom-expand"})
        .height(Weikan.config.bottomExpand.height);
    $(wkBottomExpand).insertBefore(wkFooter);

    var _bodyRawHeight = $("#wk-body").height();

    var initRects = function() {
        var headerHeight = Weikan.config.headerbar.height;
        var footerHeight = Weikan.config.footerbar.height;
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


        var body = $("#wk-body");
        var bodyPaddingTop = 0;

        $(body).width(bodyWidth - 50);
        var navbar = $("#wk-navbar");
        $(navbar).width(navbarWidth);

        if (Weikan.config.height === Weikan.MATCH_PARENT) {
            var bodyHeight = windowHeight - footerHeight - headerHeight;
            if (bodyHeight < minBodyHeight) {
                bodyHeight = minBodyHeight;
            }
            $(body).height(bodyHeight - Weikan.config.bottomExpand.height);
            $(navbar).height(bodyHeight - Weikan.config.bottomExpand.height);

        } else if (Weikan.config.height === Weikan.WRAP_CONTENT) {
            var bodyHeight = _bodyRawHeight;
            if (bodyHeight < minBodyHeight) {
                bodyHeight = minBodyHeight;
            }

            if ((bodyHeight + footerHeight + headerHeight + Weikan.config.bottomExpand.height) < windowHeight) {
                bodyHeight = windowHeight - footerHeight - headerHeight - Weikan.config.bottomExpand.height;
                $(body).height(bodyHeight);
            }

            $(navbar).height($(body).height());

        } else {
            var bodyHeight = Weikan.config.height;
            if (bodyHeight <= 0) {
                bodyHeight = minBodyHeight;
            }

            if ((bodyHeight + footerHeight + headerHeight) < windowHeight) {
                bodyHeight = windowHeight - footerHeight - headerHeight;
            }

            $(body).height(bodyHeight - Weikan.config.bottomExpand.height);
            $(navbar).height(bodyHeight - Weikan.config.bottomExpand.height);

        }

        $("#wk-main").width(navbarWidth + bodyWidth);

        $("div[wk-widget='window']").on("click", function(e) {
            if ($(this).attr("wk-uri")) {
                var pos = -1;
                var p = $(this).attr("wk-uri");
                var d = null;
                if ((pos = path.indexOf("/")) > 0) {
                    p = path.substring(0, pos);
                    d = path.substring(pos + 1);
                }
                var arg = {};
                if (p) {
                    arg.path = p;
                }
                if (d) {
                    arg.datasource = d;
                }

                $.detialwindow(arg)
                    .token($(this).attr("wk-window-token"))
                    .templateName("wk.window.template.html")
                    .show();

            }

            $.detialwindow(null)
                .token($(this).attr("wk-window-token"))
                .templateName("wk.window.template.html")
                .onLoad(_self.onPrepareShowWindowHandler)
                .show();
        });

        $(".wk-responer").on("mouseenter mouseleave click", function(e) {
            if (e.type === "mouseenter") {
                $(this).css({
                    cursor : "pointer"
                });
            } else if (e.type === "mouseleave") {
                $(this).css({
                    cursor : "auto"
                });
            } else if (e.type === "click") {
                if ($(this).attr("wk-uri")) {
                    route.route($(this).attr("wk-uri"));
                }
            }
        });
    }

    if (querystr["ds"] && dataCallback) {
        var _dataRoot = Weikan.config.dataRootName;
        $.ajax({
            url:_dataRoot + "/" + querystr["ds"] + ".xml"
            , type:"GET"
            , dataType:"xml"
            , success:function(data) {
                dataCallback.apply(_self, [data]);
                var body = $("#wk-body");
                $(body).height(body[0].scrollHeight);
                _bodyRawHeight = $(body).height();
                initRects();
            }
            , error:function() {
                dataCallback.apply(_self, [{error:-1}]);
                var body = $("#wk-body");
                $(body).height(body[0].scrollHeight);
                _bodyRawHeight = $(body).height();
                initRects();
            }
        })
    }

    var _navbarItems = $('<div />').attr("id", "wk-navbar-items");
    var _currentIndex = -1;
    if (querystr["index"]) {
        _currentIndex = parseInt(querystr["index"]);
    }

    var _navItemCallback = function(i, item) {
        window.location.href = item.navitem.href + "." + Weikan.config.defpostfix;
    }
    if (_currentIndex >= 0) {
        $(_navbarItems).navigationbar(Weikan.config.navbar.items, _currentIndex, _navItemCallback);
    } else {
        $(_navbarItems).navigationbar(Weikan.config.navbar.items, _navItemCallback);
    }

    $("#wk-navbar").append(_navbarItems);

    initRects();

    var _footerItems = $('<div />').attr("id", "wk-footer-items");
    var _copyright = $('<div />').attr("id", "wk-footer-copyright");
    $(_copyright).text("版权所有:" + Weikan.config.organization);
    $("#wk-footer").append(_footerItems).append(_copyright).append(this.clearDiv());

    $(_footerItems).footer(Weikan.config.footerbar.items);

    $("div[wk-widget='titlebar']").titlebar();

    $("div[wk-widget='searchbar']").searchbar(function(key) {

    });

    $(window).resize(function(e) {
        initRects();

        $("div[wk-widget='titlebar']").each(function(i, item) {
            $(item).titlebar();
        });
    });

}

weikan = new Weikan();