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
    titlebar.title.text({src : _data.main_content_title});
});

