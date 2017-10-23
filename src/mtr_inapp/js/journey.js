(function($) {
    this.journey = {
        init: function() {
            $(".item--ourlowcarbondrivingjourney", ".main-header .mainmenu .list").addClass("on");
            // var s = skrollr.init({
            //     forceHeight: false
            // });

            // if ($(window).width() > 960) {
            //     skrollr.init({
            //         forceHeight: false
            //     });
            // } else {
            //     skrollr.init().destroy();

            // }
            // $(".journey__time__inner ").css("padding-bottom", $(".main-footer").outerHeight())
            // $(".main-footer").css("position", "fixed").css("bottom", "0px");

            // $('  .featureimg').css('opacity', 0.2).waypoint(function(direction) {
            //     if (direction === 'down') {
            //         $(this.element).animate({
            //             opacity: 1
            //         })
            //     } else {
            //         $(this.element).animate({
            //             opacity: 0.2
            //         })
            //     }
            // }, {
            //     offset: '75%'
            // })
            $('.featureimg.atleft').css('opacity', 0).waypoint(function(direction) {
                if (direction === 'down') {
                    $(this.element).animate({
                        left: "10%",
                        opacity: 1
                    })
                } else {

                    $(this.element).animate({
                        left: "-10%",
                        opacity: 0
                    })

                }
            }, {
                offset: '75%'
            })
            $('.featureimg.atright').css('opacity', 0).waypoint(function(direction) {
                if (direction === 'down') {

                    $(this.element).animate({
                        right: "10%",
                        opacity: 1
                    })

                } else {
                    $(this.element).animate({
                        right: "-10%",
                        opacity: 0
                    })
                }
            }, {
                offset: '75%'
            })

        }
    }
    return journey
})(jQuery);
jQuery(function() {
    journey.init();
    settitle()
})

$(window).on('resize', function() {
    journey.init()
    // if (common.mediacheck() != 'desktop' || 'tablet') {
    //     skrollr.init().destroy();
    // }
});