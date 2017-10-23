(function($) {
    var project_states = ['html', 'style', 'functional', 'production']
    var project_state = project_states[1]

    this.common = {
        init: function() {
            common.checkmap()
            common.mediacheck()
            common.sizecheck()
            common.loadLang()
            BrowserDetect.init()
            common.form()
            common.touchcheck()
            common.popup()
            common.feedback()

            common.phase()
            common.uacheck()
            $('.popup').modal()
            $('.popup-video').modalVideo()

        },

        uacheck: function() {

        },

        phase: function() {
            $('html').addClass('phase2')
        },

        inappstatus: false,

        checkinapp: function() {
            var inapp = common.cookieGet('inapp')

            if (common.checkparam("inapp") != "") {
                if (common.getparamvalue('inapp') == 'true') {
                    common.setasinapp('true')
                    // common.setasinapp('false')
                } else if (common.getparamvalue('inapp') == 'false') {
                    common.setasnotinapp('true')
                    // common.setasnotinapp('false')
                }
            } else if (inapp.length > 0) {
                if (inapp == 'true') {

                    common.setasinapp('false')
                } else if (inapp == 'false') {
                    common.setasnotinapp('false')
                }
            } else {
                common.setasnotinapp('false')
            }
        },
        setasinapp: function(setcookie) {
            common.cookiesDelete('inapp')
            $('html').addClass('inapp')
            $('html').removeClass('notinapp')
            layout.init()
            // layout.content_padding()
            common.inappinit()
            setTimeout(function() {

                // layout.content_padding();
                $(window).trigger("resize")
            }, 10)
            if (setcookie == 'true') {

                common.cookieSet('inapp', 'true', 360)
            }
            common.inappstatus = true
        },
        setasnotinapp: function(setcookie) {
            common.cookiesDelete('inapp')
            $('html').removeClass('inapp')
            $('html').addClass('notinapp')
            layout.init()
            setTimeout(function() {
                // layout.content_padding();
                $(window).trigger("resize")
            }, 10)
            if (setcookie == 'true') {

                common.cookieSet('inapp', 'false', 360)
            }

            common.inappstatus = false
        },

        inappinit: function() {
            var refit = function() {
                var _uiheight = $('.page-title').outerHeight() + $('.mobile_main-header ').outerHeight() + $('.inappfootermenu').outerHeight() + $('.map-search').outerHeight()
                var _mapheight = $(window).height() - _uiheight
                $('#map').css('height', _mapheight)
            }

            setTimeout(function() {
                refit()
            }, 10)
            $(window).on('resize', function() {
                refit()
            })

            if ($('.inapphome').length) {

                $('.inappnevgate .btn_back').attr('disable', 'disable')
            }

        },

        loaded: function(selector, callback) {
            // trigger after page load.
            jQuery(function() {
                callback(jQuery(selector))
            })
            // trigger after page update eg ajax event or jquery insert.
            jQuery('body').on('DOMNodeInserted', selector, function(e) {
                callback(jQuery(this))
            })
        },

        feedback: function() {
            if ($('.feedbackBlock').length) {
                $('.stars').on('click',
                    '.star',
                    function() {
                        $('.stars .star').removeClass('on')
                        // $(this).addClass("on")

                        for (var i = 0; i < $(this).index() + 1; i++) {
                            $('.stars .star').eq(i).addClass('on')
                        }

                        var _rate = $(this).index() + 1

                        $("input[name='rate']", '.feedbackBlock').val(_rate)

                        $('.next[disabled]').removeAttr('disabled')
                        $('.next:not([disabled])').one('click',
                            function() {
                                LoadFeedback()
                                $(this).hide()
                                $('#feedback_survey').show()

                                $('.stars .star').css('pointer-events', 'none')
                            })
                    })

                $('.stars').on('mouseover',
                    '.star',
                    function() {
                        $('.stars .star').removeClass('on')
                        // $(this).addClass("on")

                        for (var i = 0; i < $(this).index() + 1; i++) {
                            $('.stars .star').eq(i).addClass('on')
                        }

                        var _rate = $(this).index() + 1
                        $("input[name='rate']", '.feedbackBlock').val(_rate)
                    })

                $('.triggerlabel', '.feedbackBlock').on('click',
                    function() {
                        $('.feedbackBlock').toggleClass('on')
                        $('html').addClass('feedbackform_on')
                    })

                $('.cross', '.feedbackBlock').on('click',
                    function() {
                        resetfeedback()
                    })
            }
        },
        checkparam: function(param) {
            var _param = param

            var url_string = document.location.href
            var matchcount = url_string.match(_param)
            // console.log(_param, url_string, matchcount)

            if (matchcount != null || undefined || '') {
                if (matchcount.index != -1) {
                    return true
                } else {
                    return false
                }
            } else {
                return ''
            }
        },
        getparamvalue: function(param) {
            var _param = param
            if (common.checkparam(_param)) {

                _param = _param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + _param + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

            } else {
                return ''
            }
        },
        checkandget_height: function(t) {
            var _t = t
            if (_t.length > 0) {
                return _t.outerHeight()
            } else {
                return 0
            }
        },
        popup: function() {

            $('#pininfoBox').off('click').on('click',
                '.cross',
                function() {
                    $(this).closest('#pininfoBox').removeClass('on')

                    $('html').removeClass('pinpopupon')
                })
            $('.global_map-search').off('click').on('click',
                '.cross',
                function() {
                    $(this).closest('.global_map-search').removeClass('on')

                    $('html').removeClass('searchpopupon')
                })
        },
        touchcheck: function() {
            $('html').addClass('no-touch')
            window.addEventListener('touchstart',
                function onFirstTouch() {
                    $('html').addClass('touch')
                    $('html').removeClass('no-touch')
                    window.USER_IS_TOUCHING = true

                    window.removeEventListener('touchstart', onFirstTouch, false)
                },
                false)
        },
        form: function() {
            if ($('select', '.main-container')) {
                $('select').selectBoxIt({
                    autoWidth: false,
                    copyClasses: 'container'
                })
            }
            if ($('.tooltip', '.main-container')) {
                var tooltipsOptions = {
                    theme: ['tooltipster-shadow', 'tooltipster-noir-shadow']
                }
                $('.tooltip').tooltipster(tooltipsOptions)
            }

            if ($('input').length) {
                $('input').iCheck({
                    handle: 'checkbox'
                }).on('ifChanged',
                    function(e) {
                        $(e.target).trigger('change')
                    })
                $('input').placeholder()
            }
        },
        sizecheck: function() {

            window.viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            window.viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        },
        mediacheck: function() {
            var $desktop = '(min-width: 992px )'
            var $tablet_below = '(max-width: 991.9px )'
            var $tablet = '(min-width: 768px ) and (max-width: 991.9px )'
            var $mobile = '(min-width: 576px ) and (max-width: 767.9px )'
            var $s_mobile = '(max-width: 575.9px)'

            $('html').removeClass('desktop')
            $('html').removeClass('tablet')
            $('html').removeClass('mobile')
            $('html').removeClass('s_mobile')

            if (window.matchMedia($desktop).matches) {
                $('html').addClass('desktop')
                return 'desktop'
            } else {
                $('html').removeClass('desktop')
            }
            if (window.matchMedia($tablet).matches) {
                $('html').addClass('tablet')
                return 'tablet'
            } else {
                $('html').removeClass('tablet')
            }
            if (window.matchMedia($mobile).matches) {
                $('html').addClass('mobile')
                return 'mobile'
            } else {
                $('html').removeClass('mobile')
            }
            if (window.matchMedia($s_mobile).matches) {
                $('html').addClass('s_mobile')
                return 's_mobile'
            } else {
                $('html').removeClass('s_mobile')
            }
        },
        cookieGet: function(name) {
            var i, x, y, ARRcookies = document.cookie.split(';')
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='))
                y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1)
                x = x.replace(/^\s+|\s+$/g, '')
                if (x == name) {
                    return decodeURI(y)
                }
            }
            return ''
        },
        cookieSet: function(name, value, exdays) {
            // console.log('cookieSet')
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + exdays)
            var c_value = encodeURI(value) + ((exdays = null) ? '' : '; expires=' + exdate.toUTCString() + '; path=/')
            document.cookie = name + '=' + c_value
        },
        cookieGet_obj: function(name) {
            // for get the cookie
            // console.log('cookieGet: ' + name)
            var i, x, y, ARRcookies = document.cookie.split(';')
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='))
                y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1)
                x = x.replace(/^\s+|\s+$/g, '')
                if (x == name) {
                    return decodeURI(y)
                }
            }
            return ''
        },
        cookieSet_obj: function(name, value, exdays) {
            // console.log('cookieSet')
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + exdays)
            var cookie = [
                name, '=', JSON.stringify(encodeURI(value)), '; expires=',
                ((exdays = null) ? '' : exdate.toUTCString()), '; domain=.', window.location.host.toString(),
                '; path=/;'
            ].join('')
            document.cookie = cookie
        },

        cookiesDelete: function delete_cookie(name) {
            document.cookie = [
                name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()
            ].join('')
        },

        checkmap: function() {
            if ($('.map').length) {
                $('html').addClass('hasMap')
                if ($('.home').length) {
                    $('html').addClass('hasMap--nofilter')
                } else {
                    $('html').addClass('hasMap--withfilter')
                }
            } else {
                $('html').addClass('noMap')
            }
        },

        initLang: function() {
            common.cookieSet('lang', $('html').attr('lang'), 5)
        },
        loadLang: function() {
            return $('html').attr('lang')
            // var currentLang = common.cookieGet('lang')
            // if (currentLang.length == -1 ||
            //     currentLang != -1 && currentLang != 'en' && currentLang != 'zh' && currentLang != 'sc') {
            //     return common.initLang()
            // } else {
            //     return currentLang
            // }
        },
        chLang: function(lang) {
            var currentPath = location
                .href
                .toString()
            var switchZh = '/zh/'
            var switchEn = '/en/'
            var switchSc = '/sc/'
            lang = '/' + lang + '/'
            switch (lang) {
                case '/en/':
                    // common.cookieSet('lang', 'en', 5)
                    currentPath = currentPath.replace(switchZh, switchEn)
                    currentPath = currentPath.replace(switchSc, switchEn)
                    // create a lang cookie as en for 5 days
                    break
                case '/zh/':
                    // common.cookieSet('lang', 'zh', 5)
                    currentPath = currentPath.replace(switchEn, switchZh)
                    currentPath = currentPath.replace(switchSc, switchZh)
                    break
                case '/sc/':
                    // common.cookieSet('lang', 'sc', 5)
                    currentPath = currentPath.replace(switchZh, switchSc)
                    currentPath = currentPath.replace(switchEn, switchSc)
                    break
                default:
            }

            document.location = currentPath
        },
        deleteAllCookies: function() {
            var cookies = document.cookie.split(';')

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i]
                var eqPos = cookie.indexOf(' = ')
                var name = eqPos > -1 ?
                    cookie.substr(0, eqPos) : cookie
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
            }
        },

        // #############################
        // HASHING
        // #############################

        // http://localhost:3000/en/index.html?view=map&pin=54b61096-00ac-4260-86d9-b9ce21519b77
        hashInitiate: function() {
            console.log('hashInitiate')
            var self = this
            if (window.location.hash) {
                self.hashGet()
                self.searchFromHash()
                self.filterFromHash()
            }

            $(window).on('hashchange', function() {
                if (window.location.hash) {
                    self.hashGet()
                    if (self.hashBeingSet) {
                        self.hashBeingSet = false
                    } else {
                        self.searchFromHash()
                        self.filterFromHash()
                    }
                }
            })
        },
        hashSet: function() {
            // console.log('hashSet')
            var self = this
            self.hashBeingSet = true
            var filters = ''
            var comma = ','
            for (var i = 0; i < self.filterArray.length; i++) {
                if (i !== self.filterArray.length - 1) {
                    filters += String(self.filterArray[i]) + comma
                } else {
                    filters += String(self.filterArray[i])
                }
            }

            var height
            if (self.filterHeightLimit !== 99 && self.filterHeightLimit !== 0) {
                height = String(self.filterHeightLimit)
                height = height.replace('.', '-')
            } else {
                height = ''
            }

            if (isNaN(self.searchDistrictRegion)) {
                self.searchDistrictRegion = ''
            }

            if (isNaN(self.searchDistrictValue)) {
                self.searchDistrictValue = ''
            }

            var params = ''
            if (self.searchDistrictRegion || self.searchDistrictValue) {
                params += 'r=' + self.searchDistrictRegion + '&d=' + self.searchDistrictValue
            }

            if (self.searchMethod || self.searchValue) {
                if (params) {
                    params += '&'
                }
                params += 'm=' + self.searchMethod + '&v=' + self.searchValue
            }

            if (filters) {
                if (params) {
                    params += '&'
                }
                params += 'f=' + filters
            }

            if (height) {
                if (params) {
                    params += '&'
                }
                params += 'h=' + height
            }

            params = encodeURI(params)

            history.replaceState(undefined, undefined, '#' + params)
        },
        hashGet: function() {
            console.log('hashGet')
            var self = this
            var hash = window.location.hash

            if (hash) {
                self.hashString = decodeURI(hash).split('#')[1]
            } else {
                return
            }

            var hashParams = self.hashString.split('&')
            self.hashArray = []

            for (var i = 0; i < hashParams.length; i++) {
                var arrKey = hashParams[i].split('=')
                var arrValue = arrKey[1]
                switch (arrKey[0]) {
                    case 'r':
                        self.searchDistrictRegion = arrValue
                        break
                    case 'd':
                        self.searchDistrictValue = arrValue
                        break
                    case 'm':
                        self.searchMethod = arrValue
                        break
                    case 'v':
                        self.searchValue = arrValue
                        break
                    case 'h':
                        arrValue = arrValue.replace('-', '.')
                        break
                }
                self.hashArray.push([arrKey[0], arrValue])
            }
        },
        hashClear: function() {
            console.log('hashClear')
            self.searchDistrictRegion = ''
            self.searchDistrictValue = ''
            self.searchMethod = ''
            self.searchValue = ''
            self.hashBeingSet = true
            window.location.hash = '#'
        },
        currentlatlng: '',

        geoSuccess: function(position) {
            userposition = position
            common.userlat = userposition.coords.latitude
            common.userlong = userposition.coords.longitude
            common.currentlatlng = common.userlat + ',' + common.userlong
        },
        geoError: function(error) {
            console.log('geoError occurred. Error code: ' + error.code)
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from location provider)
            //   3: timed out
        },
        getUserGeo: function() {
            if ($('.page.charginglocation').length > 0 || $('.page.home').length > 0) {
                navigator.geolocation.getCurrentPosition(common.geoSuccess, common.geoError)
            }
        },

        sethistory: function(name) {},

        // cookieGet: function() {},
        // cookieSet: function() {},
        inithistory: function() {
            common.loadhistory()
            console.log('loadhistory')
        },
        loadhistory: function() {
            common.markerhistorylist = common.cookieGet_obj('markerhistory')
            common.appendhistory(common.markerhistorylist)
            // return common.markerhistorylist
        },

        // addhistory: function(markerid) {
        //     var _list = markerhistorylist

        //     _list.unshift(markerid)
        //     _list.splice(-1, 1)

        //     function userConstructor(id1, id2, id3) {
        //         // ... your code
        //         this.records = function() {
        //             return
        //             common.markerhistorylist = [id1, id2, id3]
        //         }
        //     }
        // },
        appendhistory: function(list) {

            // var mydata = JSON.parse(read_cookie('myinstances'))
            // new userConstructor(mydata.name, mydata.street, mydata.city)
        },
        markerhistorylist: []

    }

    return common
})(jQuery)

