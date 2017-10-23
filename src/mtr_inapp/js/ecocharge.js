(function($, _, common) {
    this.ecocharge = {
        init_load: function() {

        },
        init_docready: function() {

            // ecocharge.docdownloadtable();
        },
        docdownloadtable: function() {
            $(".docdownloadtable__td", ".ecochargefeature--04").mCustomScrollbar();

        },
        featureflow: function() {

            $(".featureflow").slick(ecocharge.featureflowslickOption);
        },
        featurecase: function() {

            $(".featurecase").slick(ecocharge.featurecaseslickOption);
        },

        initscroll: function() {
            if (location.hash.length != 0 && $(location.hash).length != 0)  {
                window.setTimeout(offsetAnchor, 1);

                function offsetAnchor() {
                    if (location.hash.length != 0) {
                        var _name = location.hash;

                        $('html, body').animate({
                            scrollTop: $(_name).offset().top - 100
                        }, 500);

                        // $.scrollTo($('#myDiv'), 1000);
                    }
                }

                window.addEventListener("hashchange", offsetAnchor);
            }

            //

        },

        featureflowslickOption: {
            dots: false,
            infinite: false,
            arrows: false,
            draggable: true,
            swipe: true,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            centerMode: false,
            // centerPadding: '60px',
            responsive: [{
                breakpoint: 760,
                settings: {
                    dots: true,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                }
            }]
        },
        featurecaseslickOption: {
            dots: false,
            infinite: false,
            arrows: false,
            draggable: true,
            swipe: true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            centerMode: false,
            slidesPerRow: 1,
            rows: 1,
            // centerPadding: '60px',
            responsive: [{
                breakpoint: 760,
                settings: {
                    dots: true,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                }
            }]

        },
        apibase: '',
        loadPage: function() {
            try {
                $(".page-title .text").html("");
                var lang = $("html").attr("lang");
                $.ajax({
                    type: 'GET',
                    url: apibase() + '/api/CLPEVChargerEcoCharge/GetPage' +
                        '?' + 'lang=' + lang,
                    dataType: 'json',
                    cache: false,
                    timeout: 10000,
                    success: function(data, textStatus, jqXHR) {
                        if (data.length !== 0 && jqXHR.readyState == 4) {
                            //console.log(data);
                            $(".page-title .text").html(data.Title);
                            $("#ecochargefeature").html("");
                            $.each(data.SectionList,
                                function(index, section) {
                                    if (section == "Promotion") {
                                        ecocharge.loadPromotion();
                                    } else if (section == "Successful Case") {
                                        ecocharge.loadSuccessfulCase();
                                    } else if (section == "Application Workflow") {
                                        ecocharge.loadApplicationWorkflow();
                                    } else if (section == "Document Download") {
                                        ecocharge.loadDocumentDownload();
                                    }
                                });
                        }
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Please refresh the page and try again')
                    }
                });
                ecocharge.initscroll()
            } catch (err) {
                console.log(err)
            }
        },
        loadPromotion: function() {
            try {
                var promationHtml = "";
                var lang = $("html").attr("lang");
                $.ajax({
                    type: 'GET',
                    url: apibase() + '/api/CLPEVChargerEcoCharge/GetPromotion' +
                        '?' + 'lang=' + lang,
                    dataType: 'json',
                    cache: false,
                    async: false,
                    timeout: 10000,
                    success: function(data, textStatus, jqXHR) {
                        if (data.length !== 0 && jqXHR.readyState == 4) {
                            var result = data.promotionResult
                            promationHtml = "<a class=\"anchor\"  id=\"eco_charge\" ></a>" +
                                "<div class=\"ecochargefeature ecochargefeature--01 odd\" style=\"background-image:url(" +
                                result.Image +
                                ")\">" +
                                " <div class=\"ecochargefeature__inner\">" +
                                " <div class=\"featuretitle\">" +
                                result.Title +
                                "</div>" +
                                "<div class=\"featurecontent\">" +
                                result.Content +
                                "</div>" +
                                " <div class=\"featurehero\"><img src=\"" +
                                result.ImageM +
                                "\" alt=\"\"></div>" +
                                "</div>" +
                                "</div>";

                        }
                    },

                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Please refresh the page and try again')
                    }
                });
                $("#ecochargefeature").append(promationHtml);
                ecocharge.initscroll()
            } catch (err) {
                console.log(err)
            }
        },
        loadSuccessfulCase: function() {
            try {
                var successfulCaseListHtml = "";
                var lang = $("html").attr("lang");
                $.ajax({
                    type: 'GET',
                    url: apibase() + '/api/CLPEVChargerEcoCharge/GetSuccessfulCaseList' +
                        '?' + 'lang=' + lang,
                    dataType: 'json',
                    cache: false,
                    async: false,
                    timeout: 10000,
                    success: function(data, textStatus, jqXHR) {
                        if (data.length !== 0 && jqXHR.readyState == 4) {
                            var result = data.successfulCaseListResult;
                            if (IsNull(result.CaseList)) {
                                successfulCaseListHtml =
                                    "<div class=\"ecochargefeature ecochargefeature--02  \"  style=\"background-image:url(" +
                                    result.Image +
                                    ")\">" +
                                    "<div class=\"ecochargefeature__inner\">" +
                                    " <div class=\"featuretitle\">" +
                                    result.Title +
                                    "</div>" +
                                    "<div class=\"featurecontent\">" +
                                    result.Content +
                                    "</div>" +
                                    "<div class=\"featurehero\"><img src=\"" +
                                    result.ImageM +
                                    "\" alt=\"\"></div>" +
                                    "</div>" +
                                    "</div>";
                            } else {
                                successfulCaseListHtml =
                                    "<a class=\"anchor\"  id=\"successful_case\" ></a>" +
                                    "<div class=\"ecochargefeature ecochargefeature--02  \">" +
                                    "<div class=\"ecochargefeature__inner\">" +
                                    "<div class=\"featuretitle   \">" +
                                    result.Title +
                                    "</div>" +
                                    "<div class=\"featurecase\">";
                                $.each(result.CaseList,
                                    function(index, successfulcase) {
                                        successfulCaseListHtml += "<div class=\"successfulcase\">" +
                                            "<div class=\"successfulcase__title\">" + successfulcase.Title + "</div>" +
                                            "<div class=\"successfulcase__des\">" + successfulcase.ListAbstract + "</div>" +
                                            "<div class=\"successfulcase__btns\"><a href=\"/ev/" + lang + "/case.html?itemid=" + successfulcase.ItemId + "\">"+(lang=="zh"?"了解更多":"More Details")+"</a></div>" +
                                            "</div>";
                                    });
                                successfulCaseListHtml = successfulCaseListHtml +
                                    "</div>" +
                                    "<div class=\"featurehero\"><img src=\"" + result.ImageM + "\" alt=\"\"></div> " +
                                    "</div>" +
                                    "</div>";

                            }
                        }
                    },

                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Please refresh the page and try again')
                    }
                });
                $("#ecochargefeature").append(successfulCaseListHtml);
                ecocharge.initscroll()
            } catch (err) {
                console.log(err)
            }
        },
        loadApplicationWorkflow: function() {
            try {
                var applicationWorkflowHtml = "";
                var lang = $("html").attr("lang");
                $.ajax({
                    type: 'GET',
                    url: apibase() + '/api/CLPEVChargerEcoCharge/GetApplicationWorkflow' +
                        '?' + 'lang=' + lang,
                    dataType: 'json',
                    cache: false,
                    async: false,
                    timeout: 10000,
                    success: function(data, textStatus, jqXHR) {
                        if (data.length !== 0 && jqXHR.readyState == 4) {
                            var result = data.applicationWorkflowResult;
                            //console.log(result);
                            applicationWorkflowHtml =
                                "<a class=\"anchor\"  id=\"application_workflow\" style=\"background-image:url(" +
                                result.Image +
                                ")\"></a>" +
                                "<div class=\"ecochargefeature ecochargefeature--03 odd \">" +
                                "<div class=\"ecochargefeature__inner\">" +
                                "<div class=\"featuretitle\">" +
                                result.Title +
                                "</div>" +
                                "<div class=\"featureflow\">";

                            $.each(result.WorkflowList,
                                function(index, applicationWorkflow) {
                                    applicationWorkflowHtml += "<div class=\"step step0" + index + "\">" +
                                        "<div class=\"step__icon\">" +
                                        "<img src=\"" + applicationWorkflow.Icon + "\" alt=\"\">" +
                                        "</div>" +
                                        "<div class=\"step__title\">" + applicationWorkflow.Name + "</div>" +
                                        "<div class=\"step__content\">" + applicationWorkflow.Content + "</div>" +
                                        "</div>";

                                });

                            applicationWorkflowHtml = applicationWorkflowHtml +
                                "</div>" +
                                "</div>" +
                                "</div>";

                            ecocharge.featurecase();

                        }
                    },

                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Please refresh the page and try again')
                    }
                });
                $("#ecochargefeature").append(applicationWorkflowHtml);
                ecocharge.featureflow();
                ecocharge.initscroll()
            } catch (err) {
                console.log(err)
            }
        },
        loadDocumentDownload: function() {
            try {
                var documentDownloadHtml = "";
                var lang = $("html").attr("lang");
                $.ajax({
                    type: 'GET',
                    url: apibase() + '/api/CLPEVChargerEcoCharge/GetDocumentDownload' +
                        '?' + 'lang=' + lang,
                    dataType: 'json',
                    cache: false,
                    async: false,
                    timeout: 10000,
                    success: function(data, textStatus, jqXHR) {
                        if (data.length !== 0 && jqXHR.readyState == 4) {
                            var result = data.documentDownloadResult;

                            documentDownloadHtml = "<a class=\"anchor\"  id=\"document_download\" ></a>" +
                                "<div class=\"ecochargefeature ecochargefeature--04 even\" style=\"background-image:url(" +
                                result.Image +
                                ")\">" +
                                "<div class=\"ecochargefeature__inner\">" +
                                " <div class=\"featuretitle\">" +
                                result.Title +
                                "</div>" +
                                "<div class=\"featurecontent\">" +
                                result.Content +
                                "</div>" +
                                "<div class=\"featureaction\">" +
                                "<div class=\"docdownloadtable\">" +
                                "<div class=\"docdownloadtable_inner\">" +
                                "<div class=\"docdownloadtable__th \">" +
                                "<div class=\"docdownloadtable__th__row\">" +
                                "<div class=\"th__col col-date\">" +
                                (lang == "zh"? "日期":"Date") +
                                "</div>" +
                                "<div class=\"th__col col-title\">" +
                                (lang == "zh"? "標題":"Title") +
                                "</div>" +
                                "<div class=\"th__col col-download\">" +
                                (lang == "zh"? "下載":"Download") +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div class=\"docdownloadtable__td\">";
                            $.each(result.DocumentList,
                                function(index, doc) {
                                    documentDownloadHtml += "<div class=\"docdownloadtable__td__row\">" +
                                        "<div class=\"td__col col-date\">" +
                                        "<span>" +
                                        doc.Time +
                                        "</span>" +
                                        "</div>" +
                                        "<div class=\"td__col col-title\">" +
                                        "<span>" +
                                        doc.Title +
                                        "</span>" +
                                        "</div>" +
                                        "<div class=\"td__col col-download\">" +
                                        "<a href=\"" +
                                        doc.FileUrl +
                                        "\" target=\"_blank\"><span class=\"downloadicon\"></span></a>" +
                                        "</div>" +
                                        "</div>";
                                });
                            documentDownloadHtml = documentDownloadHtml + "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";

                        }

                    },

                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Please refresh the page and try again')
                    }
                });
                //console.log(documentDownloadHtml)
                $("#ecochargefeature").append(documentDownloadHtml);
                ecocharge.docdownloadtable()
                ecocharge.initscroll()
            } catch (err) {
                console.log(err)
            }
        }

    }
    return ecocharge;
})(jQuery, _, this.common);

function IsNull(data) {
    return (data == "" || data == undefined || data == null || data == {} || data == []) ? true : false;
}

//DOM Ready
jQuery(function() {
    $(".item--ecocharge", ".main-header .mainmenu .list").addClass("on");
    ecocharge.init_docready();
    settitle();
    ecocharge.init_load();
    ecocharge.loadPage()
})
jQuery(window).load(

    // ecocharge.init_docready()
);