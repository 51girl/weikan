/**
 * Created by Forcs on 14-3-30.
 */
$(window).load(function(e) {
    var _wkBody = $("#wk-body");
    var _wrapper = $(_wkBody).find("#produce-vista-wrapper");
    $(_wrapper).width(1074).height(388);
    var _cf = $("#produce-vista").width($(_wrapper).width() - 29 * 2).height($(_wrapper).height()).coverflow([
        {
            title           : "高品质标签"
            , coverImage    : "produce_1.png"
            , href          : "electron/electron_0"
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
        , marginLeft:"100px"
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
            , lineHeight    : "12px"
        }).text(_demoItems[i].title);

        var _itemIcon = $('<div />')
            .addClass("bottom-title-icon")
            .css({
                position    : "absolute"
                ,top        : (98 - 22 + 11) + "px"
                , left      : "10px"
            });

        $(_item).append(_itemImage).append(_itemTitle).append(_itemIcon);
        $(_right).append(_item);
    };

    $(_wkBottomExpand).append(_left).append(_right);

});
