// page article
// newspaper
// newspaper__slideshow
// newspaper__slide

$(document).ready(function() {
    article.init();
    $(".item--news", ".main-header .mainmenu .list").addClass("on");
})

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
    var r = window.location.search.substr(1).match(reg); //ƥ��Ŀ�����
    if (r != null) return decodeURIComponent(r[2]);
    return null; //���ز���ֵ
}

var article = {
    init: function() {
        article.loadNewsDetails();
        article.articlegallery();

    },
    articlegallery: function() {

        var articleslickOption = {
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
        $('.newspaper__slideshow', '.newspaper').slick(articleslickOption);

    },
    loadNewsDetails: function() {
        var itemId = getUrlParam('itemid');
        var lang = $("html").attr("lang");
        var pt="EV - Latest News - ";
		if(lang=="zh"){
			pt="電動車 – 最新消息 - ";
		}
        try {
            // $(".newslist__inner").html("");

            $.ajax({
                type: 'GET',
                url: apibase() + '/api/CLPEVChargerNews/GetNewsByItemId?itemId=' + itemId + "&lang=" + lang,
                dataType: 'json',
                cache: false,
                async: false,
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    if (data.length !== 0 && jqXHR.readyState == 4) {
                        var news_details = data.newsResult
                        $(".newspaper__title").html(news_details.Abstract);
                        $("title").text(pt + news_details.Title);
                        $(".newspaper__content").html(news_details.Content);
                        var bannerHtml = "";
                        $.each(news_details.BannerList,
                            function(index, news_banner) {
                                var itemhtml = "<div class=\"newspaper__slide\"><img src=\"" + news_banner.ImgUrl + "\" alt=\"\"></div>";
                                bannerHtml = bannerHtml + itemhtml;

                            });
                        $(".newspaper__slideshow").html(bannerHtml);
                    }
                    // article.articlegallery()
                },

                error: function(xhr, textStatus, errorThrown) {
                    console.log('Please refresh the page and try again')
                }
            }).then(settitle(),
            _tag.dcsCollect());
        } catch (err) {
            console.log(err)
        }
    }

}