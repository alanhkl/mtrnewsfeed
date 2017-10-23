 var _google = (window.google ? true : false)
 var map = new google.maps.Map(document.getElementById('map'), clpmap.mapOption)
 var infoWindow = new google.maps.InfoWindow()

 function setMarkerPoints(map, lang) {
     if (clpmap.dragging) return
     if (clpmap.searching) return
     deleteMarkers()
     setMapOnAll(null)
     if (clpmap.maplevel() == 'district') {
         mapinit_map_district();
     } else if (clpmap.maplevel() == 'place') {
         mapinit_map_place(map.center, map);
     } else if (clpmap.maplevel() == 'location') {
         mapinit_map_location(map.center, map, null, null);
     }

 }

 function setMarkerList(map, filter, lang) {
     {}

 }

 function mapinit_map_district() {
     InitInfobox();
     var lang = $("html").attr("lang");

     $.ajax({
         type: 'GET',
         url: apibase() + '/api/CLPEVCharger/GetLevel1List?lang=' + lang,
         dataType: 'json',
         cache: false,
         timeout: 10000,
         success: function(data, textStatus, jqXHR) {
             if (data.length !== 0 && jqXHR.readyState == 4) {
                 var pins_total = data.totalSearchResult
                 var pin_details = data.geolocationResult

                 $.each(pin_details, function(marker, pin_details) {
                     var latLng = new google.maps.LatLng(pin_details.Latitude, pin_details.Longitude)

                     clpmap.markers[pin_details.ItemId] = marker
                     clpmap.markerIds.push(pin_details.ItemId)
                     clpmap.bounds.extend(latLng)
                     var marker = new google.maps.Marker({
                         position: latLng,
                         map: map,
                         title: pin_details.Title,
                         icon: {
                             url: clpmap.iconBase + 'pin-' + 'lightblue' + '.png'

                         }
                     })
                     google.maps.event.addListener(marker, 'click', function(e) {
                         clpmap.ischeck = true;
                         map.setZoom(clpmap.zoomlevel.lv2);
                         deleteMarkers();
                         mapinit_map_place(e.latLng, map);
                         map.setCenter(marker.getPosition());
                         clpmap.scrollToMap()
                         map.panTo(marker.getPosition());
                         clpmap.markerselected = marker
                         clpmap.markerselected.setIcon({
                             url: clpmap.iconBase + 'pin-' + 'blue' + '.png'
                         })
                     })
                     clpmap.markers.push(marker);
                 })

                 $(".overlay", ".map").fadeOut();
                 google.maps.event.addListener(map, 'resize', function() {
                     console.log("resize triggered");
                 });
             }
             clpmap.searching = false
         },

         error: function(xhr, textStatus, errorThrown) {
             console.log('Please refresh the page and try again')
             clpmap.searching = false
         }
     })
 }

 function mapinit_map_place(latLng, map) {
     if (clpmap.dragging) return
     if (clpmap.searching) return

     setMapOnAll(null)
     InitInfobox();

     var latLngData = latLng.toJSON();
     var lang = $("html").attr("lang");

     $.ajax({
         type: 'GET',
         url: apibase() + '/api/CLPEVCharger/GetLevel2List?latitudeCenter=' + latLngData.lat + '&longitudeCenter=' + latLngData.lng + '&distance=5&lang=' + lang,
         dataType: 'json',
         cache: false,
         timeout: 10000,
         success: function(data, textStatus, jqXHR) {
             if (data.length !== 0 && jqXHR.readyState == 4) {
                 var pins_total = data.totalSearchResult
                 var pin_details = data.geolocationResult

                 $.each(pin_details, function(marker, pin_details) {
                     var latLng = new google.maps.LatLng(pin_details.Latitude, pin_details.Longitude)
                     clpmap.bounds.extend(latLng)

                     var marker = new google.maps.Marker({
                         position: latLng,
                         map: map,
                         title: pin_details.Title,
                         icon: {
                             url: clpmap.iconBase + 'pin-' + 'lightblue' + '.png'

                         }
                     })

                     clpmap.markers[pin_details.ItemId] = marker
                     clpmap.markerIds.push(pin_details.ItemId)

                     google.maps.event.addListener(marker, 'click', function(e) {
                         clpmap.ischeck = true;
                         map.setZoom(clpmap.zoomlevel.lv3);
                         deleteMarkers();
                         mapinit_map_location(e.latLng, map, null, null);
                         map.setCenter(marker.getPosition());
                         clpmap.scrollToMap()
                         clpmap.scrollToMap()
                         map.panTo(marker.getPosition())
                         clpmap.markerselected = marker
                         clpmap.markerselected.setIcon({
                             url: clpmap.iconBase + 'pin-' + 'blue' + '.png'
                         })
                     })
                     clpmap.markers.push(marker);
                 })

             }

             clpmap.searching = false
         },
         error: function(xhr, textStatus, errorThrown) {
             console.log('Please refresh the page and try again')
             clpmap.searching = false
         }
     })
 }

 function mapinit_map_location(latLng, map, selectItemId, lv) {
     $(".map-info").show();
     if (lv != null) {
         map.setZoom(clpmap.zoomlevel.lv3);
     }
     if (selectItemId != null && map.zoom != clpmap.zoomlevel.lv3) {
         map.setZoom(clpmap.zoomlevel.lv3);
     }
     if (clpmap.filter != "" && clpmap.searchtype == "filter") {
         SearchFilter(selectItemId);
     } else {
         InitInfobox();
         var lang = $("html").attr("lang");

         var latLngData = latLng.toJSON();
         var requestUrl = apibase() + '/api/CLPEVCharger/GetLevel3List?latitudeCenter=' + latLngData.lat + '&longitudeCenter=' + latLngData.lng + '&distance=5&lang=' + lang;
         if (clpmap.currentpage == "availabilityofcharginglocation") {
             requestUrl = apibase() + '/api/CLPEVCharger/GetLevel3ListByCLP?latitudeCenter=' + latLngData.lat + '&longitudeCenter=' + latLngData.lng + '&distance=5&lang=' + lang;
         }
         $.ajax({
             type: 'GET',
             url: requestUrl,
             dataType: 'json',
             cache: false,
             timeout: 10000,
             success: function(data, textStatus, jqXHR) {
                 if (data.length !== 0 && jqXHR.readyState == 4) {

                     $(".overlay", ".map").fadeIn();
                     var pins_total = data.totalSearchResult
                     var pin_details = data.geolocationResult

                     var bookmark = common.cookieGet('clp_charger_bookmark');
                     var bookmarkArr = null;
                     if (!IsNull(bookmark)) {
                         var bookmarkArr = bookmark.split(',');
                     }

                     $.each(pin_details,
                         function(marker, pin_details) {
                             var latLng = new google.maps.LatLng(pin_details.Latitude, pin_details.Longitude)

                             clpmap.markers[pin_details.ItemId] = marker
                             clpmap.markerIds.push(pin_details.ItemId)
                             clpmap.bounds.extend(latLng)
                             var checkstatus = function(geolocationResult) {
                                 var _pin = geolocationResult

                                 if (_pin.TotalNumberOfCharger > 0) {
                                     if (_pin.TotalNumberOfAvailableCharger > 0) {
                                         return 'available' //green
                                     } else if (_pin.TotalNumberOfNotAvailableCharger > 0) {
                                         return 'occupied' //red
                                     } else if (_pin.TotalNumberOfOutOfServiceCharger > 0) {
                                         return 'outofservice' //yellow
                                     } else {
                                         return 'statusnotavailable' //gray
                                     }
                                 } else {
                                     console.log("Total Number Of Charger in this pin is zero,", "Address: " + pin_details.Title, "Latlng: " + pin_details.GeoLocation)
                                     return 'statusnotavailable' //gray
                                 }
                             }
                             var pinicon = clpmap.iconBase +
                                 'pin-' +
                                 clpmap.statusdictionary[checkstatus(pin_details)] +
                                 '.png';
                             if (selectItemId != null && selectItemId == pin_details.ItemId) {
                                 pinicon = clpmap.iconBase + 'pin-' + 'blue' + '.png'
                             }
                             var marker = new google.maps.Marker({
                                 position: latLng,
                                 map: map,
                                 title: pin_details.Title,
                                 itemid: pin_details.ItemId,
                                 icon: {
                                     url: pinicon,
                                     //  size: new google.maps.Size(28, 38),
                                     //  origin: new google.maps.Point(0, 0),
                                     //  anchor: new google.maps.Point(0, 38)
                                 }
                             })

                             clpmap.markers[pin_details.ItemId] = marker
                             clpmap.markerIds.push(pin_details.ItemId)

                             var selectedpin;
                             var _infobox = document.getElementById('pininfoBox');
                             var _html = document.getElementsByTagName("html")[0];
                             var bookmarkstyle = "background-position:0px -32px";
                             if (bookmarkArr != null && bookmarkArr.indexOf(pin_details.ItemId) >= 0) {
                                 bookmarkstyle = "background-position:0px -97px"
                             }
                             var pinstatus = checkstatus(pin_details);
                             var _allnotavailable_q = false;
                             if (pinstatus == "outofservice") {
                                 _allnotavailable_q = true
                             }
                             var _allnotavailable_s = false;
                             if (pinstatus == "outofservice") {
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
                             var _showtotalnumberonly = function(chargetype) {

                                 if (chargetype == "standard") {
                                     return (!_providedbyclp || (_providedbyclp && pinstatus == "statusnotavailable" && pin_details.TotalNumberOfAvailableSemiQuickCharger == 0))

                                 }
                                 if (chargetype == "quick") {
                                     return (!_providedbyclp || (_providedbyclp && pinstatus == "statusnotavailable" && pin_details.TotalNumberOfAvailableQuickCharger == 0))

                                 }

                             };

                             var infoBoxContent =
                                 "<div class='pin-info'>" +
                                 "<div class='col-left'>" +
                                 "<div class='pin-info__name'>" +
                                 (pin_details.Title != "" ? pin_details.Title : "Charging Location") +
                                 "</div>" +
                                 "<div class='pin-info__address'>" +
                                 pin_details.DetailedAddress +
                                 "</div>" +
                                 (_allnotavailable_s ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_std[lang] + "</div>" : "") +
                                 (_allnotavailable_q ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_quick[lang] + "</div>" : "") +
                                 (!_providedbyclp && pinstatus == "statusnotavailable" ? "<div class='pin-info__notice'>" + _infotext.providedbyclpnotice[lang] + "</div>" : "") +
                                 (pin_details.LastUpdate !== "" ? "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ": " + formattime(pin_details.LastUpdate) + "</div>" : "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ": - </div>") +
                                 "</div>" +
                                 "<div class='col-right'>" +
                                 "<div class='board'>" +
                                 "<div class='card tools'>" +
                                 "<div class='pin-info-bookmark'><a href=\"javascript:AddBookmarkMap('" + pin_details.ItemId + "');\" ><span class='icon tooltip' style='" + bookmarkstyle + "' id='map_" + pin_details.ItemId + "'  title='" + _infotext.addtobookmark[lang] + "'></span></a></div>" +
                                 "<div class='pin-info-getpath'><a href='" +
                                 "https://www.google.com/maps/dir/?api=1&destination=" +
                                 pin_details.GeoLocation +
                                 "&travelmode=driving'  target='_blank'><span class='icon tooltip' title='" + _infotext.getpath[lang] + "'></span></a></div>" +
                                 "</div>" +
                                 "<div class='pin-info-changeinfo card  changeinfo--standard'>" +
                                 "<div class='icon'><img src='/ev/images/icon-semiquick-white.png' alt=''></div>" +
                                 "<div class='card__name'>" + (_showtotalnumberonly("standard") ? _infotext.total[lang] + "<br/><span class='name '>" + _infotext.stdsemiquickcharge[lang] + "</span>" : "<span class='name '>" + _infotext.stdsemiquickcharge[lang] + "<br/></span>") + "</div>" +
                                 "<div class='card__content'>" +
                                 "<span class='num--available'>" +
                                 (_showtotalnumberonly("standard") ? pin_details.TotalNumberOfSemiQuickCharger : pin_details.TotalNumberOfAvailableSemiQuickCharger) +
                                 "</span>" +
                                 (_showtotalnumberonly("standard") ? "" : " <span class='num--total'>/ " + pin_details.TotalNumberOfSemiQuickCharger + "</span>") +

                                 "</div>" +
                                 "</div>" +
                                 "<div class='pin-info-changeinfo card changeinfo--quick '>" +
                                 "<div class='icon'><img src='/ev/images/icon-quick-white.png' alt=''></div>" +
                                 "<div class='card__name'>" + (_showtotalnumberonly("quick") ? _infotext.total[lang] + "<br/>" + _infotext.quickcharge[lang] : _infotext.quickcharge[lang] + "<br/> ") + "</div>" +
                                 "<div class='card__content'>" +
                                 "<span class='num--available'>" +
                                 (_showtotalnumberonly("quick") ? pin_details.TotalNumberOfQuickCharger : pin_details.TotalNumberOfAvailableQuickCharger) +
                                 "</span>" +
                                 (_showtotalnumberonly("quick") ? "" : "<span class='num--total'>/ " + pin_details.TotalNumberOfQuickCharger + "</span>") +

                                 "</div>" +
                                 "</div>" +
                                 "</div>" +
                                 "</div>" +
                                 '<div class=\"cross\"></div>' +
                                 "</div>"

                             if (selectItemId != null && selectItemId == pin_details.ItemId) {
                                 _infobox.innerHTML = infoBoxContent;
                                 _infobox.classList.add('on');
                                 _html.className += ' pinpopupon';
                                 map.setCenter(latLng);
                                 AddChargerHistory(pin_details.ItemId, pin_details.Title, pin_details.GeoLocation);
                             }

                             google.maps.Map.prototype.markers = []

                             google.maps.Map.prototype.addMarker = function(marker) {
                                 clpmap.markers[clpmap.markers.length] = marker
                             }
                             google.maps.Map.prototype.getMarkers = function() {
                                 return clpmap.markers
                             }
                             google.maps.Map.prototype.clearMarkers = function() {
                                 for (var i = 0; i < this.markers.length; i++) {
                                     clpmap.markers[i].setMap(null)
                                 }
                                 clpmap.markers = []
                             }
                             google.maps.event.addListener(marker,
                                 'click',
                                 function(e) {
                                     deleteMarkers();
                                     clpmap.scrollToMap()
                                     $(".map-info").hide();
                                     mapinit_map_location(e.latLng, map, marker.itemid, null);

                                 })
                             clpmap.markers.push(marker);
                         })

                     $(".overlay", ".map").fadeOut();
                     google.maps.event.addListener(map, 'resize', function() {
                         console.log("resize triggered");
                     });

                     LoadMapListView(pin_details);
                 }
             },

             error: function(xhr, textStatus, errorThrown) {
                 console.log('Please refresh the page and try again')
             }
         })
     }
 }

 function renderGoogleMap() {

     if (clpmap.currentpage == "availabilityofcharginglocation") {
         clpmap.searchtype = "filter"
         SearchFilter(null);
     } else if (clpmap.currentpage == "charginglocation" && clpmap.isadvancedsearch == true) {
         if (clpmap.clickhistory == true) {
             deleteMarkers();
             var lat = getUrlParam("lat");
             var lng = getUrlParam("lng");
             var itemId = getUrlParam("itemId");
             map.setCenter({
                 lat: parseFloat(lat),
                 lng: parseFloat(lng)
             });
             mapinit_map_location(map.center, map, itemId, clpmap.zoomlevel.lv3);
         } else {
             SearchCharger();
         }

         clpmap.isadvancedsearch = false;
     } else {
         setMarkerPoints(map, common.loadLang())
     }

     if (clpmap.currentmapview == 'map') {

     } else if (clpmap.currentmapview == 'list') {}

     google.maps.event.addListener(map, 'idle', function() {
         if ($("html.touch").length == 0) {

         }
         google.maps.event.clearListeners(map, 'idle')
     })
     google.maps.event.addListener(map, 'dragstart', function(event) {
         clpmap.dragging = true

     })

     google.maps.event.addListener(map, 'dragend', function(event) {
         clpmap.dragging = false

         if (clpmap.filter == "") {
             setMarkerPoints(map, common.loadLang());
         }
     })
     google.maps.event.addListener(map, 'click', function(event) {

         if ($("html.touch").length == 0) {
             clpmap.scrollToMap()
         }
     })

     google.maps.event.addListener(map, 'zoom_changed', function(event) {

         clpmap.currentZoom = map.getZoom();
         if (clpmap.filter == "" && clpmap.clickhistory == false) {

             setMarkerPoints(map, common.loadLang())

         }
         clpmap.clickhistory = false;
     })

     $('#evcmap_' + clpmap.currentpage).on('change', function() {
         var geocoder = new google.maps.Geocoder();
         var address = $('#evcmap_' + clpmap.currentpage).val();
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
                 $('#latitude_' + clpmap.currentpage).val(lat);
                 $('#longitude_' + clpmap.currentpage).val(lng);
                 clpmap.searchtype = "map";
                 clpmap.filter = "filter";
                 deleteMarkers();
                 map.setZoom(clpmap.zoomlevel.lv3);
                 map.setCenter({
                     lat: parseFloat(lat),
                     lng: parseFloat(lng)
                 });
                 mapinit_map_location(map.center, map, null, null);
             } else {
                 alert(address + ' not found');
             }
         });
     });

     var autocomplete = new google.maps.places.Autocomplete(($('#evcmap_' + clpmap.currentpage)[0]), {
         types: ['geocode'],
         componentRestrictions: clpmap.countryRestrict
     });

     google.maps.event.addListener(autocomplete, 'place_changed', function() {
         var geocoder = new google.maps.Geocoder();
         var address = $('#evcmap_' + clpmap.currentpage).val();
         geocoder.geocode({
             address: address
         }, function(results, status) {
             if (status == google.maps.GeocoderStatus.OK) {
                 var geocenter = results[0].geometry.location;
                 var lat = geocenter.lat();
                 var lng = geocenter.lng();
                 $('#latitude_' + clpmap.currentpage).val(lat);
                 $('#longitude_' + clpmap.currentpage).val(lng);
                 clpmap.searchtype = "map";
                 clpmap.filter = "filter";
                 deleteMarkers();
                 map.setZoom(clpmap.zoomlevel.lv3);
                 map.setCenter({
                     lat: parseFloat(lat),
                     lng: parseFloat(lng)
                 });
                 mapinit_map_location(map.center, map, null, null);
             } else {
                 alert(address + ' not found');
             }
         });
     });

     var autocomplete_top = new google.maps.places.Autocomplete(($('#evcmap_top')[0]), {
         types: ['geocode'],
         componentRestrictions: clpmap.countryRestrict
     });
     google.maps.event.addListener(autocomplete_top, 'place_changed', function() {
         var geocoder = new google.maps.Geocoder();
         var address = $('#evcmap_top').val();
         geocoder.geocode({
             address: address
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
     });
 }

 function SearchCharger() {
     clpmap.filter = "filter";
     if (clpmap.searchtype == "map") {
         var latvalue = $('#latitude_' + clpmap.currentpage).val();
         var lngvalue = $('#longitude_' + clpmap.currentpage).val();
         if (IsNull(latvalue) || IsNull(lngvalue)) {

         } else {
             deleteMarkers();
             map.setZoom(clpmap.zoomlevel.lv3);
             map.setCenter({
                 lat: parseFloat(latvalue),
                 lng: parseFloat(lngvalue)
             });
             mapinit_map_location(map.center, map, null, null);
         }

     } else {
         SearchFilter(null);
     }
 }

 $("#sltProvider,#sltChargerType,#sltDistricts,#sltAvailability").change(function() {
     if (!IsNull($(this).val())) {
         $("#evcmap_" + clpmap.currentpage).val("");
         $('#latitude_' + +clpmap.currentpage).val("");
         $('#longitude_' + clpmap.currentpage).val("");
     }
     clpmap.searchtype = "filter";
 });

 function SearchFilter(selectItemId) {
     $(".map-info").show();
     InitInfobox();
     if (clpmap.searchtype == "filter") {
         deleteMarkers();
         $("#evcmap_" + clpmap.currentpage).val("");
         $('#latitude_' + +clpmap.currentpage).val("");
         $('#longitude_' + clpmap.currentpage).val("");

         clpmap.filter = "filter";
         var provider = IsNull($("#sltProvider").val()) ? "" : $("#sltProvider").val();
         var chargerType = IsNull($("#sltChargerType").val()) ? "" : $("#sltChargerType").val();
         var district = IsNull($("#sltDistricts").val()) ? "" : $("#sltDistricts").val();
         var availability = IsNull($("#sltAvailability").val()) ? "" : $("#sltAvailability").val();
         if (provider == "All") {
             provider = "";
         }
         if (chargerType == "All") {
             chargerType = "";
         }
         if (district == "All") {
             district = "";
         }
         if (availability == "All") {
             availability = "";
         }
         if (IsNull(provider) && IsNull(chargerType) && IsNull(district) && IsNull(availability)) {
             clpmap.filter = "";
         }
         if (!IsNull(district)) {
             var districtLat = $('#sltDistricts').find('option:selected').attr('data-lat');
             var districtLng = $('#sltDistricts').find('option:selected').attr('data-lng');
             var districtCenter = {
                 lat: parseFloat(districtLat),
                 lng: parseFloat(districtLng)
             };
             map.setZoom(clpmap.zoomlevel.lv3);
             map.setCenter(districtCenter);
         } else {
             map.setZoom(clpmap.zoomlevel.lv1);
         }
         if (clpmap.filter != "" || clpmap.currentpage == "availabilityofcharginglocation") {
             if (clpmap.currentpage == "availabilityofcharginglocation") {
                 provider = "CLP";
                 //availability = "Charging_Available";
             }
             var lang = $("html").attr("lang");

             $.ajax({
                 type: 'GET',
                 url: apibase() + '/api/CLPEVCharger/GetLevel3ListByFilter?provider=' +
                     provider +
                     '&chargerType=' +
                     chargerType +
                     '&districtItemId=' +
                     district +
                     '&status=' +
                     availability + '&lang=' + lang,
                 dataType: 'json',
                 cache: false,
                 timeout: 10000,
                 success: function(data, textStatus, jqXHR) {
                     if (data.length !== 0 && jqXHR.readyState == 4) {
                         $(".overlay", ".map").show();
                         var pins_total = data.totalSearchResult;
                         var pin_details = data.geolocationResult;

                         var bookmark = common.cookieGet('clp_charger_bookmark');
                         var bookmarkArr = null;
                         if (!IsNull(bookmark)) {
                             var bookmarkArr = bookmark.split(',');
                         }
                         $.each(pin_details,
                             function(marker, pin_details) {
                                 var latLng = new google.maps.LatLng(pin_details.Latitude, pin_details.Longitude)
                                 clpmap.markers[pin_details.ItemId] = marker
                                 clpmap.markerIds.push(pin_details.ItemId)
                                 clpmap.bounds.extend(latLng)
                                 var checkstatus = function(geolocationResult) {
                                     var _pin = geolocationResult
                                     if (_pin.TotalNumberOfCharger > 0) {
                                         if (_pin.TotalNumberOfAvailableCharger > 0) {
                                             return 'available' //green
                                         } else if (_pin.TotalNumberOfNotAvailableCharger > 0) {
                                             return 'occupied' //red
                                         } else if (_pin.TotalNumberOfOutOfServiceCharger > 0) {
                                             return 'outofservice' //yellow
                                         } else {
                                             return 'statusnotavailable' //gray
                                         }
                                     } else {
                                         console.log("Total Number Of Charger in this pin is zero,", "Address: " + pin_details.Title, "Latlng: " + pin_details.GeoLocation)
                                         return 'statusnotavailable' //gray
                                     }
                                 }

                                 var pinicon = clpmap.iconBase +
                                     'pin-' +
                                     clpmap.statusdictionary[checkstatus(pin_details)] +
                                     '.png';
                                 if (selectItemId != null && selectItemId == pin_details.ItemId) {
                                     pinicon = clpmap.iconBase + 'pin-' + 'blue' + '.png'
                                 }
                                 var marker = new google.maps.Marker({
                                     position: latLng,
                                     map: map,
                                     title: pin_details.Title,
                                     itemid: pin_details.ItemId,
                                     icon: {
                                         url: pinicon,

                                     }
                                 })

                                 clpmap.markers[pin_details.ItemId] = marker
                                 clpmap.markerIds.push(pin_details.ItemId)

                                 var selectedpin;
                                 var _infobox = document.getElementById('pininfoBox');
                                 var _html = document.getElementsByTagName("html")[0];
                                 var bookmarkstyle = "background-position:0px -32px";
                                 if (bookmarkArr != null && bookmarkArr.indexOf(pin_details.ItemId) >= 0) {
                                     bookmarkstyle = "background-position:0px -97px"
                                 }
                                 var pinstatus = checkstatus(pin_details);

                                 var _allnotavailable_q = false
                                 if (pinstatus == "outofservice") {
                                     _allnotavailable_q = true
                                 }
                                 var _allnotavailable_s = false
                                 if (pinstatus == "outofservice") {
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

                                 var _showtotalnumberonly = function(chargetype) {

                                     if (chargetype == "standard") {
                                         return (!_providedbyclp || (_providedbyclp && pinstatus == "statusnotavailable" && pin_details.TotalNumberOfAvailableSemiQuickCharger == 0))

                                     }
                                     if (chargetype == "quick") {
                                         return (!_providedbyclp || (_providedbyclp && pinstatus == "statusnotavailable" && pin_details.TotalNumberOfAvailableQuickCharger == 0))

                                     }

                                 };

                                 var infoBoxContent =
                                     "<div class='pin-info'>" +
                                     "<div class='col-left'>" +
                                     "<div class='pin-info__name'>" +
                                     (pin_details.Title != "" ? pin_details.Title : "Charging Location") +
                                     "</div>" +
                                     "<div class='pin-info__address'>" +
                                     pin_details.DetailedAddress +
                                     "</div>" +
                                     (_allnotavailable_s ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_std[lang] + "</div>" : "") +
                                     (_allnotavailable_q ? "<div class='pin-info__notice'>" + _infotext.alloutofservice_quick[lang] + "</div>" : "") +
                                     (!_providedbyclp && pinstatus == "statusnotavailable" ? "<div class='pin-info__notice'>" + _infotext.providedbyclpnotice[lang] + "</div>" : "") +
                                     (pin_details.LastUpdate !== "" ? "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ": " + formattime(pin_details.LastUpdate) + "</div>" : "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ": - </div>") +
                                     "</div>" +
                                     "<div class='col-right'>" +
                                     "<div class='board'>" +
                                     "<div class='card tools'>" +
                                     "<div class='pin-info-bookmark'><a href=\"javascript:AddBookmarkMap('" + pin_details.ItemId + "');\" ><span class='icon tooltip' style='" + bookmarkstyle + "' id='map_" + pin_details.ItemId + "'  title='" + _infotext.addtobookmark[lang] + "'></span></a></div>" +
                                     "<div class='pin-info-getpath'><a href='" +
                                     "https://www.google.com/maps/dir/?api=1&destination=" +
                                     pin_details.GeoLocation +
                                     "&travelmode=driving'  target='_blank'><span class='icon tooltip' title='" + _infotext.getpath[lang] + "'></span></a></div>" +
                                     "</div>" +
                                     "<div class='pin-info-changeinfo card  changeinfo--standard'>" +
                                     "<div class='icon'><img src='/ev/images/icon-semiquick-white.png' alt=''></div>" +
                                     "<div class='card__name'>" + (_showtotalnumberonly("standard") ? _infotext.total[lang] + "<br/><span class='name '>" + _infotext.stdsemiquickcharge[lang] + "</span>" : "<span class='name '>" + _infotext.stdsemiquickcharge[lang] + "<br/></span>") + "</div>" +
                                     "<div class='card__content'>" +
                                     "<span class='num--available'>" +
                                     (_showtotalnumberonly("standard") ? pin_details.TotalNumberOfSemiQuickCharger : pin_details.TotalNumberOfAvailableSemiQuickCharger) +
                                     "</span>" +
                                     (_showtotalnumberonly("standard") ? "" : " <span class='num--total'>/ " + pin_details.TotalNumberOfSemiQuickCharger + "</span>") +
                                     // "<span class='num--total '>/" + (pin_details.TotalNumberOfCharger) + "</span>" +
                                     "</div>" +
                                     "</div>" +
                                     "<div class='pin-info-changeinfo card changeinfo--quick '>" +
                                     "<div class='icon'><img src='/ev/images/icon-quick-white.png' alt=''></div>" +
                                     "<div class='card__name'>" + (_showtotalnumberonly("quick") ? _infotext.total[lang] + "<br/>" + _infotext.quickcharge[lang] : _infotext.quickcharge[lang] + "<br/> ") + "</div>" +
                                     "<div class='card__content'>" +
                                     "<span class='num--available'>" +
                                     (_showtotalnumberonly("quick") ? pin_details.TotalNumberOfQuickCharger : pin_details.TotalNumberOfAvailableQuickCharger) +
                                     "</span>" +
                                     (_showtotalnumberonly("quick") ? "" : " <span class='num--total'>/ " + pin_details.TotalNumberOfQuickCharger + "</span>") +
                                     // " <span class='num--total'>/" + pin_details.TotalNumberOfCharger + "</span>" +
                                     "</div>" +
                                     "</div>" +
                                     "</div>" +
                                     "</div>" +
                                     '<div class=\"cross\"></div>' +
                                     "</div>"

                                 if (selectItemId != null && selectItemId == pin_details.ItemId) {
                                     _infobox.innerHTML = infoBoxContent;
                                     _infobox.classList.add('on');
                                     _html.className += ' pinpopupon';
                                     map.setCenter(latLng);
                                     AddChargerHistory(pin_details.ItemId, pin_details.Title, pin_details.GeoLocation);
                                 }

                                 google.maps.Map.prototype.markers = []

                                 google.maps.Map.prototype.addMarker = function(marker) {
                                     clpmap.markers[clpmap.markers.length] = marker
                                 }
                                 google.maps.Map.prototype.getMarkers = function() {
                                     return clpmap.markers
                                 }
                                 google.maps.Map.prototype.clearMarkers = function() {
                                     for (var i = 0; i < this.markers.length; i++) {
                                         clpmap.markers[i].setMap(null)
                                     }
                                     clpmap.markers = []
                                 }
                                 google.maps.event.addListener(marker,
                                     'click',
                                     function(e) {
                                         clpmap.scrollToMap()
                                         deleteMarkers();
                                         mapinit_map_location(e.latLng, map, marker.itemid, null);
                                     });
                                 clpmap.markers.push(marker);
                             })

                         $(".overlay", ".map").fadeOut();
                         google.maps.event.addListener(map, 'resize', function() {
                             console.log("resize triggered");
                         });

                         LoadMapListView(pin_details)
                     }
                 },
                 error: function(xhr, textStatus, errorThrown) {
                     console.log('Please refresh the page and try again')
                 }
             })
         } else {
             map.setZoom(clpmap.zoomlevel.lv1);
             map.setCenter(clpmap.currentcenter);
             mapinit_map_district();
         }
     }
 }

 $("#evcmap_charginglocation,#evcmap_availabilityofcharginglocation").keyup(function() {
     InitSearch($(this));
 });

 $("#evcmap_charginglocation,#evcmap_availabilityofcharginglocation").blur(function() {
     InitSearch($(this));
 });

 function LoadMapListView(data) {
     var html = "";
     var bookmark = common.cookieGet('clp_charger_bookmark');
     var bookmarkArr = null;
     if (!IsNull(bookmark)) {
         var bookmarkArr = bookmark.split(',');
     }
     $(".threads").html("");
     var lang = $("html").attr("lang");
     var flag = 1;
     $.each(data,
         function(marker, item) {
             var checkstatus = function(geolocationResult) {
                 var _pin = geolocationResult
                 if (_pin.TotalNumberOfCharger > 0) {
                     if (_pin.TotalNumberOfAvailableCharger > 0) {
                         return 'available' //green
                     } else if (_pin.TotalNumberOfNotAvailableCharger > 0) {
                         return 'occupied' //red
                     } else if (_pin.TotalNumberOfOutOfServiceCharger > 0) {
                         return 'outofservice' //yellow
                     } else {
                         return 'statusnotavailable' //gray
                     }
                 } else {
                     console.log("Total Number Of Charger in this pin is zero,", "Address: " + _pin.Title, "Latlng: " + _pin.GeoLocation)
                     return 'statusnotavailable' //gray
                 }

             }
             var bookmarkstyle = "background-position:0 0";
             if (bookmarkArr != null && bookmarkArr.indexOf(item.ItemId) >= 0) {
                 bookmarkstyle = "background-position:0 67%"
             }
             var pinstatus = checkstatus(item);
             var _allnotavailable_q = false
             if (pinstatus == "outofservice") {
                 _allnotavailable_q = true
             }
             var _allnotavailable_s = false
             if (pinstatus == "outofservice") {
                 _allnotavailable_s = true
             }
             var _providerlist = [];
             var _providerlist_name = [];
             $.each(item.ChargerList, function(i, charger) {
                 _providerlist.push(String(charger["Provider"]).replace(/\s+/g, '-').toLowerCase());
             })
             var _providerlist_name = _.uniq(_providerlist);
             var hasclp = $.inArray("clp", _providerlist_name) != -1;
             var _providedbyclp = hasclp;
             var hidecss = "";
             if (flag > 5) {
                 hidecss = "style=\"display:none\"";
             }
             html = html +
                 "<div class=\"thread\" " + hidecss + ">" +
                 "<div class=\"col-left\">" +
                 "<div class=\"pin-info\">" +
                 "<div class=\"pin-info__name\">" +
                 item.Title +
                 "</div>" +
                 "<div class=\"pin-info__address\">" +
                 item.DetailedAddress +
                 "</div>" +
                 (_allnotavailable_s ?
                     "<div class='pin-info__notice'>" + _infotext.alloutofservice_std[lang] + "</div>" :
                     "") +
                 (_allnotavailable_q ?
                     "<div class='pin-info__notice'>" + _infotext.alloutofservice_quick[lang] + "</div>" :
                     "") +
                 (!_providedbyclp && pinstatus == "statusnotavailable" ?
                     "<div class='pin-info__notice'>" + _infotext.providedbyclpnotice[lang] + "</div>" :
                     "") +
                 (item.LastUpdate !== "" ?
                     "<div class='pin-info__infoupdatedtime'>" +
                     _infotext.lastupdatedby[lang] +
                     ": " +
                     formattime(item.LastUpdate) +
                     "</div>" :
                     "<div class='pin-info__infoupdatedtime'>" + _infotext.lastupdatedby[lang] + ": - </div>") +

                 "</div>" +
                 "</div>" +
                 "<div class=\"col-right\">" +
                 "<div class=\"pin-info__tools\">" +
                 "<div class=\"pin-info__bookmark\">" +
                 "<a href=\"javascript:AddBookmarkListView('" +
                 item.ItemId +
                 "');\" id=\"lv_" +
                 item.ItemId +
                 "\" style=\"" +
                 bookmarkstyle +
                 "\"></a>" +
                 "</div>" +
                 "<div class=\"pin-info__path\">" +
                 "<a href=\"https://www.google.com/maps/dir/?api=1&destination=" +
                 item.GeoLocation +
                 "&travelmode=driving\" target='_blank'></a>" +
                 "</div>" +
                 "</div>" +
                 "<div class=\"pin-info__sub \">" +
                 "<div class=\"board\">" +
                 "<div class=\"pin-info-changeinfo card  changeinfo--standard\">" +
                 "<div class=\"icon\"><img src=\"/ev/images/icon-semiquick-black.png\" alt=\"\"></div>" +
                 "<div class=\"card__name\">" +
                 _infotext.stdsemiquickcharge[lang] +
                 "</div>" +
                 "<div class=\"card__content\">" +
                 "<span class=\"num--availlable\">" +
                 item.TotalNumberOfAvailableSemiQuickCharger +
                 "</span>" +
                 "<span class=\"num--total\">/" +
                 item.TotalNumberOfSemiQuickCharger +
                 "</span>" +
                 "</div>" +
                 "</div>" +
                 "<div class=\"pin-info-changeinfo card  changeinfo--quick\">" +
                 "<div class=\"icon\"><img src=\"/ev/images/icon-quick-black.png\" alt=\"\"></div>" +
                 "<div class=\"card__name\">" +
                 _infotext.quickcharge[lang] +
                 "</div>" +
                 "<div class=\"card__content\">" +
                 "<span class=\"num--availlable\">" +
                 item.TotalNumberOfAvailableQuickCharger +
                 "</span>" +
                 "<span class=\"num--total\">/" +
                 item.TotalNumberOfQuickCharger +
                 "</span>" +
                 "</div>" +
                 "</div>" +
                 "<div class=\"pin-info-changeinfo card  changeinfo--outstanding\">" +
                 "<div class=\"changeinfo-occupied\">" +
                 _infotext.occupied[lang] +
                 ": <span class=\"num\">" +
                 item.TotalNumberOfNotAvailableCharger +
                 "</span></div>" +
                 "<div class=\"changeinfo-nonavailable\">" +
                 _infotext.statusNotavailable[lang] +
                 ": <span class=\"num\">" +
                 item.TotalNumberOfStatusNotAvailableCharger +
                 "</span></div>" +
                 "<div class=\"changeinfo-outofservice\">" +
                 _infotext.outofservice[lang] +
                 ": <span class=\"num\">" +
                 item.TotalNumberOfOutOfServiceCharger +
                 "</span></div>" +
                 "</div>" +
                 "</div>" +
                 "</div>" +
                 "</div>" +
                 "</div>";
             flag++;
         });
     $(".threads").html(html);
     if (flag <= 5) {
         $("#more_results").hide();
     }
 }

 function LoadMapListViewAllData() {
     var lang = $("html").attr("lang");

     $.ajax({
         type: 'GET',
         url: apibase() +
             '/api/CLPEVCharger/GetLevel3List' +
             '?' +
             'latitudeCenter=' +
             22.297969 +
             '&longitudeCenter=' +
             114.180264 +
             '&distance=200&lang=' + lang,
         dataType: 'json',
         cache: false,
         timeout: 10000,
         success: function(data, textStatus, jqXHR) {
             if (data.length !== 0 && jqXHR.readyState == 4) {

                 LoadMapListView(data.geolocationResult)
             }
         },

         error: function(xhr, textStatus, errorThrown) {
             console.log('Please refresh the page and try again')
         }
     })
 }

 function ShowListView() {
     $(".threads").find(".thread").show();
     $("#more_results").hide();
 }

 function GoToMapView(selectItemId) {
     deleteMarkers();
     if ($('.mapview--list').length) {
         $('html').removeClass('mapview--list').addClass('mapview--map')
         common.cookieSet('mapview', 'map', 1)
     }
     mapinit_map_location(map.center, map, selectItemId, null);
     google.maps.event.trigger(map, 'resize');

 }

 function InitSearch(obj) {
     if (obj.val() == "") {
         clpmap.filter = "";
         $('#latitude_' + clpmap.currentpage).val("");
         $('#longitude_' + clpmap.currentpage).val("");

     } else {
         if (clpmap.currentpage == "charginglocation") {
             $("#sltProvider").data("selectBox-selectBoxIt").selectOption(0);
             $("#sltAvailability").data("selectBox-selectBoxIt").selectOption(0);
         }
         $("#sltChargerType").data("selectBox-selectBoxIt").selectOption(0);
         $("#sltDistricts").data("selectBox-selectBoxIt").selectOption(0);

         clpmap.searchtype = "map";
     }
     if (IsNull($('#latitude_' + clpmap.currentpage).val()) && IsNull($('#latitude_' + clpmap.currentpage).val())) {
         clpmap.filter = "";
         clpmap.searchtype = "filter";
     }
 }

 function InitInfobox() {
     var _infobox = document.getElementById('pininfoBox');
     _infobox.innerHTML = "";
     _infobox.classList.remove('on');
 }

 function disableMapScroll(map) {
     var container = $('#map')

     var timeout
     map.mapScrollWheelDisabled = true
     map.setOptions({
         scrollwheel: false
     })
     container.on('mouseenter', function() {
         clpmap.hovering = true
     }).on('mouseleave', function() {
         clpmap.hovering = false
         if (!clpmap.dragging) {
             map.mapScrollWheelDisabled = true
             container.removeClass('active')
             map.setOptions({
                 scrollwheel: false
             })
         }
     }).on('click', function() {
         google.maps.event.trigger(map, 'click')
     })

     google.maps.event.addListener(map, 'idle', function() {
         container.trigger('mouseout')
     })
     google.maps.event.addListener(map, 'zoom_changed', function() {

     })

     google.maps.event.addListener(map, 'click', function() {
         google.maps.event.trigger(map, 'dragstart')
         google.maps.event.trigger(map, 'dragend')
     })
     google.maps.event.addListener(map, 'dragstart', function() {
         map.mapScrollWheelDisabled = false
         clpmap.dragging = true
         container.addClass('active')
         map.setOptions({
             scrollwheel: true
         })
         clearTimeout(timeout)
     })
     google.maps.event.addListener(map, 'dragend', function() {

         clpmap.dragging = false
         timeout = setTimeout(function() {
             if (!clpmap.hovering) {
                 container.trigger('mouseout')
             }
         }, 1000)
     })
 }
 google.maps.event.addDomListener(window, 'load',

     function() {

         window.setTimeout(renderGoogleMap, 1000);
         google.maps.event.trigger(map, 'resize')
     }
 );

 jQuery(function() {

     clpmap.initMap();

     $('.filter_select', '.map-search__search-input').on('click', function() {

         clpmap.scrollToMap()
     });
     $('#evcmap,#evcmap~a').on('focus', function() {

         clpmap.scrollToMap()
     });

     $('#pininfoBox').on('click', '.cross', function() {
         $(this).closest("#pininfoBox").removeClass("on");

         $("html").removeClass("pinpopupon")

     })

     $('a', '.map-search__menu').on('click', function() {
         $('html').addClass("searchpopupon")
         $(".map-search .upper").addClass("on");
     })

     $('.map-search .upper').on('click', '.cross', function() {
         $(".map-search .upper").removeClass("on");
         $("html").removeClass("searchpopupon")

     })
     $('.map-search .upper .searchbar ').on('click', 'a', function() {
         $('.cross', '.map-search .upper ').click();
         $('.cross', '.docks .dock').click();
         $('.cross', '#pininfoBox').click();
     })

 })

 jQuery(window).load(
     function() {
         clpmap.toggleMapView()

     }
 )
 jQuery(window).on('resize', _.debounce(function() {}, 100))