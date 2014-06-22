/**
 * Created by Forcs on 14-3-30.
 */
$(window).load(function(e) {
    var _wkBody = $("#wk-body");
    var _wrapper = $(_wkBody).find("#produce-vista-wrapper");
    $(_wrapper).width(1114).height(388);
    var _cf = $("#produce-vista").width($(_wrapper).width() - 29 * 2).height($(_wrapper).height()).coverflow([
        {
            title           : "手持打印机"
            , coverImage    : "produce_1.png"
            , href          : "electron/electron_1"
        }, {
            title           :"整体包装解决方案"
            , coverImage    : "produce_2.png"
            , href          : "device/tps"
        }, {
            title           :"标识及精密切模"
            , coverImage    : "produce_3.png"
            , href          : "device/tag"
        }, {
            title           :"防水透气膜"
            , coverImage    : "produce_4.png"
            , href          : "electron/electron_2"
        }
    ], 4);

    $("#prev-button").click(function(e) {
        _cf.prev();
    });

    $("#next-button").click(function(e) {
        _cf.next();
    });


});
