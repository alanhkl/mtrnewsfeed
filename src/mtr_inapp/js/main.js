var common, BrowserDetect;
(function($) {
    return common = {
        init: function() {
            common.mediacheck();
            common.sizecheck();
            common.loadLang();
            BrowserDetect.init();
            common.touchcheck();
            common.phase();
            common.uacheck();
        },

        uacheck: function() {},

        phase: function() {
            $('html').addClass('phase2');
        },

        inappstatus: false,

        checkinapp: function() {
            var inapp = common.cookieGet('inapp');

            if (common.checkparam('inapp') != '') {
                if (common.getparamvalue('inapp') == 'true') {
                    common.setasinapp('true');
                    // common.setasinapp('false')
                } else if (common.getparamvalue('inapp') == 'false') {
                    common.setasnotinapp('true');
                    // common.setasnotinapp('false')
                }
            } else if (inapp.length > 0) {
                if (inapp == 'true') {
                    common.setasinapp('false');
                } else if (inapp == 'false') {
                    common.setasnotinapp('false');
                }
            } else {
                common.setasnotinapp('false');
            }
        },

        checkparam: function(param) {
            var _param = param;

            var url_string = document.location.href;
            var matchcount = url_string.match(_param);
            // console.log(_param, url_string, matchcount)

            if (matchcount != null || undefined || '') {
                if (matchcount.index != -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return '';
            }
        },
        getparamvalue: function(param) {
            var _param = param;
            if (common.checkparam(_param)) {
                _param = _param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + _param + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
            } else {
                return '';
            }
        },
        checkandget_height: function(t) {
            var _t = t;
            if (_t.length > 0) {
                return _t.outerHeight();
            } else {
                return 0;
            }
        },

        touchcheck: function() {
            $('html').addClass('no-touch');
            window.addEventListener('touchstart',
                function onFirstTouch() {
                    $('html').addClass('touch');
                    $('html').removeClass('no-touch');
                    window.USER_IS_TOUCHING = true;

                    window.removeEventListener('touchstart', onFirstTouch, false);
                },
                false);
        },

        sizecheck: function() {
            window.viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            window.viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        },
        mediacheck: function() {
            var $desktop = '(min-width: 992px )';
            var $tablet_below = '(max-width: 991.9px )';
            var $tablet = '(min-width: 768px ) and (max-width: 991.9px )';
            var $mobile = '(min-width: 576px ) and (max-width: 767.9px )';
            var $s_mobile = '(max-width: 575.9px)';

            $('html').removeClass('desktop');
            $('html').removeClass('tablet');
            $('html').removeClass('mobile');
            $('html').removeClass('s_mobile');

            if (window.matchMedia($desktop).matches) {
                $('html').addClass('desktop');
                return 'desktop';
            } else {
                $('html').removeClass('desktop');
            }
            if (window.matchMedia($tablet).matches) {
                $('html').addClass('tablet');
                return 'tablet';
            } else {
                $('html').removeClass('tablet');
            }
            if (window.matchMedia($mobile).matches) {
                $('html').addClass('mobile');
                return 'mobile';
            } else {
                $('html').removeClass('mobile');
            }
            if (window.matchMedia($s_mobile).matches) {
                $('html').addClass('s_mobile');
                return 's_mobile';
            } else {
                $('html').removeClass('s_mobile');
            }
        },
        cookieGet: function(name) {
            var i, x, y, ARRcookies = document.cookie.split(';');
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
                x = x.replace(/^\s+|\s+$/g, '');
                if (x == name) {
                    return decodeURI(y);
                }
            }
            return '';
        },
        cookieSet: function(name, value, exdays) {
            // console.log('cookieSet')
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = encodeURI(value) + ((exdays == null) ? '' : '; expires=' + exdate.toUTCString() + '; path=/');
            document.cookie = name + '=' + c_value;
        },
        cookieGet_obj: function(name) {
            // for get the cookie
            // console.log('cookieGet: ' + name)
            var i, x, y, ARRcookies = document.cookie.split(';');
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
                x = x.replace(/^\s+|\s+$/g, '');
                if (x == name) {
                    return decodeURI(y);
                }
            }
            return '';
        },
        cookieSet_obj: function(name, value, exdays) {
            // console.log('cookieSet')
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var cookie = [
                name, '=', JSON.stringify(encodeURI(value)), '; expires=',
                ((exdays == null) ? '' : exdate.toUTCString()), '; domain=.', window.location.host.toString(),
                '; path=/;'
            ].join('');
            document.cookie = cookie;
        },

        cookiesDelete: function delete_cookie(name) {
            document.cookie = [
                name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()
            ].join('');
        },

        checkmap: function() {
            if ($('.map').length) {
                $('html').addClass('hasMap');
                if ($('.home').length) {
                    $('html').addClass('hasMap--nofilter');
                } else {
                    $('html').addClass('hasMap--withfilter');
                }
            } else {
                $('html').addClass('noMap');
            }
        },

        initLang: function() {
            common.cookieSet('lang', $('html').attr('lang'), 5);
        },
        loadLang: function() {
            return $('html').attr('lang');
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
                .toString();
            var switchZh = '/zh/';
            var switchEn = '/en/';
            var switchSc = '/sc/';
            lang = '/' + lang + '/';
            switch (lang) {
            case '/en/':
                    // common.cookieSet('lang', 'en', 5)
                currentPath = currentPath.replace(switchZh, switchEn);
                currentPath = currentPath.replace(switchSc, switchEn);
                    // create a lang cookie as en for 5 days
                break;
            case '/zh/':
                    // common.cookieSet('lang', 'zh', 5)
                currentPath = currentPath.replace(switchEn, switchZh);
                currentPath = currentPath.replace(switchSc, switchZh);
                break;
            case '/sc/':
                    // common.cookieSet('lang', 'sc', 5)
                currentPath = currentPath.replace(switchZh, switchSc);
                currentPath = currentPath.replace(switchEn, switchSc);
                break;
            default:
            }

            document.location = currentPath;
        },
        deleteAllCookies: function() {
            var cookies = document.cookie.split(';');

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf(' = ');
                var name = eqPos > -1 ?
                    cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
        },

        // #############################
        // HASHING
        // #############################

        // http://localhost:3000/en/index.html?view=map&pin=54b61096-00ac-4260-86d9-b9ce21519b77
        hashInitiate: function() {
            var self = this;
            if (window.location.hash) {
                self.hashGet();
                self.searchFromHash();
                self.filterFromHash();
            }

            $(window).on('hashchange', function() {
                if (window.location.hash) {
                    self.hashGet();
                    if (self.hashBeingSet) {
                        self.hashBeingSet = false;
                    } else {
                        self.searchFromHash();
                        self.filterFromHash();
                    }
                }
            });
        },
        hashSet: function() {
            // console.log('hashSet')
            var self = this;
            self.hashBeingSet = true;
            var filters = '';
            var comma = ',';
            for (var i = 0; i < self.filterArray.length; i++) {
                if (i !== self.filterArray.length - 1) {
                    filters += String(self.filterArray[i]) + comma;
                } else {
                    filters += String(self.filterArray[i]);
                }
            }

            var height;
            if (self.filterHeightLimit !== 99 && self.filterHeightLimit !== 0) {
                height = String(self.filterHeightLimit);
                height = height.replace('.', '-');
            } else {
                height = '';
            }

            if (isNaN(self.searchDistrictRegion)) {
                self.searchDistrictRegion = '';
            }

            if (isNaN(self.searchDistrictValue)) {
                self.searchDistrictValue = '';
            }

            var params = '';
            if (self.searchDistrictRegion || self.searchDistrictValue) {
                params += 'r=' + self.searchDistrictRegion + '&d=' + self.searchDistrictValue;
            }

            if (self.searchMethod || self.searchValue) {
                if (params) {
                    params += '&';
                }
                params += 'm=' + self.searchMethod + '&v=' + self.searchValue;
            }

            if (filters) {
                if (params) {
                    params += '&';
                }
                params += 'f=' + filters;
            }

            if (height) {
                if (params) {
                    params += '&';
                }
                params += 'h=' + height;
            }

            params = encodeURI(params);

            history.replaceState(undefined, undefined, '#' + params);
        },
        hashGet: function() {
            var self = this;
            var hash = window.location.hash;

            if (hash) {
                self.hashString = decodeURI(hash).split('#')[1];
            } else {
                return;
            }

            var hashParams = self.hashString.split('&');
            self.hashArray = [];

            for (var i = 0; i < hashParams.length; i++) {
                var arrKey = hashParams[i].split('=');
                var arrValue = arrKey[1];
                switch (arrKey[0]) {
                case 'r':
                    self.searchDistrictRegion = arrValue;
                    break;
                case 'd':
                    self.searchDistrictValue = arrValue;
                    break;
                case 'm':
                    self.searchMethod = arrValue;
                    break;
                case 'v':
                    self.searchValue = arrValue;
                    break;
                case 'h':
                    arrValue = arrValue.replace('-', '.');
                    break;
                }
                self.hashArray.push([arrKey[0], arrValue]);
            }
        },
        hashClear: function() {
            self.searchDistrictRegion = '';
            self.searchDistrictValue = '';
            self.searchMethod = '';
            self.searchValue = '';
            self.hashBeingSet = true;
            window.location.hash = '#';
        },
        currentlatlng: '',

    };
})(jQuery)

;
(function($) {
    return BrowserDetect = {
        init: function() {
            this.browser = this.searchString(this.dataBrowser) || 'Other';
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';

            switch (BrowserDetect.browser) {
            case 'MS Edge':
                $('html').addClass('edge');
                break;
            case 'Explorer':
                $('html').addClass('ie');
                break;
            case 'Firefox':
                $('html').addClass('firefox');
                break;
            case 'Opera':
                $('html').addClass('opera');
                break;
            case 'Chrome':
                $('html').addClass('chrome');
                break;
            case 'Safari':
                $('html').addClass('safari');

                break;
            default:
            }
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf('rv:');
            if (this.versionSearchString === 'Trident' && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
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
    };
})(jQuery);

// DOM Ready
jQuery(function() {
    BrowserDetect.init();
    common.init();
}

);

jQuery(window).on('resize', _.debounce(function() {
    common.mediacheck();
}, 100));

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        $('.highlevel-overlay', 'body').fadeOut();
    }, 10);
});

function ua_init() {
    var ua_parser = new UAParser();
    var ua_result = ua_parser.getResult();
}

ua_init();
console.log('%c Lights will guide you home ', 'background: #333; color: #aaa; font-family:"Comic Sans MS";');