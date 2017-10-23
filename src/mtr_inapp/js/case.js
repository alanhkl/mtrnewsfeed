// page cases
// case
// case__slideshow
// case__slide

$(document).ready(function() {
    cases.init();
    $(".item--ecocharge", ".main-header .mainmenu .list").addClass("on");
    $('.back').on("click", function() {
        window.history.go(-1);
        return false;
    })

})

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

var cases = {
    init: function() {
        cases.loadCaseDetails();
        cases.casesgallery();

    },
    casesgallery: function() {

        var casesslickOption = {
            dots: true,
            infinite: false,
            arrows: false,
            // draggable: false,
            // swipe: false,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            // centerMode: true,
            // centerPadding: '60px',
            responsive: [{
                breakpoint: 960,
                settings: {
                    // centerPadding: '0px',
                }
            }]
        }
        $('.case__slideshow', '.case').slick(casesslickOption);

    },
    loadCaseDetails: function() {
        var itemId = getUrlParam('itemid');

        var lang = $("html").attr("lang");
        var pt="EV - Successful Case - ";
		if(lang=="zh"){
			pt="電動車 – 成功個案 - ";
        }
        try {

            $.ajax({
                type: 'GET',
                url: apibase() + '/api/CLPEVChargerEcoCharge/GetSuccessfulCaseByItemId?itemId=' + itemId + '&lang=' + lang,
                dataType: 'json',
                cache: false,
                async: false,
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    if (data.length !== 0 && jqXHR.readyState == 4) {
                        // console.log(data)
                        var case_details = data.successfulCaseResult
                        $(".case__title").html(case_details.ContentAbstract);
                        $("title").text(pt+case_details.Title);
                        $(".case__content").html(case_details.Content);
                        var bannerHtml = "";
                        $.each(case_details.BannerList,
                            function(index, news_banner) {
                                var itemhtml = "<div class=\"newspaper__slide\"><img src=\"" + news_banner.ImgUrl + "\" alt=\"\"></div>";
                                bannerHtml = bannerHtml + itemhtml;

                            });
                        $(".case__slideshow").html(bannerHtml);
                    }
                    // article.articlegallery()
                },

                error: function(xhr, textStatus, errorThrown) {
                    console.log('Please refresh the page and try again')
                }
            }).then(
                settitle(),
                setTimeout(function() {
                    layout.content_padding()
                },100),
                _tag.dcsCollect()

            );
        } catch (err) {
            console.log(err)
        }
    }
}