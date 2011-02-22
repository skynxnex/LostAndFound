onload = function() {
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();
	var markersArray = [];
	var sorter=null;
	var mapLoaded=null;
	
	/*
	 * Rezise dom elements on load
	 */
	updateViewPort();
	/*
	 * Rezise dom elements on browser resize
	 */
	$(window).resize(function() {
		updateViewPort();
	});
	/*
	 * Make map on load
	 * and add to DOM element
	 * TODO check Y initialize wrapps so much
	 */
	initialize();
	function initialize() {
		var latlng; // = new google.maps.LatLng(59.309888773597095,
		// 18.050005859375005);
		var myOptions = {
			zoom : 5,
			center : latlng,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"),
				myOptions);

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
		if(mapLoaded){
			google.maps.event.addListener(map, 'dragend', function() {
				refreshPage("something");
			});
		} else{
		google.maps.event.addListener(map, 'bounds_changed', function() {			
				refreshPage("something");
				mapLoaded=true;
				google.maps.event.clearListeners(map, 'bounds_changed');
			});
		}
		/*
		 * Refreshes markers on map, takes lost and found changes
		 * default is all.
		 */
		function refreshPage(choice){
			if(choice=="lost"||choice=="found"){
				sorter=choice;
			} else if(choice=="all"){
				sorter=null;
			}
			var bounds = map.getBounds();
			var southWest = bounds.getSouthWest();
			var northEast = bounds.getNorthEast();
			if(sorter){
				$.getJSON("db.php", {
					"mainsort" : sorter,
					"xstart" : southWest.Ba,
					"xend" : northEast.Ba,
					"ystart" : southWest.za,
					"yend" : northEast.za			
					}, drawMarkers);
			}else{
				$.getJSON("db.php", {
					"xstart" : southWest.Ba,
					"xend" : northEast.Ba,
					"ystart" : southWest.za,
					"yend" : northEast.za			
					}, drawMarkers);
			}
		}
		/*
		 *	Clears all markers and print the current ones
		 */
		function drawMarkers(data) {
				clearOverlays();
				$.each(data,
				function(i, item) {
					var point = new google.maps.LatLng(item.lat, item.long);
					console.debug(item.lat, item.long);
					if(item.lost_found == "lost"){
						var image = "layout/lost-icon.png";
						var marker = new google.maps.Marker( {
						position : point,
						icon: image,
						map : map
					});
				} else if(item.lost_found == "found"){
					var image = "layout/found-icon.png";
						var marker = new google.maps.Marker( {
							position : point,
							icon: image,
							map : map
					});
				} else {
						var marker = new google.maps.Marker( {
							position : point,
							map : map
						});
				}
					markersArray.push(marker);
				});
		};
		/*
		 * Clear marker function
		 */
		function clearOverlays() {
			if (markersArray) {
				for (i in markersArray) {
					markersArray[i].setMap(null);
				}
			}
		}

		/*
		 * Gets your current position if user accepts it
		 */
		if (navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				latlng = new google.maps.LatLng(position.coords.latitude,
						position.coords.longitude);
				map.setCenter(latlng);
			}, function() {
				backupLocation();
			});
			// Try Google Gears Geolocation
		} else if (google.gears) {
			browserSupportFlag = true;
			var geo = google.gears.factory.create('beta.geolocation');
			geo.getCurrentPosition(function(position) {
				latlng = new google.maps.LatLng(position.latitude,
						position.longitude);
				map.setCenter(latlng);
			}, function() {
				backupLocation();
			});
			// Browser doesn't support Geolocation
		} else {
			browserSupportFlag = false;
			backupLocation();
		}
		
		
		/*
		 * If user don't accept your location find by ip-location
		 */
		function backupLocation() {
			$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?',
					function(data) {
						latlng = new google.maps.LatLng(
								data.geoplugin_latitude,
								data.geoplugin_longitude);
						console.debug(data.geoplugin_latitude,
								data.geoplugin_longitude);
						map.setCenter(latlng);
					});
		}
		;
	}
	;
	/*
	 * hover the togglebutton for the footer
	 */
	$("#footertoggler").hover(function() {
		console.debug("d�", $(this));
		// console.debug("hover element",$(this));
			$(this).css( {
				"background" : "url(layout/uparrowg.png)"
			});
		}, function() {
			$(this).css( {
				"background" : "url(layout/uparrow.png)"
			})
		});
	
	/*
	 * Toggles the footer up and down
	 */
	$("#footertoggler").toggle(function() {
		$(this).css( {
			"bottom" : "190px",
			"background-position" : "-150px " + backgroundY
		})
		$("#footer").css( {
			"height" : "200px"
		})
	}, function() {
		console.debug("y this", $(this));
		$(this).css( {
			"bottom" : "0px",
			"background-position" : "-100px " + backgroundY
		})
		$("#footer").css( {
			"height" : "10px"
		})
	});

	// Thumbnail animation
	$('.thumbnail').mouseenter(function(event) {

		$target = (event.target);

		$($target).animate( {
			height : "100%",
			width : "100%"
		}), 2000;

	});

	$('.thumbnail').mouseleave(function(event) {

		$target = (event.target);

		$($target).stop().animate( {
			height : originalThumbnailHeight,
			width : originalThumbnailWidth
		}, 500).delay(500);

	});

	/*
	 * Update DOM sizes after window resizing
	 */
	function updateViewPort() {
		var viewPortHeight = $(window).height();
		var viewPortWidth = $(window).width();
		var sidebarHeight = viewPortHeight - 101;
		// console.debug("Sidebar height", sidebarHeight);
		$("#sidebar").css( {
			"height" : sidebarHeight + "px"
		});
		$("map_canvas").css( {
			"height" : viewPortHeight,
			"width" : viewPortWidth
		});
		$("html").css( {
			"height" : viewPortHeight,
			"width" : viewPortWidth
		});	
		$("body").css( {
			"height" : viewPortHeight,
			"width" : viewPortWidth
		});	
		$("#container").css( {
			"height" : viewPortHeight,
			"width" : viewPortWidth
		});	
	}
	;

};
