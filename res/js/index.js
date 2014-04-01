/**
 * Created by Forcs on 14-3-30.
 */
(function($){
    $.fn.coverflow = function() {

        var _args = arguments;
        if (!_args || !_args.length) {
            return;
        }

        var _items;
        if (_args.length > 0 && $.isArray(_args[0])) {
            _items = _args[0];
        }

        var _showCount = 3

        if (_items) {
            if (_args.length > 1 && (typeof(_args[1]) === "number")) {
                _showCount = _args[1];
            }
        }

        if (!_items.length || _showCount <= 0) {
            return;
        }

        var _self = this;
        var _width = $(_self).width();
        var _height = $(_self).height();

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

        var COVER_MARGIN = 30;
        var _count = _items.length;
        var _itemWidth = parseInt(_width / _count);
        var _itemHeight = _height;

        var createCoverWithItem = function(item, size, position) {

            var ICON_NAME = [
                "wk_item_title_icon_red.png"
                , "wk_item_title_icon_green.png"
                , "wk_item_title_icon_blue.png"
            ];

            var SHADOW_WIDTH = 278;
            var SHADOW_HEIGHT = 27;
            var SHADOW_MARGIN_TOP = 15;

            var COVER_PADDING = 5;

            var _s = size;

            var _coverHeight = _s.height - SHADOW_MARGIN_TOP - SHADOW_HEIGHT - COVER_PADDING * 2;
            var _coverWidth = _s.width - (COVER_MARGIN + COVER_PADDING) * 2;

            var _coverItem = $("<div />")
                .addClass("wk-cover-item")
                .css({
                    width       : _s.width + "px"
                    , height    : _s.height + "px"
                    , position  : "absolute"
                    , top       : "0px"
                    , left      : (_s.width * i + COVER_MARGIN) + "px"
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
                })
                .text(item.title);

            var _shadow = $("<img />").attr({
                src     : "./res/drawables/wk_cover_shadow.png"
                , width : SHADOW_WIDTH + "px"
                , height: SHADOW_HEIGHT + "px"
            }).css({
                    marginTop : SHADOW_MARGIN_TOP + "px"
                });

            $(_coverTitle).append(_coverTitleIcon);
            $(_coverTitle).append(_coverTitleText);
            $(_coverTitle).append($('<div />').attr("class", "wk-clear"));
            $(_coverBody).append(_coverImage);
            $(_coverBody).append(_coverTitle);
            $(_cover).append(_coverBody);
            $(_coverItem).append(_cover);
            $(_coverItem).append(_shadow);

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
                    , left      : COVER_MARGIN + "px"
                    , display   : "none"
                });
                $(_window).prepend(_prevCoverItem);

                $(_prevCoverItem).animate({
                    opacity : "show"
                }, 500, function() {
                    $(_prevCoverItem).css({
                        width       : _itemSize.width + "px"
                        , height    : _itemSize.height + "px"
                        , position  : "absolute"
                        , top       : "0px"
                        , left      : COVER_MARGIN + "px"
                    });
                });

                $(_window).children().each(function(i, item) {
                    if (i > 0) {
                        var newLeft = _itemSize.width* i + COVER_MARGIN;
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
                _currentItem++;
                if (_currentItem >= _count) {
                    _currentItem = 0;
                }
                var _nextPos = (_currentItem + 2) % _showCount;
                var _nextCoverItem = createCoverWithItem(_items[_nextPos], _itemSize, _nextPos);
                $(_nextCoverItem).css({
                    width       : _itemSize.width + "px"
                    , height    : _itemSize.height + "px"
                    , position  : "absolute"
                    , top       : "0px"
                    , left      : (_itemSize.width * (_showCount - 1) + COVER_MARGIN) + "px"
                    , display   : "none"
                });

                $(_window).append(_nextCoverItem);

                $(_nextCoverItem).animate({
                    opacity : "show"
                }, 500, function() {
                    $(_nextCoverItem).css({
                        width       : _itemSize.width + "px"
                        , height    : _itemSize.height + "px"
                        , position  : "absolute"
                        , top       : "0px"
                        , left      : (_itemSize.width * (_showCount - 1) + COVER_MARGIN) + "px"
                    });
                });

                $(_window).children().each(function(i, item) {
                    if (i < _showCount) {
                        var newLeft = _itemSize.width * (i - 1) + COVER_MARGIN;
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

            , current : function(c) {
                _currentItem = c;
            }

        }

        return _coverFlowObject;
    }

})(jQuery);

$(window).load(function(e) {
    var _wkBody = $("#wk-body");
    var _cf = $("#produce-vista").width($(_wkBody).width() - 29 * 2).height(388).coverflow([
        {
            title           : "高品质标签"
            , coverImage    : "produce_1.png"
        }, {
            title           :"防水透气膜"
            , coverImage    : "produce_2.png"
        }, {
            title           :"吊牌产品图片"
            , coverImage    : "produce_3.png"
        }
    ]);

    $("#prev-button").click(function(e) {
        _cf.prev();
    });

    $("#next-button").click(function(e) {
        _cf.next();
    });

    var _wkBottomExpand = $("#wk-bottom-expand");
    var _left = $('<div />').css({
        float       : "left"
        , width     : "290px"
        , marginTop : "36px"
        , marginLeft: "45px"
    });
    var _newsTopic = $('<h2 />')
        .addClass("bottom-text")
        .css({
            marginBottom : "10px"
        }).text("News");

    var _newsList = $('<ul />').css({
        listStyle : "disc inside"
    });
    var _listItem = [
        "11月14号，威侃全体员工参加了拓..."
        , "2009年10月31日，威侃组织\"09年消防演习\""
    ]
    for (var i = 0; i < 2; i++) {
        $(_newsList).append($('<li />')
            .addClass("bottom-text")
            .css({
                marginBottom    : "10px"
            })
            .text(_listItem[i]));
    }

    $(_left).append(_newsTopic).append(_newsList);

    var _right = $('<div />').css({
        float       :"left"
        , height    :"102px"
        , width     :((172 + 4 + 20) * 4)+ "px"
        , marginTop :"10px"
    });

    var _demoItems = [
        {
            title : "电子标识制造专家"
            , image : "demo_bottom_cover_0.png"
        }
        , {
            title : "电子制造包装集成专家"
            , image : "demo_bottom_cover_1.png"
        }
        , {
            title : "提供最佳的透水透气方案"
            , image : "demo_bottom_cover_2.png"
        }
        , {
            title : "专业标签打印系统"
            , image : "demo_bottom_cover_3.png"
        }
    ];

    for (var i = 0; i < 4; i++) {
        var _item = $('<div />').css({
            border          : "1px #fff solid"
            , padding       : "1px"
            , marginRight   : "20px"
            , position      : "relative"
            , top           : "0px"
            , left          : "0px"
            , width         : "172px"
            , height        : "98px"
            , float         : "left"
        });

        var _itemImage = $('<img />')
            .attr({
                src     : "./data/" + _demoItems[i].image
                , width : "172px"
                , height: "98px"
            }).css({
                position: "absolute"
                , top   : "1px"
                , left  : "1px"
            });

        var _itemTitle = $('<p />').css({
            background      : "url(\"res/drawables/wk_title_bg.png\") repeat"
            , position      : "absolute"
            , top           : (98 - 22 + 1) + "px"
            , left          : "1px"
            , height        : "17px"
            , width         : "152px"
            , color         : "white"
            , paddingTop    : "6px"
            , paddingLeft   : "20px"
            , fontWeight    : "none"
        }).text(_demoItems[i].title);

        $(_item).append(_itemImage).append(_itemTitle);
        $(_right).append(_item);
    };

    $(_wkBottomExpand).append(_left).append(_right);

});