;
(function($, common) {
    this.BrowserDetect = {
        init: function() {
            this.browser = this.searchString(this.dataBrowser) || 'Other'
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown'

            switch (BrowserDetect.browser) {
                case 'MS Edge':
                    $('html').addClass('edge')
                    break
                case 'Explorer':
                    $('html').addClass('ie')
                    break
                case 'Firefox':
                    $('html').addClass('firefox')
                    break
                case 'Opera':
                    $('html').addClass('opera')
                    break
                case 'Chrome':
                    $('html').addClass('chrome')
                    break
                case 'Safari':
                    $('html').addClass('safari')

                    break
                default:
            }
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string
                this.versionSearchString = data[i].subString

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity
                }
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString)
            if (index === -1) {
                return
            }

            var rv = dataString.indexOf('rv:')
            if (this.versionSearchString === 'Trident' && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3))
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1))
            }
        },

        dataBrowser: [{
                string: navigator.userAgent,
                subString: 'Edge',
                identity: 'MS Edge'
            },
            {
                string: navigator.userAgent,
                subString: 'MSIE',
                identity: 'Explorer'
            },
            {
                string: navigator.userAgent,
                subString: 'Trident',
                identity: 'Explorer'
            },
            {
                string: navigator.userAgent,
                subString: 'Firefox',
                identity: 'Firefox'
            },
            {
                string: navigator.userAgent,
                subString: 'Opera',
                identity: 'Opera'
            },
            {
                string: navigator.userAgent,
                subString: 'OPR',
                identity: 'Opera'
            },

            {
                string: navigator.userAgent,
                subString: 'Chrome',
                identity: 'Chrome'
            },
            {
                string: navigator.userAgent,
                subString: 'Safari',
                identity: 'Safari'
            }
        ]
    }
    return BrowserDetect
})(jQuery, this.common)

