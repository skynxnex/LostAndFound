onload = function(){
    var originalThumbnailWidth = $('.thumbnail').width();
    var originalThumbnailHeight = $('.thumbnail').height();
    var markersArray = [];
    var sorter = null;
    var mapLoaded = null;
	var page = 1;
    
    /*
     * Rezise dom elements on load
     */
    updateViewPort();
    /*
     * Rezise dom elements on browser resize
     */
    $(window).resize(function(){
        updateViewPort();
    });
    /*
     * Make map on load
     * and add to DOM element
     * TODO check Y initialize wrapps so much
     */
    initialize();
    function initialize(){
        var latlng; // = new google.maps.LatLng(59.309888773597095,
        // 18.050005859375005);
        var myOptions = {
            zoom: 11,
            center: latlng,
            mapTypeControl: false,
            panControl: false,
            streetViewControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        
        /*
         * Adds click events on sorter buttons "on load"
         */
        $("li.found").click(function(){
            $('body').removeClass();
            $('body').addClass('found');
            var choice = "found";
            refreshPage(choice);
            return false;
        });
        $("li.lost").click(function(){
            $('body').removeClass();
            $('body').addClass('lost');
            var choice = "lost";
            refreshPage(choice);
            return false;
        });
        $("li.all").click(function(){
            $('body').removeClass();
            $('body').addClass('all');
            var choice = "all";
            refreshPage(choice);
            return false;
        });
        
        /*
         * checks if map is loaded
         * if it is than update on drag
         */
        if (mapLoaded) {
            google.maps.event.addListener(map, 'dragend', function(){
                refreshPage("something");
            });
        }
        else {
            google.maps.event.addListener(map, 'bounds_changed', function(){
                refreshPage("something");
                mapLoaded = true;
                google.maps.event.clearListeners(map, 'bounds_changed');
                $("div#map_canvas>div>div.gmnoprint").css({
                    "top": "150px"
                });
            });
        }
        /*
         * Refreshes markers on map, takes lost and found changes
         * default is all.
         */
        function refreshPage(choice){
            if (choice == "lost" || choice == "found") {
                sorter = choice;
            }
            else 
                if (choice == "all") {
                    sorter = null;
                }
            var bounds = map.getBounds();
            var southWest = bounds.getSouthWest();
            var northEast = bounds.getNorthEast();
            if (sorter) {
                $.getJSON("db.php", {
                    "mainsort": sorter,
                    "xstart": southWest.Ba,
                    "xend": northEast.Ba,
                    "ystart": southWest.za,
                    "yend": northEast.za
                }, function(data){
					drawMarkers(data);
					drawAdds(data);
					drawPaging(data);
					});
            } 
            else {
                $.getJSON("db.php", {
                    "xstart": southWest.Ba,
                    "xend": northEast.Ba,
                    "ystart": southWest.za,
                    "yend": northEast.za
                }, function(data){
					drawMarkers(data);
					drawAdds(data);
					drawPaging(data);
					});
            }
        }
        /*
         *	Clears all markers and print the current ones
         */
        function drawMarkers(data){
			clearOverlays();
			/*TODO dynamisk storlek för items i listan*/
            /*var screenheight = $(window).height();
            
			if(screenheight <= 300){
				var screensize = 3;
			}else if(screenheight <= 600){
				var screensize = 5;
			}else if(screenheight <= 10000){
				var screensize = 8;
			}*/
			
            $.each(data, function(i, item){
                var point = new google.maps.LatLng(item.lat, item.long);
                console.debug(item.lat, item.long);
                if (item.lost_found == "lost") {
                    var image = "layout/lost-icon.png";
                    var marker = new google.maps.Marker({
                        position: point,
                        icon: image,
                        map: map
                    });
                } else if (item.lost_found == "found") {
					var image = "layout/found-icon.png";
					var marker = new google.maps.Marker({
						position: point,
						icon: image,
						map: map
					});
				} else {
					var marker = new google.maps.Marker({
						position: point,
						map: map
					});
				}
				
				markersArray.push(marker);
				
            });
        };
        
        
		function drawPaging(data){
			$("#sidebarfooter").empty();
			if(page > 1 && page < data.length){
				$("<a/>").appendTo("#sidebarfooter").addClass("pagelinkBack").text("<");
				$("<a/>").appendTo("#sidebarfooter").addClass("pagelinkForth").text(">");
			}else if(page == 1){
				$("<a/>").appendTo("#sidebarfooter").addClass("pagelinkForth").text(">");
			}else if(page == data.length){
				$("<a/>").appendTo("#sidebarfooter").addClass("pagelinkBack").text("<");
			}
			if($(".pagelinkForth").click()){
				page+=1;
				pagingDrawAdds(data);
			}
			if($(".pagelinkBack").click()){
				page-=1;
				pagingDrawAdds(data);
			}
			function pagingDrawAdds(data){
				var amount = $("#sidebar").height()/140;
				for(var i = 0;  i < amount ; i++){
					var pagecounter = page;
					var tempArray = new Array();
					tempArray.push(data[pagecounter]);
					drawAdds(tempArray);
					pagecounter++;
				}
			}
		}
		
        /*
         * Clear marker function
         */
        function clearOverlays(){
            if (markersArray) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
            }
        }
        
        /*
         * Gets your current position if user accepts it
         
         if (navigator.geolocation) {
         browserSupportFlag = true;
         navigator.geolocation.getCurrentPosition(function(position){
         latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         map.setCenter(latlng);
         }, function(){
         backupLocation();
         });
         // Try Google Gears Geolocation
         }
         else if (google.gears) {
         browserSupportFlag = true;
         var geo = google.gears.factory.create('beta.geolocation');
         geo.getCurrentPosition(function(position){
         latlng = new google.maps.LatLng(position.latitude, position.longitude);
         map.setCenter(latlng);
         }, function(){
         backupLocation();
         });
         // Browser doesn't support Geolocation
         }
         else {
         browserSupportFlag = false;
         backupLocation();
         }
         */
        backupLocation();
        
        /*
         * If user don't accept your location find by ip-location
         */
        function backupLocation(){
            $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data){
                latlng = new google.maps.LatLng(data.geoplugin_latitude, data.geoplugin_longitude);
                console.debug(data.geoplugin_latitude, data.geoplugin_longitude);
                map.setCenter(latlng);
            });
        };
            };
    /*
     * hover the togglebutton for the footer
     */
	toggleHover = {
		
		on: function (){
			var backgroundX = $(this).css("background-position").split("px")[0];
			$(this).css({
				"background-position": backgroundX + "px -50px"
			});
			//console.debug("hover prop on",$(this).css("background-position"));
		},
		off: function (){
			var backgroundX = $(this).css("background-position").split("px")[0];
			$(this).css({
				"background-position": backgroundX + "px 0px"
			});
			console.debug("hover prop off",$(this).css("background-position"));
		}
	};
		$("#footertoggler").hover(toggleHover.on,toggleHover.off);
		$("#sidebarToggler").hover(toggleHover.on,toggleHover.off);
    
    $("#footertoggler").toggle(function(){
        var backgroundY = $("#footertoggler").css("background-position").split("px ")[1];
        $("#footertoggler").css({
            "bottom": "190px",
            "background-position": "-150px " + backgroundY
        });
        $("#footer").css({
            "height": "200px"
        });
        console.debug("background pos footer", $("#sidebarToggler").css("background-position"));
        console.debug("background pos footer", "-150px " + backgroundY);
    }, function(){
        $("#footertoggler").css({
            "bottom": "",
            "background-position": ""
        })
        $("#footer").css({
            "height": ""
        })
    });
	
	 /*
     * togglebutton for the sidebar
     */
    
    $("#sidebarToggler").toggle(function(){
        var backgroundY = $("#sidebarToggler").css("background-position").split("px ")[1];
        $("#sidebarToggler").css({
            "right": "0px",
            "background-position": "-50px " + backgroundY
        });
        $("#sidebar, #sidebar h2,#sidebarfooter").css({
            "right": "-290px"
        });
        console.debug("background pos sidebar", $("#sidebarToggler").css("background-position"));

    }, function(){
        $("#sidebarToggler").css({
            "right": "",
            "background-position": ""
        })
        $("#sidebar, #sidebar h2,#sidebarfooter").css({
            "right": ""
        })
    });

    
    // Thumbnail animation
   /*
	$('.thumbnail').animate({
            height: "100%",
            width: "100%"
        }, 2000);
        
  
    
    $('.thumbnail').mouseleave(function(event){
    
        $target = (event.target);
        
        $($target).stop().animate({
            height: originalThumbnailHeight,
            width: originalThumbnailWidth
        }, 500).delay(500);
        
    });
    */
    /*
     * Update DOM sizes after window resizing
     */
    function updateViewPort(){
        var viewPortHeight = $(window).height();
        var viewPortWidth = $(window).width();
		if(viewPortWidth>945){
			//sidebarPreToggled();
		}
        var sidebarHeight = viewPortHeight - 101;
        // console.debug("Sidebar height", sidebarHeight);
        $("#sidebar").css({
            "height": sidebarHeight + "px"
        });
        $("map_canvas").css({
            "height": viewPortHeight,
            "width": viewPortWidth
        });
        $("html").css({
            "height": viewPortHeight,
            "width": viewPortWidth
        });
        $("body").css({
            "height": viewPortHeight,
            "width": viewPortWidth
        });
        $("#container").css({
            "height": viewPortHeight,
            "width": viewPortWidth
        });
    };
    
    };
