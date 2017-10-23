(function($, _, common) {
    this.charginglocation = {
        init: function() {
            // charginglocation.howtocharge_howto();
            $(".item--charginglocations",".main-header .mainmenu .list").addClass("on");
        },
        checkview: function() {}
    }
    return charginglocation
})(jQuery, _, this.common);

jQuery(function() {
    charginglocation.init();
    settitle()
})