;
(function($, common) {
    this.layout = {
        init: function() {
            setTimeout(function() {
                layout.content_padding()
            }, 100)
            layout.mobmenu()
            // layout.popupsetting()
            layout.header()
        },
        header: function() {
            var offclose = function() {
                $('html').removeClass('headersearchport_on').removeClass('headerbookmark_on')

                $('.headersearchport_on').off('click', offclose)
                $('.headerbookmark_on').off('click', offclose)
            }

            var tickonquicksearchdock = function() {
                $('.headersearchport_on').on('click', function() {
                    offclose()
                })
                $('html').removeClass('headerbookmark_on').toggleClass('headersearchport_on')

                $('.quicksearch', '.quickLinkBlock').on('click', function(e) {
                    e.stopPropagation()
                })
                $('.quicksearchport').on('click', function(e) {
                    e.stopPropagation()
                })
                $('.quicksearchdock').on('click', function(e) {
                    e.stopPropagation()
                })

                // $(".quicksearchdock").css("display", "block")

            }

            var tickonbookmarkdock = function() {
                $('.headerbookmark_on').on('click', function() {
                    offclose()
                })
                $('html').removeClass('headersearchport_on').toggleClass('headerbookmark_on')

                $('.bookmark', '.quickLinkBlock').on('click', function(e) {
                    e.stopPropagation()
                })
                $('.bookmarkport').on('click', function(e) {
                    e.stopPropagation();

                })
                $('.bookmarkdock').on('click', function(e) {
                    e.stopPropagation()
                })

                // $(".bookmarkdock").css("display", "block")}} else {

            }
            if (!$('.page.charginglocation').length) {
                $('.quicksearchport .icon').on('click', function() {
                    tickonquicksearchdock()
                })
            }

            if (!$('.page.charginglocation').length) {
                $('.quicksearch', '.quickLinkBlock').on('click', function() {
                    tickonquicksearchdock()
                })
            }

            $('.bookmarkport .icon').on('click', function() {
                tickonbookmarkdock()
            })

            $('.bookmark', '.quickLinkBlock').on('click', function() {
                tickonbookmarkdock()
            })

            $('.cross', '.docks .dock').on('click', function() {
                offclose()
            })

            // $("#evcmap_top",".searchbar").on("focus",function(){$("html").addClass("focustopsearch");$(".quicksearchdock").css("display","block")})
            // $(".quicksearchdock").on("mouseout",function(){$("html").removeClass("focustopsearch");$(".quicksearchdock").removeAttr("style")})
            // $("#evcmap_top",".searchbar").on("blur",function(){$("html").removeClass("focustopsearch");$(".quicksearchdock").removeAttr("style")})

        },
        popupsetting: function() {
            $('.bookmark  ', '.quickLinkBlock').on('click', function() {
                $('html').addClass('searchpopupon')
                $('.map-search  ').addClass('on')
            })
            if ($('.noMap').length || $('.hasMap--nofilter').length) {
                $('.quicksearch', '.quickLinkBlock').on('click', function() {
                    $('html').addClass('searchpopupon')
                    $('.global_map-search').addClass('on')
                })
            }
            $('.map-search  ').on('click', '.cross', function() {
                $('.map-search  ').removeClass('on')
                $('html').removeClass('searchpopupon')
            })
        },

        resetpopup: function() {
            $('html').removeClass('searchpopupon')
            $('html').removeClass('mobilemenuon')

            $('.global_map-search').removeClass('on')
            $('.map-search .upper').removeClass('on')

        },
        content_padding: function() {
            var h = $('.main-header')
            var f = $('.main-footer')
            var b = $('.main-content')
            var mob_h = $('.mobile_main-header')
            var body = $('body')

            var headerHeight = h.outerHeight() > 0 && h.is(':visible') ? h.outerHeight() : (mob_h.outerHeight() > 0 && mob_h.is(':visible') ? mob_h.outerHeight() : 0)
            var footerHeight = f.outerHeight() ? f.outerHeight() : 0
            var mainContent = b

            var contentHeight = $('.main-content__inner', mainContent).outerHeight()
            var spareHeight = window.viewHeight - headerHeight - footerHeight
            if (contentHeight < 0) {
                return
            }

            if (contentHeight < spareHeight && common.inappstatus == false) {
                $('html').addClass('height-stretched')
                body.css({
                    'padding-top': headerHeight + 'px ',
                    'padding-bottom': footerHeight + 'px'
                })
            } else {
                $('html').removeClass('height-stretched')
                body.css({
                    'padding-top': headerHeight + 'px ',
                    'padding-bottom': 0 + 'px'
                })

                if (common.inappstatus == true && $('.inappfootermenu').length > 0) {
                    var _pb = $('.inappfootermenu').outerHeight()
                    body.css({
                        'padding-top': headerHeight + 'px ',
                        'padding-bottom': _pb
                    })
                }
            }
        },

        mobmenu: function() {
            layout.mobmenuinit()
            $('.switcher', '.mobile_main-header').on('click', function() {
                $('html').addClass('mobilemenuon')
                if ($('.pinpopupon').length && $('#pininfoBox').length) {
                    $('.cross', '#pininfoBox').click()
                }
            })
            $('.undernear', '.mobile_main-menu').on('click', function() {
                $('html').removeClass('mobilemenuon')
            })
        },
        mobmenuinit: function() {
            $('html').removeClass('mobilemenuon')

            $('.lower', '.mobile_main-menu_inner').mCustomScrollbar()
        }
    }
    return layout
})(jQuery, this.common)

// DOM Ready
jQuery(function() {
        if ($('.map__charginglocation').length > 0) {
            var cp = common.cookieGet('clp_charginglocationpage')
            if (cp != 'charginglocation') {
                common.cookieSet('mapview', 'map', 1)
            }
            common.cookieSet('clp_charginglocationpage', 'charginglocation', 1)
        } else if ($('.map__availabilityofcharginglocation').length > 0) {
            var cp = common.cookieGet('clp_charginglocationpage')
            if (cp != 'availabilityofcharginglocation') {
                common.cookieSet('mapview', 'map', 1)
            }
            common.cookieSet('clp_charginglocationpage', 'availabilityofcharginglocation', 1)
        } else if ($('.inapphome').length > 0) {
            LoadRecommendedChargingLocations(false)
        }

        BrowserDetect.init()
        common.init()
        // layout.init()

        LoadChargerHistory()
        LoadChargerBookmark()

        if ($('.map__charginglocation').length > 0) {
            clpmap.loadAllPinData()

            var provider = getUrlParam('provider')
            var chargerType = getUrlParam('chargerType')
            var district = getUrlParam('district')
            var availability = getUrlParam('status')
            var lat = getUrlParam('lat')
            var lng = getUrlParam('lng')
            var itemId = getUrlParam('itemId')
            var address = getUrlParam('address')
            if ((provider != '0' || chargerType != '0' || district != '0' || availability != '0') && !IsNull(provider)) {
                console.log(district)
                $('#sltProvider').data('selectBox-selectBoxIt').selectOption(parseInt(provider))
                $('#sltChargerType').data('selectBox-selectBoxIt').selectOption(parseInt(chargerType))
                $('#sltDistricts').data('selectBox-selectBoxIt').selectOption(parseInt(district))
                $('#sltAvailability').data('selectBox-selectBoxIt').selectOption(parseInt(availability))
                clpmap.isadvancedsearch = true
            } else if (!IsNull(address)) {
                $('#latitude_charginglocation').val(lat)
                $('#longitude_charginglocation').val(lng)
                $('#evcmap_charginglocation').val(address)
                clpmap.isadvancedsearch = true
            } else if (!IsNull(itemId)) {
                clpmap.isadvancedsearch = true
                clpmap.clickhistory = true
            }
        } else if (clpmap.currentpage == 'availabilityofcharginglocation') {
            LoadMapListViewAllCLPData()
        }
    }

)

var _infotext = {
    charginglocation: {
        'en': 'Charging Location',
        'zh': '充電站'
    },
    providedbyclpnotice: {
        'en': 'EV chargers status will not be available for non-CLP EV charger, please contact the related supplier for charging location details.',
        'zh': '非中電提供之充電器並未能提供使用狀況，請向有關之服務提供者查詢充電站詳情。'
    },
    alloutofservice_std: {
        'en': 'All Semi-Quick Charger(s) is/are under maintenance.',
        'zh': '所有中速充電器正暫停使用。'
    },
    alloutofservice_quick: {
        'en': 'All Quick Charger(s) is/are under maintenance.',
        'zh': '所有快速充電器正暫停使用。'
    },
    lastupdatedby: {
        'en': 'Last updated by',
        'zh': '最後更新日期為'
    },
    history: {
        'en': 'History',
        'zh': '歷史'
    },

    addtobookmark: {
        'en': 'Add to Bookmark',
        'zh': '加到書籤'
    },
    getpath: {
        'en': 'Open in google map',
        'zh': '開啟谷歌地圖路徑'
    },
    total: {
        'en': '(Total)',
        'zh': '(總數)'
    },
    stdsemiquickcharge: {
        'en': 'Semi-quick charge',
        'zh': '中速充電器'
    },
    quickcharge: {
        'en': 'Quick charge',
        'zh': '快速充電器'
    },
    occupied: {
        'en': 'Occupied',
        'zh': '使用中'
    },
    statusNotavailable: {
        'en': 'Status Not Available',
        'zh': '未有相關資訊'
    },
    outofservice: {
        'en': 'Out Of Service',
        'zh': '暫停使用'
    },
    recommendedtitle: {
        'en': 'Recommended Charging Location:',
        'zh': '充電站:'
    },

    feedbacktitle: {
        'en': 'Your Feedback',
        'zh': '你的意見'
    },
    feedbackdes: {
        'en': 'We appreciate your feedback which helps us to constantly improve our site. Please rate your experience.',
        'zh': '你的寶貴意見，能讓我們做得更好。請按這次客戶體驗評分：'
    },
    errormessage: {
        'en': 'Something went wrong, please try later',
        'zh': '出了問題, 請稍後再試'
    },
    notfoundmessage: {

        'en': 'Not Found',
        'zh': 'Not Found'
    }

}

