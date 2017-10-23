(function($, _, common) {

    this.home = {
        init: function() {
            home.home_howto();

            home.slider_interactive();
            common.setasinapp("false");
        },
        slider_interactive: function() {

            if ($(".tabBox").length) {
                $(".tab1", ".tabBox").addClass("on"); //init
                $(".tab", ".tabBox").on("click", function(e) {
                    var t = $(e.target).parent();
                    $('.slider', '.home__howto').slick("slickGoTo", t.index());
                    $(".tab", ".tabBox").removeClass("on");
                    $(this).addClass("on");
                })
            }

        },
        home_howto: function() {

            var homeslickOption = {
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
                }],

            }
            $('.slider', '.home__howto').slick(homeslickOption);
            $('.slider', '.home__howto').on('beforeChange', function() {
                $(".tab ", ".home__howto").removeClass("on");
            });
            $('.slider', '.home__howto').on('afterChange', function(event, slick, currentSlide, nextSlide) {
                $(".tab__upper .tab", ".home__howto").eq(currentSlide).addClass("on");
            });

        }
    }
    return home
})(jQuery, _, this.common);

//DOM Ready
jQuery(function() {
        home.init();
        settitle()
    }
)

jQuery(window).load();

jQuery(window).on();