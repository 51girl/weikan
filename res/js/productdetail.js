/**
 * Created by Johnson on 14-4-3.
 */
$(window).ready(function(e) {

    var _data = {
        data_main_img : "product_detail_main_image.png",
        data_main_content_title : "高品质标签",
        data_main_content_dec : "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        data_items : [
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签2",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签3",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签4",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签4",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签4",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签4",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                data_item_content_img : "product_detail_item_image.png",
                data_item_content_img_big : "",
                data_item_content_title : "空白标签4",
                data_item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            }
        ]
    }
    var main_img = $("#main_img");
    var main_content_title = $("#main_content_title");
    var main_content_dec = $("#main_content_dec");
    var titlebar = $("#titlebar");

    main_img.attr({src : "./data/" + _data.data_main_img});
    main_content_title.text(_data.data_main_content_title);
    main_content_dec.text(_data.data_main_content_dec);
    titlebar.attr("title", _data.data_main_content_title);




    var Item = function(){
        this.item_content_title = $("<h2/>");
        this.item_content_divide = $("<img />")
            .attr("src", "res/drawables/product_detail_item_divider.jpg")
            .css({
                "margin-top": 7+"px",
                "margin-bottom": 7+"px",
                "margin-left": 2+"px"
            });
        this.item_content_dec = $("<p/>")
            .css({
                "width" : 130+"px",
                "height" : 90+"px"
            });
        this.item_content_more = $("<img/>")
            .attr("src", "res/drawables/product_detail_item_more.png")
            .css({
                "float" : "right"
            });
        this.item_content_right = $("<div/>")
            .css({
                "float" : "left",
                "width" : 150+"px",
                "height" : 143+"px",
                "margin-left" : 20+"px",
                "padding-top" : 10+"px"
            });
        $(this.item_content_right)
            .append(this.item_content_title)
            .append(this.item_content_divide)
            .append(this.item_content_dec)
            .append(this.item_content_more);
        this.item_content_img = $("<img/>")
            .css({
                "float" : "left"
            });
        this.item_content = $("<div/>")
            .css({
                "position" : "absolute",
                "top" : 0+"px",
                "left" : 0+"px",
                "width" : 402+"px",
                "padding" : 10+"px"
            });
        $(this.item_content)
            .append(this.item_content_img)
            .append(this.item_content_right);
        this.item_bg = $("<img/>")
            .attr("src", "res/drawables/product_detail_item_bg.png")
            .css({
                "position" : "absolute",
                "top" : 0+"px",
                "left" : 0+"px"
            });
        this.item = $("<div/>")
            .css({
                "position" : "relative",
                "top" : 0+"px",
                "left" : 0+"px",
                "width" : 402+"px",
                "height" : 171+"px",
                "float" : "left",
                "margin-right" : 40+"px"
            })
            .attr("wk-widget","window").addClass("wk-responer");
        $(this.item).append(this.item_bg).append(this.item_content);
    }
    var produce_detail = $("#produce_detail");
    var row;
    for(var i = 0; i < _data.data_items.length; i++) {
        var data_item = _data.data_items[i];
        if(i % 2 == 0) {
            row = $("<div/>")
                .css({
                    "height" : 171+"px",
                    "margin-bottom" : 10+"px"
                });
            $(produce_detail).append(row);
        }
        var item = new Item();
        item.item_content_title.text(data_item.data_item_content_title);
        item.item_content_img.attr({src : "./data/"+data_item.data_item_content_img});
        item.item_content_dec.text(data_item.data_item_content_dec);
        $(row).append(item.item);
    }
});

