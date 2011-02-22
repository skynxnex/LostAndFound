onload = function() {
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();

	updateViewPort();
	$(window).resize(function() {
		updateViewPort();
	});
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

		// Gets the sw corner and ne corner of the map
		// Look in debug for printout
		// Function executes after map is loaded
		google.maps.event.addListener(map, 'bounds_changed', function() {
			var bounds = map.getBounds();
			var southWest = bounds.getSouthWest();
			var northEast = bounds.getNorthEast();
			$.getJSON("db.php", {
				'amount' : 'viewport',
				"swlat" : southWest.za,
				"swlong" : southWest.Ba,
				"nelat" : northEast.za,
				"nelong" : northEast.Ba
			}, drawMarkers);
			function drawMarkers(data) {
				$.each(data,
						function(i, coords) {
							var point = new google.maps.LatLng(coords.lat, coords.long);
							if(coords.lost_found == "lost"){
							var image = "layout/lost-icon.png";
							
								var marker = new google.maps.Marker( {
									position : point,
									icon: image,
									map : map
								});
							} else if(coords.lost_found == "found"){
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
						});
			};
		});

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