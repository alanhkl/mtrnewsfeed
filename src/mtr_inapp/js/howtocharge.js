(function($, _, common) {
    this.howtocharge = {
        init: function() {
            // howtocharge.howtocharge_howto();

            // howtocharge.slider_interactive()

        },

        slider_interactive: function() {

            if ($(".tabBox").length) {
                $(".tab1", ".tabBox").addClass("on"); //init
                $(".tab", ".tabBox").on("click", function(e) {
                    var t = $(e.target).parent();
                    $('.slider', '.howtocharge__howto').slick("slickGoTo", t.index());
                    $(".tab", ".tabBox").removeClass("on");
                    $(this).addClass("on");
                })
            }

        },
        howtocharge_howto: function() {
            var howtoslickOption = {
                dots: false,
                infinite: false,
                // draggable: false,
                // swipe: false,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '60px',
                responsive: [{
                    breakpoint: 960,
                    settings: {
                        centerPadding: '0px',
                    }
                }]
            }
            $('.slider', '.howtocharge__howto').slick(howtoslickOption);
        }
    }
    return howtocharge

})(jQuery, _, this.common);

jQuery(function() {
    howtocharge.init();
        settitle();
    $(".item--howtocharge",".main-header .mainmenu .list").addClass("on");
})