var hongkong = new google.maps.LatLng(22.384793, 114.118509)

var clickedMarker = null
var clpmap = {
    initMap: function() {
        if ($('#map').length) {
            clpmap.checkView()
        }
        $('.filter_select', '.map .map-search__search-input').on('click',
            function() {
                clpmap.scrollToMap()
            }
        )
        $('#evcmap_index,#evcmap_index~a,#evcmap_filter,#evcmap_filter~a', '.map').on('focus',
            function() {
                clpmap.scrollToMap()
            })

        if ($('.hasMap--withfilter').length && ($('.quicksearchport').length || $('.quicksearch').length)) {
            $('.quicksearchport ,.quicksearch').off('click').on('click',
                function() {
                    clpmap.scrollToMap()
                    if ($('.popup_map-search').length &&
                        (common.mediacheck() == 'mobile' || common.mediacheck() == 's_mobile')) {
                        $('.popup_map-search').click()
                    } else {
                        var div = $('.searchbar > a')
                        div.stop(true, true).animate({
                            opacity: '1'
                        }, 'fast').animate({
                            opacity: '0.5'
                        }, 'fast').animate({
                            opacity: '1'
                        }, 'fast').animate({
                            opacity: '0.5'
                        }, 'fast').animate({
                            opacity: '1'
                        }, 'fast')
                    }
                })
        }

        if ($('.map__home').length > 0) {
            clpmap.currentpage = 'index'
        } else if ($('.map__charginglocation').length > 0) {
            clpmap.currentpage = 'charginglocation'
        } else if ($('.map__availabilityofcharginglocation').length > 0) {
            clpmap.currentpage = 'availabilityofcharginglocation'
        } else if ($('.inapphome').length > 0) {
            clpmap.currentpage = 'app'
        } else {
            clpmap.currentpage = 'other'
        }
    },
    zoomlevel: {
        lv1: 11,
        lv2: 12,
        lv3: 14,
        lv4: 16
    },
    loadAllPinData: function() {
        LoadMapListViewAllData()
    },
    scrollToMap: function() {
        if (common.mediacheck() == 'desktop') {
            $('html,body').animate({
                    scrollTop: $('.map-search').offset().top - $('.main-header').outerHeight()
                },
                100)
        } else {
            $('html,body').animate({
                    scrollTop: $('.map-search').offset().top - $('.mobile_main-header').outerHeight()
                },
                100)
            // $('body').scrollTop($('.map-search').offset().top - $('.mobile_main-header').outerHeight() - 1)
        }
    },
    bounds: new google.maps.LatLngBounds(),

    maplevel: function() {
        if (clpmap.currentZoom < clpmap.zoomlevel.lv2) {
            return clpmap.zoomdictionary.lv1
        } else if (clpmap.currentZoom < clpmap.zoomlevel.lv3) {
            return clpmap.zoomdictionary.lv2
        } else {
            return clpmap.zoomdictionary.lv3
        }
        // if (clpmap.currentpage == 'availabilityofcharginglocation') {}
    },
    iconBase: '/ev/images/',
    markers: [],
    markerIds: [],
    filter: '',
    searching: false,
    ischeck: false,
    dragging: false,
    hovering: false,
    markerselected: {},
    currentcenter: hongkong,
    currentZoom: 11,
    clickedmarkers: {},
    clickedmarkersprev: {},
    clickhistory: false,
    currentmapview: 'map',
    currentpage: 'index',
    isadvancedsearch: false,
    searchtype: 'map',
    countryRestrict: {
        'country': 'hk'
    },
    checkView: function() {
        clpmap.currentmapview = common.cookieGet('mapview')
        $('html').removeClass('mapview--list').addClass('mapview--map')
        // if (clpmap.currentmapview === 'map') {
        //     $('html').removeClass('mapview--list').addClass('mapview--map')
        //     common.cookieSet('mapview', 'map', 1)
        // } else if (clpmap.currentmapview === 'list') {
        //     $('html').removeClass('mapview--map').addClass('mapview--list')
        //     common.cookieSet('mapview', 'list', 1)
        //     // console.log('mapview--list')
        // } else if (clpmap.currentmapview === undefined) {
        //     clpmap.initView()
        //     common.cookieSet('mapview', 'map', 1)
        //     // console.log('mapview--init')
        // } else {
        //     $('html').removeClass('mapview--list').addClass('mapview--map')
        //     common.cookieSet('mapview', 'map', 1)
        // }
    },
    statusdictionary: {
        available: 'green',
        occupied: 'red',
        notavailable: 'red',
        selected: 'blue',
        statusnotavailable: 'gray',
        outofservice: 'yellow'
    },
    zoomdictionary: {
        lv1: 'district',
        lv2: 'place',
        lv3: 'location',
        lv4: 'slot'

    },
    initView: function() {
        $('html').addClass('mapview--map')
        clpmap.currentmapview = 'map'
    },
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, '\n')
        var utftext = ''
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n)
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192)
                utftext += String.fromCharCode((c & 63) | 128)
            } else {
                utftext += String.fromCharCode((c >> 12) | 224)
                utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                utftext += String.fromCharCode((c & 63) | 128)
            }
        }
        return utftext
    },
    _utf8_decode: function(utftext) {
        var string = ''
        var i = 0
        var c = c1 = c2 = 0
        while (i < utftext.length) {
            c = utftext.charCodeAt(i)
            if (c < 128) {
                string += String.fromCharCode(c)
                i++
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1)
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                i += 2
            } else {
                c2 = utftext.charCodeAt(i + 1)
                c3 = utftext.charCodeAt(i + 2)
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                i += 3
            }
        }
        return string
    },
    toggleMapView: function() {
        if ($('.map', '.page.home').length) {
            $('html').removeClass('mapview--list').addClass('mapview--map')
            common.cookieSet('mapview', 'map', 1)
        } else {
            $('.tomapview', '.viewlist').on('click', function() {
                if ($('.mapview--list').length) {
                    $('html').removeClass('mapview--list').addClass('mapview--map')
                    common.cookieSet('mapview', 'map', 1)
                }
                // google.maps.event.trigger(map, 'resize')
                // map.fitBounds(clpmap.bounds)

            })
            $('.tolistview', '.viewlist').on('click', function() {
                if ($('.mapview--map').length) {
                    $('html').removeClass('mapview--map').addClass('mapview--list')
                    common.cookieSet('mapview', 'list', 1)
                }
                // google.maps.event.trigger(map, 'resize')

            })

            $('.tomapview', '.mapview--list').on('click', function() {
                map.fitBounds(clpmap.bounds)
                google.maps.event.trigger(map, 'resize')
            })
        }
    },
    mapOption: {
        center: hongkong,
        zoom: 11,
        minZoom: 10,
        zoomControl: true,
        mapTypeControl: false,
        scrollwheel: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: [{
                'featureType': 'water',
                'elementType': 'geometry.fill',
                'stylers': [{
                    'color': '#d3d3d3'
                }]
            },
            {
                'featureType': 'transit',
                'stylers': [{
                        'color': '#808080'
                    },
                    {
                        'visibility': 'off'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.stroke',
                'stylers': [{
                        'visibility': 'on'
                    },
                    {
                        'color': '#b3b3b3'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.fill',
                'stylers': [{
                    'color': '#ffffff'
                }]
            },
            {
                'featureType': 'road.local',
                'elementType': 'geometry.fill',
                'stylers': [{
                        'visibility': 'on'
                    },
                    {
                        'color': '#ffffff'
                    },
                    {
                        'weight': 1.8
                    }
                ]
            },
            {
                'featureType': 'road.local',
                'elementType': 'geometry.stroke',
                'stylers': [{
                    'color': '#d7d7d7'
                }]
            },
            {
                'featureType': 'poi',
                'elementType': 'geometry.fill',
                'stylers': [{
                        'visibility': 'on'
                    },
                    {
                        'color': '#ebebeb'
                    }
                ]
            },
            {
                'featureType': 'administrative',
                'elementType': 'geometry',
                'stylers': [{
                    'color': '#a7a7a7'
                }]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.fill',
                'stylers': [{
                    'color': '#ffffff'
                }]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.fill',
                'stylers': [{
                    'color': '#ffffff'
                }]
            },
            {
                'featureType': 'landscape',
                'elementType': 'geometry.fill',
                'stylers': [{
                        'visibility': 'on'
                    },
                    {
                        'color': '#efefef'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text.fill',
                'stylers': [{
                    'color': '#696969'
                }]
            },
            {
                'featureType': 'administrative',
                'elementType': 'labels.text.fill',
                'stylers': [{
                        'visibility': 'on'
                    },
                    {
                        'color': '#737373'
                    }
                ]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.icon',
                'stylers': [{
                    'visibility': 'off'
                }]
            },
            {
                'featureType': 'poi',
                'elementType': 'labels',
                'stylers': [{
                    'visibility': 'off'
                }]
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.stroke',
                'stylers': [{
                    'color': '#d6d6d6'
                }]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.icon',
                'stylers': [{
                    'visibility': 'off'
                }]
            },
            {},
            {
                'featureType': 'poi',
                'elementType': 'geometry.fill',
                'stylers': [{
                    'color': '#dadada'
                }]
            }
        ]
    }

}

function AutoComplete_Top() {
    var autocomplete_top = new google.maps.places.Autocomplete(($('#evcmap_top')[0]), {
        types: ['geocode'],
        componentRestrictions: clpmap.countryRestrict
    })
    return google.maps.event.addListener(autocomplete_top, 'place_changed', function() {
        var geocoder = new google.maps.Geocoder()
        var address = $('#evcmap_top').val()
        geocoder.geocode({
            address: address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var geocenter = results[0].geometry.location
                $('#latitude_top').val(geocenter.lat())
                $('#longitude_top').val(geocenter.lng())
                clpmap.searchtype = 'map'
                SearchCharger_Top();

            } else {
                alert(address + ' not found')
            }
        })
    })
}

function AutoComplete_Indexinapp() {
    var lang = $('html').attr('lang')
    if ($('.inapphome').length > 0) {
        var autocomplete_top = new google.maps.places.Autocomplete(($('#evcmap_indexinapp')[0]), {
            types: ['geocode'],
            componentRestrictions: clpmap.countryRestrict
        })
        return google.maps.event.addListener(autocomplete_top, 'place_changed', function() {
            var geocoder = new google.maps.Geocoder()
            var address = $('#evcmap_indexinapp').val()
            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var geocenter = results[0].geometry.location
                    $('#latitude_indexinapp').val(geocenter.lat())
                    $('#longitude_indexinapp').val(geocenter.lng())
                    clpmap.searchtype = 'map'

                    SearchCharger_Indexinapp();
                } else {
                    alert(address + ' ' + _infotext.notfoundmessage[lang])
                }
            })
        })
    }
}

function getUrlParam(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    var result = window.location.search.substr(1).match(reg)
    return result ? decodeURIComponent(result[2]) : null
}

function IsNull(data) {
    return (data == '' || data == undefined || data == null || data == {} || data == []) ? true : false
}

function AddChargerHistory(itemid, itemName, geoLocation) {
    try {
        var history = common.cookieGet('clp_charger_history')
        if (IsNull(history)) {
            common.cookieSet('clp_charger_history', itemid, 3650)
        } else {
            var historyArr = history.split(',')
            var historyStr = ''
            for (var i = 0; i < historyArr.length && i < 3; i++) {
                if (!IsNull(historyArr[i]) && historyArr[i] != itemid) {
                    historyStr += historyArr[i] + ','
                }
            }
            historyStr = itemid + ',' + historyStr
            historyStr = historyStr.substring(0, historyStr.length - 1)
            if (historyStr.split(',').length > 3) {
                historyStr = historyStr.substring(0, historyStr.lastIndexOf(','))
            }
            common.cookieSet('clp_charger_history', historyStr, 3650)
        }
        LoadChargerHistory()
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_history', itemid, 3650)
    }
}

function LoadChargerHistory() {
    try {
        $('.map-search__search-history__inner').html('')
        var history = common.cookieGet('clp_charger_history')
        var historyArr = history.split(',')
        var html = ''
        var reg = new RegExp(',', 'g')
        var lang = $('html').attr('lang')
        history = ('{' + history.replace(reg, '},{') + '}').toUpperCase()
        $.ajax({
            type: 'GET',
            url: apibase() +
                '/api/CLPEVCharger/GetLevel3ListByItemIds' +
                '?' +
                'itemIds=' +
                history +
                '&lang=' + lang,
            dataType: 'json',
            cache: false,
            async: false,
            timeout: 10000,
            success: function(data, textStatus, jqXHR) {
                if (data.length !== 0 && jqXHR.readyState == 4) {
                    var pins_total = data.totalSearchResult;
                    var pin_details = data.geolocationResult;
                    for (var i = 0; i < historyArr.length; i++) {
                        $.each(pin_details,
                            function(index, pin_details) {
                                if (historyArr[i] == pin_details.ItemId) {
                                    var alabel = '<a href="javascript:SelectChargerHistory(\'' + pin_details.ItemId + "'," + pin_details.GeoLocation + ')">' + pin_details.Title + '</a> |'
                                    html = html + alabel
                                }
                            })
                    }
                }
            },

            error: function(xhr, textStatus, errorThrown) {
                console.log('Please refresh the page and try again')
            }
        })
        if (!IsNull(html))
            html = html.substring(0, html.length - 1)
        $('.map-search__search-history__inner').html(html)
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_history', '', 3650)
    }
}

function SelectChargerHistory(itemId, lat, lng) {
    var lang = $('html').attr('lang')
    $('html').removeClass('mapview--list').addClass('mapview--map')
    common.cookieSet('mapview', 'map', 1)
    var url;
    try {
        if (clpmap.currentpage == 'charginglocation') {
            deleteMarkers()
            clpmap.clickhistory = true
            map.setCenter({
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            })
            mapinit_map_location(map.center, map, itemId, clpmap.zoomlevel.lv3)
        } else {
            url = '/ev/' + lang + '/charginglocations.html?lat=' + lat + '&lng=' + lng + '&itemId=' + itemId
            location.href = url
        }
    } catch (err) {
        url = '/ev/' + lang + '/charginglocations.html?lat=' + lat + '&lng=' + lng + '&itemId=' + itemId
        location.href = url
    }
}

function AddBookmarkMap(itemid) {
    try {
        $('#map_' + itemid).css({
            'background-position': '0px -97px'
        })
        var bookmark = common.cookieGet('clp_charger_bookmark')
        if (IsNull(bookmark)) {
            common.cookieSet('clp_charger_bookmark', itemid, 3650)
        } else {
            var bookmarkArr = []
            bookmarkArr = bookmark.split(',')
            var bookmarkStr = ''
            var isexist = false
            for (var i = 0; i < bookmarkArr.length && i < 3; i++) {
                if (!IsNull(bookmarkArr[i]) && bookmarkArr[i] != itemid) {
                    bookmarkStr += bookmarkArr[i] + ','
                } else if (!IsNull(bookmarkArr[i]) && bookmarkArr[i] == itemid) {
                    // console.log(itemid)
                    // isexist = true
                    $('#map_' + itemid).css({
                        'background-position': '0px -32px'
                    })
                }
            }

            bookmarkStr = itemid + ',' + bookmarkStr
            bookmarkStr = bookmarkStr.substring(0, bookmarkStr.length - 1)
            if (bookmarkStr.split(',').length > 3) {
                bookmarkStr = bookmarkStr.substring(0, bookmarkStr.lastIndexOf(','))
            }
            common.cookieSet('clp_charger_bookmark', bookmarkStr, 3650)
        }
        LoadChargerBookmark()
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_bookmark', itemid, 3650)
    }
}

function AddBookmarkListView(itemid) {
    try {
        $('#lv_' + itemid).css({
            'background-position': '0 67%'
        })
        var bookmark = common.cookieGet('clp_charger_bookmark')
        if (IsNull(bookmark)) {
            common.cookieSet('clp_charger_bookmark', itemid, 3650)
        } else {
            var bookmarkArr = []
            bookmarkArr = bookmark.split(',')
            var bookmarkStr = ''
            var isexist = false
            for (var i = 0; i < bookmarkArr.length && i < 3; i++) {
                if (!IsNull(bookmarkArr[i]) && bookmarkArr[i] != itemid) {
                    bookmarkStr += bookmarkArr[i] + ','
                } else if (!IsNull(bookmarkArr[i]) && bookmarkArr[i] == itemid) {
                    //   isexist = true
                    $('#lv_' + itemid).css({
                        'background-position': '0 0'
                    })
                }
            }
            // if (!isexist) {
            bookmarkStr = itemid + ',' + bookmarkStr
            // }
            bookmarkStr = bookmarkStr.substring(0, bookmarkStr.length - 1)
            if (bookmarkStr.split(',').length > 3) {
                bookmarkStr = bookmarkStr.substring(0, bookmarkStr.lastIndexOf(','))
            }
            common.cookieSet('clp_charger_bookmark', bookmarkStr, 3650)
        }
        LoadChargerBookmark()
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_bookmark', itemid, 3650)
    }
}

function CancelBookmark(itemid) {
    try {
        $('#' + itemid).css({
            'background-position': '0% 0%'
        })
        var bookmark = common.cookieGet('clp_charger_bookmark')
        var bookmarkArr = []
        bookmarkArr = bookmark.split(',')
        var bookmarkStr = ''
        for (var i = 0; i < bookmarkArr.length && i < 10; i++) {
            if (!IsNull(bookmarkArr[i]) && bookmarkArr[i] != itemid) {
                bookmarkStr += bookmarkArr[i] + ','
            }
        }
        bookmarkStr = bookmarkStr.substring(0, bookmarkStr.length - 1)
        common.cookieSet('clp_charger_bookmark', bookmarkStr, 3650)
        LoadChargerBookmark()
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_bookmark', itemid, 3650)
    }
}

function LoadChargerBookmark() {
    try {
        $('.mybookmarklist').html('')
        var bookmark = common.cookieGet('clp_charger_bookmark')
        var bookmarkArr = []
        bookmarkArr = bookmark.split(',')
        var html = ''
        var reg = new RegExp(',', 'g')
        var lang = $('html').attr('lang')

        bookmark = ('{' + bookmark.replace(reg, '},{') + '}').toUpperCase()

        $.ajax({
            type: 'GET',
            url: apibase() +
                '/api/CLPEVCharger/GetLevel3ListByItemIds' +
                '?' +
                'itemIds=' +
                bookmark +
                '&lang=' + lang,
            dataType: 'json',
            cache: false,
            async: false,
            timeout: 10000,
            success: function(data, textStatus, jqXHR) {
                if (data.length !== 0 && jqXHR.readyState == 4) {
                    var pins_total = data.totalSearchResult;
                    var pin_details = data.geolocationResult;
                    for (var i = 0; i < bookmarkArr.length; i++) {
                        $.each(pin_details,
                            function(index, pin_details) {
                                if (bookmarkArr[i] == pin_details.ItemId) {
                                    var checkstatus = function(geolocationResult) {
                                        var _pin = geolocationResult
                                        if (_pin.TotalNumberOfCharger > 0) {
                                            if (_pin.TotalNumberOfAvailableCharger > 0) {
                                                return 'available' // green
                                            } else if (_pin.TotalNumberOfNotAvailableCharger > 0) {
                                                return 'occupied' // red
                                            } else if (_pin.TotalNumberOfOutOfServiceCharger > 0) {
                                                return 'outofservice' // yellow
                                            } else {
                                                return 'statusnotavailable' // gray
                                            }
                                        } else {
                                            console.log('Total Number Of Charger in this pin is zero,', 'Address: ' + pin_details.Title, 'Latlng: ' + pin_details.GeoLocation)
                                            return 'statusnotavailable' // gray
                                        }
                                    }
                                    var pinstatus = checkstatus(pin_details)
                                    var _allnotavailable_q = false
                                    if (pinstatus == 'outofservice') {
                                        _allnotavailable_q = true
                                    }
                                    var _allnotavailable_s = false
                                    if (pinstatus == 'outofservice') {
                                        _allnotavailable_s = true
                                    }
                                    var _providerlist = [];
                                    var _providerlist_name = [];
                                    $.each(pin_details.ChargerList, function(i, charger) {
                                        _providerlist.push(String(charger["Provider"]).replace(/\s+/g, '-').toLowerCase());
                                    })
                                    var _providerlist_name = _.uniq(_providerlist);
                                    var hasclp = $.inArray("clp", _providerlist_name) != -1;
                                    var _providedbyclp = hasclp;

                                    var bookmarkstyle = 'background-position:0px 0px'
                                    if (bookmarkArr.indexOf(pin_details.ItemId) >= 0) {
                                        bookmarkstyle = 'background-position:0px -43px'
                                    }
                                    var itemhtml = '<div class="thread">' +
                                        '<div class="col-left">' +
                                        '<div class="pin-info">' +
                                        '<div class="pin-info__name">' + pin_details.Title + '</div>' +
                                        '<div class="pin-info__address">' + pin_details.DetailedAddress + '</div>' +
                                        (_allnotavailable_s ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_std[lang] + '</div>' : '') +
                                        (_allnotavailable_q ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_quick[lang] + '</div>' : '') +
                                        (!_providedbyclp && pinstatus == "statusnotavailable" ? "<div class='pin-info__notice'>" + _infotext.providedbyclpnotice[lang] + '</div>' : '') +
                                        (pin_details.LastUpdate !== '' ? "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ': ' + formattime(pin_details.LastUpdate) + '</div>' : "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ': - </div>') +

                                        '</div>' +
                                        '</div>' +
                                        '<div class="col-right">' +
                                        '<div class="pin-info__tools">' +
                                        '<div class="pin-info__bookmark">' +
                                        '<a href="javascript:CancelBookmark(\'' + pin_details.ItemId + '\');" id="lv_' + pin_details.ItemId + '" style="' + bookmarkstyle + '"><span class=\'icon\'></span></a>' +
                                        '</div>' +
                                        '<div class="pin-info__path">' +
                                        '<a href="https://www.google.com/maps/dir/?api=1&destination=' + pin_details.GeoLocation + '&travelmode=driving" target=\'_blank\'></a>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="pin-info__sub ">' +
                                        '<div class="board">' +
                                        '<div class="pin-info-changeinfo card  changeinfo--standard">' +
                                        '<div class="icon"><img src="/ev/images/icon-semiquick-black.png" alt=""></div>' +
                                        '<div class="card__name">' + _infotext.stdsemiquickcharge[lang] + '</div>' +
                                        '<div class="card__content">' +
                                        '<span class="num--availlable">' + pin_details.TotalNumberOfAvailableSemiQuickCharger + '</span>' +
                                        '<span class="num--total">/' + pin_details.TotalNumberOfSemiQuickCharger + '</span>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="pin-info-changeinfo card  changeinfo--quick">' +
                                        '<div class="icon"><img src="/ev/images/icon-quick-black.png" alt=""></div>' +
                                        '<div class="card__name">' + _infotext.quickcharge[lang] + '</div>' +
                                        '<div class="card__content">' +
                                        '<span class="num--availlable">' + pin_details.TotalNumberOfAvailableQuickCharger + '</span>' +
                                        '<span class="num--total">/' + pin_details.TotalNumberOfQuickCharger + '</span>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="pin-info-changeinfo card  changeinfo--outstanding">' +
                                        '<div class="changeinfo-occupied">' + _infotext.occupied[lang] + ': <span class="num">' + pin_details.TotalNumberOfNotAvailableCharger + '</span></div>' +
                                        '<div class="changeinfo-nonavailable">' + _infotext.statusNotavailable[lang] + ': <span class="num">' + pin_details.TotalNumberOfStatusNotAvailableCharger + '</span></div>' +
                                        '<div class="changeinfo-outofservice">' + _infotext.outofservice[lang] + ': <span class="num">' + pin_details.TotalNumberOfOutOfServiceCharger + '</span></div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>'

                                    html = html + itemhtml
                                }
                            })
                    }
                }
            },

            error: function(xhr, textStatus, errorThrown) {
                console.log('Please refresh the page and try again')
            }
        })

        html = html + "<div class='emptybookmark'>" + (lang == 'zh' ? '請收藏充電站。' : 'Please bookmark a charging location.') + '<div>'
        $('.mybookmarklist').html(html)
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_bookmark', '', 3650)
    }
}

function LoadFeedback() {
    try {
        var lang = $('html').attr('lang')
        var rating = $('#feedback_rate').val().toString()

        $.ajax({
            type: 'GET',
            url: apibase() +
                '/api/CLPSurvey/GetQuestion?surveyId={5FF17643-0333-4DE3-8894-F7587DECA0BB}&star=' +
                rating +
                '&' +
                'lang=' +
                lang,
            dataType: 'json',
            cache: false,
            async: false,
            timeout: 10000,
            success: function(data, textStatus, jqXHR) {
                if (data.length !== 0 && jqXHR.readyState == 4) {
                    var serveytitle = data.serveyResult.Title
                    var serveyID = data.serveyResult.ItemId
                    var choices = data.serveyResult.AnswetList
                    var choices_html = ''
                    $('#feedback_questionid').val(serveyID)
                    $.each(choices,
                        function(i, choice) {
                            choices_html = choices_html + "<div class='choice'>" +
                                "<label for='q" + i + "'>" +
                                " <input type='checkbox' id='q" + i + "' name='q" + i + "' value='" + choice.ItemId + "'> " + choice.Title + '</label>' +
                                '</div>'
                        })
                    $('#feedback_question').html(serveytitle)
                    if (choices_html == '') {
                        if (lang == 'zh') {
                            choices_html = '出了些問題。請重試。'
                        } else {
                            choices_html = 'Something went wrong. Please retry.'
                        }
                    }
                    $('#feedback_choices').html(choices_html)
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('Please refresh the page and try again')
            }
        })

        $('input').iCheck({
            handle: 'checkbox'
        }).on('ifChanged',
            function(e) {
                $(e.target).trigger('change')
            })
        $('input').placeholder()

        enablesubmit()
    } catch (err) {
        console.log(err)
        common.cookieSet('clp_charger_bookmark', '', 3650)
    }
}

function sendfeedback() {
    var lang = $('html').attr('lang')
    var checkbox = $(':checkbox', '#feedback_choices')
    var choosen = []

    var _isinapp = function() {
        return $("html.inapp").length != 0;
    }

    var _knowdevicemodel = function() {
        return ua_result.device.model != undefined;
    }

    checkbox.each(function(i, item) {
        if ($(item).is(':checked')) {
            choosen.push(item.value)
        }
    })

    var _platFormvalue = 'CLP Web EV';
    if (_isinapp()) {
        _platFormvalue += " inapp";
    }
    if (_knowdevicemodel()) {
        _platFormvalue += " " + ua_result.os.name;
    }
    console.log(_platFormvalue)

    var data = {
        'QuestionItemId': encodeURIComponent($("#feedback_questionid").val()),
        'AnswerItemIds': encodeURIComponent("{" + choosen.join("}|{") + "}"),
        'PlatForm': encodeURIComponent(_platFormvalue),
        'LastUrl': encodeURIComponent(location.href),
        'LastUrlTitle': encodeURIComponent(location.pathname),
        'StarRating': encodeURIComponent($("#feedback_rate").val()),
        'Lang': encodeURIComponent(lang)
    }

    console.log(data)

    $.post(apibase() + '/api/CLPSurvey/SubmitAnswer?', data, function(response) {
            // clpsitecoreqa-hk-cd.azurewebsites.net
            // response.result == true

        })
        .success(function() {
            // $('html').removeClass('feedbackform_on')
            $('.feedbackBlock').addClass('submitting')

            // $('.blockdescription .text', '.feedbackBlock').html((lang == "zh" ? '謝謝！' : 'Thank you!'))
            $('.rating', '.feedbackBlock').hide()
            $('.cross', '.feedbackBlock.submitting').on('click',
                function() {
                    resetfeedback()
                })
            setTimeout(function() {
                $('.cross', '.feedbackBlock.submitting').click()
            }, 4000)
        })
        .error(function(xhr, status, error) {
            $('#feedback_survey').hide()
            $('.rating', '.feedbackBlock').hide()

            $('.blocktitle .text', '.feedbackBlock').html(_infotext.errormessage[lang])
            $('.blockdescription .text', '.feedbackBlock').html(xhr.responseJSON.Message)

            setTimeout(function() {
                $('.cross', '.feedbackBlock ').click()
            }, 4000)
        })
        .complete(function() {
            //  console.log("end")
        })
}

function enablesubmitbtn() {
    if ($('input:checked', '#feedback_choices').length > 0) {
        $('input[type="submit"]', '.feedbackBlock').removeAttr('disabled')
    } else {
        $('input[type="submit"]', '.feedbackBlock').attr('disabled', 'disabled')
    }
}

function enablesubmit() {
    enablesubmitbtn()
    // $('input:checkbox', '#feedback_choices').on('change', enablesubmitbtn)

    $('input').on('ifToggled', function(event) {
        enablesubmitbtn()
    })
    $('input[type="submit"]', '.feedbackBlock').one('click',

        function(e) {
            e.preventDefault()
            sendfeedback()
        })
}

function resetfeedback() {
    var lang = $('html').attr('lang')
    $('.stars .star').removeClass('on')
    $('.rating', '.feedbackBlock').show()
    $('.stars .star').css('pointer-events', 'auto')
    $('input:checkbox', '#feedback_choices').prop('checked', false)
    $('.stars .star').removeClass('on')
    var _rate = ''
    $('input[type="submit"]', '.feedbackBlock').attr('disabled', 'disabled')
    $("input[name='rate']", '.feedbackBlock').val(_rate)
    $('.next').attr('disabled', 'disabled').show()
    $('#feedback_survey').hide()

    $('html').removeClass('feedbackform_on')
    $('.feedbackBlock').removeClass('submitting').removeClass('on')
    $('.rating', '.feedbackBlock').show()

    $('.feedbackBlock').removeClass('on')

    $('input[type="submit"]', '.feedbackBlock').off('click')

    $('.blocktitle .text', '.feedbackBlock').html(_infotext.feedbacktitle[lang])
    $('.blockdescription .text', '.feedbackBlock').html(_infotext.feedbackdes[lang])
}

function SearchCharger_Top() {
    var lang = $('html').attr('lang')
    var provider = IsNull($('#sltProvider_top').val()) ? '' : $('#sltProvider_top').val()
    var chargerType = IsNull($('#sltChargerType_top').val()) ? '' : $('#sltChargerType_top').val()
    var district = IsNull($('#sltDistricts_top').val()) ? '' : $('#sltDistricts_top').val()
    var availability = IsNull($('#sltAvailability_top').val()) ? '' : $('#sltAvailability_top').val()
    var latvalue = $('#latitude_top').val()
    var lngvalue = $('#longitude_top').val()
    var address = $('#evcmap_top').val()
    var url = '/ev/' + lang + '/charginglocations.html'
    if (provider == '0' && chargerType == '0' && district == '0' && availability == '0' && !IsNull(provider)) {
        url = url +
            '?lat=' +
            latvalue +
            '&lng=' +
            lngvalue +
            '&address=' +
            address
    } else if (IsNull(latvalue) && IsNull(lngvalue)) {
        url = url +
            '?provider=' +
            provider +
            '&chargerType=' +
            chargerType +
            '&district=' +
            district +
            '&status=' +
            availability
    }
    location.href = url
}

function SearchCharger_Indexinapp() {
    var lang = $('html').attr('lang')
    var latvalue = $('#latitude_indexinapp').val()
    var lngvalue = $('#longitude_indexinapp').val()
    var address = $('#evcmap_indexinapp').val()
    var url = '/ev/' + lang + '/charginglocations.html'
    url = url +
        '?lat=' +
        latvalue +
        '&lng=' +
        lngvalue +
        '&address=' +
        address +
        '&inapp=true'

    location.href = url
}

function InitSearch_Top(obj) {
    if (obj.val() == '') {
        $('#latitude_top').val('')
        $('#longitude_top').val('')
    } else {
        var geocoder = new google.maps.Geocoder();
        var address = $('#evcmap_top').val();
        geocoder.geocode({
            address: address,
            'componentRestrictions': {
                'country': 'hk'
            }
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var geocenter = results[0].geometry.location;
                var lat = geocenter.lat();
                var lng = geocenter.lng();
                $('#latitude_top').val(lat);
                $('#longitude_top').val(lng);
                clpmap.searchtype = "map";

            } else {
                alert(address + ' not found');
            }
        });
        if ($('#sltProvider_top').length > 0) {
            $('#sltProvider_top').data('selectBox-selectBoxIt').selectOption(0)
            $('#sltChargerType_top').data('selectBox-selectBoxIt').selectOption(0)
            $('#sltDistricts_top').data('selectBox-selectBoxIt').selectOption(0)
            $('#sltAvailability_top').data('selectBox-selectBoxIt').selectOption(0)
        }

    }
}

$('#evcmap_top').keyup(function() {
    InitSearch_Top($(this))
})

$('#evcmap_top').blur(function() {
    InitSearch_Top($(this))
})

$('#sltProvider_top,#sltChargerType_top,#sltDistricts_top,#sltAvailability_top').change(function() {
    if ($(this).val() != 0) {
        $('#evcmap_top').val('')
        $('#latitude_top').val('')
        $('#longitude_top').val('')
    }
})

function setMapOnAll(map) {
    for (var i = 0; i < clpmap.markerIds.length; i++) {
        clpmap.markers[clpmap.markerIds[i]].setMap(map)
    }
}

function clearMarkers() {
    for (var i = 0; i < clpmap.markers.length; i++) {
        clpmap.markers[i].setMap(null)
    }
    clpmap.markers.length = 0
}

function deleteMarkers() {
    clearMarkers()
    clpmap.markers = []
    clpmap.markerIds = []
}

function LoadRecommendedChargingLocations(issearch) {
    try {
        $('#widget_recommendlocation').html('')
        var lang = $('html').attr('lang')
        var latvalue = $('#latitude_indexinapp').val()
        var lngvalue = $('#longitude_indexinapp').val()
        var html = ''
        if (issearch == false && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                    console.log(position)
                    latvalue = position.coords.latitude
                    lngvalue = position.coords.longitude
                    if (IsNull(latvalue)) {
                        latvalue = 22.384793
                    }
                    if (IsNull(lngvalue)) {
                        lngvalue = 114.118509
                    }

                    $.ajax({
                        type: 'GET',
                        url: apibase() +
                            '/api/CLPEVCharger/GetRecommendedLevel3List' +
                            '?' +
                            'latitudeCenter=' +
                            latvalue +
                            '&longitudeCenter=' +
                            lngvalue +
                            '&lang=' +
                            lang,
                        dataType: 'json',
                        cache: false,
                        async: false,
                        timeout: 10000,
                        success: function(data, textStatus, jqXHR) {
                            if (data.length !== 0 && data.totalSearchResult > 0 && jqXHR.readyState == 4) {
                                console.log(data)
                                var result = data.geolocationResult[0]
                                html = '<div class="widget_inner">' +
                                    '<div class="upper">' +
                                    '<a target="_blank" class="link" href="https://www.google.com/maps/dir/?api=1&destination=' +
                                    result.GeoLocation +
                                    ' ">' +
                                    '<span class="feature">' + _infotext.recommendedtitle[lang] + '</span>' +
                                    '<span class="locationname">' +
                                    result.Title +
                                    '</span>' +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="lower">' +
                                    '<div class="stdCharge">' +
                                    '<div class="icon">' +
                                    '<img src="./../images/icon-semiquick-white.png" alt="">' +
                                    '</div>' +
                                    '<div class="details">' +
                                    ' <div class="title">' + _infotext.stdsemiquickcharge[lang] + '</div>' +
                                    '<div class="figure">' +
                                    result.TotalNumberOfAvailableSemiQuickCharger +
                                    '<span class="total">/' +
                                    result.TotalNumberOfSemiQuickCharger +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="quickCharge">' +
                                    '<div class="icon">' +
                                    '<img src="./../images/icon-quick-white.png" alt="">' +
                                    '</div>' +
                                    '<div class="details">' +
                                    ' <div class="title">' + _infotext.quickcharge[lang] + '</div>' +
                                    '<div class="figure">' +
                                    result.TotalNumberOfAvailableQuickCharger +
                                    '<span class="total">/' +
                                    result.TotalNumberOfQuickCharger +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    ' </div>'
                            }
                        },

                        error: function(xhr, textStatus, errorThrown) {
                           html =  '<div class="locationEnableNotice"> Please enable Location to use the function </div>'+
                            console.log('Please refresh the page and try again')
                        }
                    })
                    $('#widget_recommendlocation').html(html)
                },
                function() {
                    if (IsNull(latvalue)) {
                        latvalue = 22.384793
                    }
                    if (IsNull(lngvalue)) {
                        lngvalue = 114.118509
                    }

                    $.ajax({
                        type: 'GET',
                        url: apibase() +
                            '/api/CLPEVCharger/GetRecommendedLevel3List' +
                            '?' +
                            'latitudeCenter=' +
                            latvalue +
                            '&longitudeCenter=' +
                            lngvalue +
                            '&lang=' +
                            lang,
                        dataType: 'json',
                        cache: false,
                        async: false,
                        timeout: 10000,
                        success: function(data, textStatus, jqXHR) {
                            if (data.length !== 0 && data.totalSearchResult > 0 && jqXHR.readyState == 4) {
                                console.log(data)
                                var result = data.geolocationResult[0]
                                html = '<div class="widget_inner">' +
                                    '<div class="locationEnableNotice"> Please enable Location to use the function </div>'+
                                    '<div class="upper">' +
                                    '<a class="link" href="https://www.google.com/maps/dir/?api=1&destination=' +
                                    result.GeoLocation +
                                    ' ">' +
                                    '<span class="feature">' + _infotext.recommendedtitle[lang] + '</span>' +
                                    '<span class="locationname">' +
                                    result.Title +
                                    '</span>' +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="lower">' +
                                    '<div class="stdCharge">' +
                                    '<div class="icon">' +
                                    '<img src="./../images/icon-semiquick-white.png" alt="">' +
                                    '</div>' +
                                    '<div class="details">' +
                                    ' <div class="title">' + _infotext.stdsemiquickcharge[lang] + '</div>' +
                                    '<div class="figure">' +
                                    result.TotalNumberOfAvailableSemiQuickCharger +
                                    '<span class="total">/' +
                                    result.TotalNumberOfSemiQuickCharger +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="quickCharge">' +
                                    '<div class="icon">' +
                                    '<img src="./../images/icon-quick-white.png" alt="">' +
                                    '</div>' +
                                    '<div class="details">' +
                                    ' <div class="title">' + _infotext.quickcharge[lang] + '</div>' +
                                    '<div class="figure">' +
                                    result.TotalNumberOfAvailableQuickCharger +
                                    '<span class="total">/' +
                                    result.TotalNumberOfQuickCharger +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    ' </div>'
                            }
                        },

                        error: function(xhr, textStatus, errorThrown) {
                            console.log('Please refresh the page and try again')

                            html = '<div class="locationEnableNotice"> Please enable Location to use the function </div>'
                        }
                    })
                    $('#widget_recommendlocation').html(html)
                })
        } else {
            if (IsNull(latvalue)) {
                latvalue = 22.384793
            }
            if (IsNull(lngvalue)) {
                lngvalue = 114.118509
            }

            $.ajax({
                type: 'GET',
                url: apibase() +
                    '/api/CLPEVCharger/GetRecommendedLevel3List' +
                    '?' +
                    'latitudeCenter=' +
                    latvalue +
                    '&longitudeCenter=' +
                    lngvalue +
                    '&lang=' +
                    lang,
                dataType: 'json',
                cache: false,
                async: false,
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    if (data.length !== 0 && data.totalSearchResult > 0 && jqXHR.readyState == 4) {
                        console.log(data)
                        var result = data.geolocationResult[0]
                        html = '<div class="widget_inner">' +
                            '<div class="upper">' +
                            '<a class="link" href="https://www.google.com/maps/dir/?api=1&destination=' +
                            result.GeoLocation +
                            ' ">' +
                            '<span class="feature">' + _infotext.recommendedtitle[lang] + '</span>' +
                            '<span class="locationname">' +
                            result.Title +
                            '</span>' +
                            '</a>' +
                            '</div>' +
                            '<div class="lower">' +
                            '<div class="stdCharge">' +
                            '<div class="icon">' +
                            '<img src="./../images/icon-semiquick-white.png" alt="">' +
                            '</div>' +
                            '<div class="details">' +
                            ' <div class="title">' + _infotext.stdsemiquickcharge[lang] + '</div>' +
                            '<div class="figure">' +
                            result.TotalNumberOfAvailableSemiQuickCharger +
                            '<span class="total">/' +
                            result.TotalNumberOfSemiQuickCharger +
                            '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="quickCharge">' +
                            '<div class="icon">' +
                            '<img src="./../images/icon-quick-white.png" alt="">' +
                            '</div>' +
                            '<div class="details">' +
                            ' <div class="title">' + _infotext.quickcharge[lang] + '</div>' +
                            '<div class="figure">' +
                            result.TotalNumberOfAvailableQuickCharger +
                            '<span class="total">/' +
                            result.TotalNumberOfQuickCharger +
                            '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            ' </div>'
                    }
                },

                error: function(xhr, textStatus, errorThrown) {
                    console.log('Please refresh the page and try again')
                }
            })
            $('#widget_recommendlocation').html(html)
        }
    } catch (err) {
        console.log(err)
    }
}

