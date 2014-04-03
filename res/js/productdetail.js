/**
 * Created by Johnson on 14-4-3.
 */
$(window).load(function(e) {

    var _data = {
        main_img : "product_detail_main_image.png",
        main_content_title : "高品质标签",
        main_content_dec : "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        items : [
            {
                item_content_img : "product_detail_item_image.png",
                item_content_title : "空白标签",
                item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                item_content_img : "product_detail_item_image.png",
                item_content_title : "空白标签2",
                item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                item_content_img : "product_detail_item_image.png",
                item_content_title : "空白标签3",
                item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            },
            {
                item_content_img : "product_detail_item_image.png",
                item_content_title : "空白标签4",
                item_content_dec : "威侃可根据客户要求提供各种规格及不同材质的高品质空白标签，威侃空白的可承印标签是可以在任何特殊环境中提供出色性能的高性能标签"
            }
        ]
    }
    var main_img = $("#main_img");
    var main_content_title = $("#main_content_title");
    var main_content_dec = $("#main_content_dec");
    var titlebar = $("#titlebar");

    main_img.attr({src : "./data/" + _data.main_img});
    main_content_title.text(_data.main_content_title);
    main_content_dec.text(_data.main_content_dec);
    titlebar.title.text(_data.main_content_title);




    var Item = function(){
        var item_content_title = $("<h2/>");
        var item_content_divide = $("<img />")
            .attr("src", "res/drawables/product_detail_item_divider.jpg")
            .css({
                "margin-top": 7+"px",
                "margin-bottom": 7+"px",
                "margin-left": 2+"px"
            });
        var item_content_dec = $("<p/>")
            .css({
                "width" : 130+"px",
                "height" : 90+"px"
            });
        var item_content_more = $("<img/>")
            .attr("src", "res/drawables/product_detail_item_more.png")
            .css({
                "float" : "right"
            });
        var item_content_right = $("<div/>")
            .css({
                "float" : "left",
                "width" : 150+"px",
                "height" : 143+"px",
                "margin-left" : 20+"px",
                "padding-top" : 10+"px"
            });
        $(item_content_right).append(item_content_title,item_content_divide,item_content_dec,item_content_more);
        var item_content_img = $("<img/>")
            .css({
                "float" : "right"
            });
        var item_content = $("<div/>")
            .css({
                "position" : "absolute",
                "top" : 0+"px",
                "left" : 0+"px",
                "width" : 402+"px",
                "padding" : 10+"px"
            });
        $(item_content).append(item_content_img,item_content_right);
        var item_bg = $("<img/>")
            .attr("src", "res/drawables/product_detail_item_bg.png")
            .css({
                "position" : "absolute",
                "top" : 0+"px",
                "left" : 0+"px"
            });
        var item = $("<div/>")
            .css({
                "position" : "relative",
                "top" : 0+"px",
                "left" : 0+"px",
                "width" : 402+"px",
                "height" : 171+"px",
                "float" : "left",
                "margin-right" : 40+"px"
            });
        $(item).append(item_bg).append(item_content);
    }

    var item = new Item();
    item.item_content_title.text("这是标题");
    item.item_content_img.attr({src : "res/drawables/product_detail_item_image.png"});
    item.item_content_dec.text("这是内容aaaaaaaaaaaaaaaaa");

    var produce_detail = $("#produce_detail");
    $("#row").append(item.item);
});

