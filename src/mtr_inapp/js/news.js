$(document).ready(function() {
    $(".item--news",".main-header .mainmenu .list").addClass("on");
    if ($(".page.howtocharge")) {
        howtocharge.init();
    }
    settitle();
})

var howtocharge = {
    init: function() {
        howtocharge.loadNews();
        howtocharge.howtocharge_howto();
    },
    howtocharge_howto: function() {
        $('.slider', '.howtocharge__howto').slick();
    },
    loadNews: function() {
        try {
            $(".newslist__inner").html("");
            var html = "";
            var lang = $("html").attr("lang");
            $.ajax({
                type: 'GET',
                url: apibase() + '/api/CLPEVChargerNews/GetNewsList'
                + '?' +'lang='+ lang,

                dataType: 'json',
                cache: false,
                async: false,
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    if (data.length !== 0 && jqXHR.readyState == 4) {
                        var news_total = data.totalSearchResult
                        var news_details = data.newsResult
                        $.each(news_details,
                            function(index, news_details) {

                                var itemhtml = "<div class=\"item\">" +
                                    "<div class=\"date\">" + news_details.Time + "</div>" +
                                    "<div class=\"title\">" +
                                    "<a href=\"/ev/"+ lang +"/article.html?itemid=" + news_details.ItemId + "\">" + news_details.Title + "</a>" +
                                    "</div>" +
                                    "</div>";
                                html = html + itemhtml;

                            });
                    }
                },

                error: function(xhr, textStatus, errorThrown) {
                    console.log('Please refresh the page and try again')
                }
            }).then(
                settitle(),
                setTimeout(function() {
                    layout.content_padding()
                },100)

            );
            $(".newslist__inner").html(html);
        } catch (err) {
            console.log(err)
        }
    }
}