function formattime(t) {
    _currentlang = $('html').attr('lang')
    if (_currentlang == 'zh') {
        moment.locale('zh-hk')
        return moment(t).format('LLLL')
    } else {
        moment.locale('en')
        return moment(t).format('LLLL')
    }
}

// function settitle() {

//     var meta_title = document.createElement('meta');
//     meta_title.name = 'WT.cg_s';
//     meta_title.setAttribute('content', String(document.title));
//     document.getElementsByTagName('head')[0].appendChild(meta_title);

// }

function apibase() {

    return ''

}

function checkenv() {

    return 'other'

}
// var md = new MobileDetect(window.navigator.userAgent)
jQuery(window).load(
    common.checkinapp(),
    common.getUserGeo(),
    AutoComplete_Top(),
    AutoComplete_Indexinapp()

)

jQuery(window).on('resize', _.debounce(function() {
    layout.content_padding()
    layout.mobmenuinit()
    common.popup()
    common.mediacheck()
    layout.resetpopup()
}, 100))

document.addEventListener("DOMContentLoaded", function(event) {
    setTimeout(function() {
        $(".highlevel-overlay", "body").fadeOut();

    }, 10)
})

function ua_init() {
    ua_parser = new UAParser();
    ua_result = ua_parser.getResult();

}

ua_init();
console.log('%c Lights will guide you home ', 'background: #333; color: #aaa; font-family:"Comic Sans MS";');