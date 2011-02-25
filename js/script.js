onload = function(){
    var markersArray = [];
    var map;
    var sorter = null;
    var mapLoaded = null;
    var itemList;
    var indexOfTopItem = 0;
    var currentpage = 1;
    var apiKey = '3a9d95e676b55f9ef5e844dcc98d6959';
    var photoId;
    var liRatio = 240 / 124;
    
    /*
     * actions on load
     */
    createMap();
    updateViewPort();
    activateSortButtons();
    backupLocation();
    
    /*
     * hover the togglebuttons
     */
    var toggleHover = {
    
        on: function(){
            var backgroundX = $(this).css("background-position").split("px")[0];
            $(this).css({
                "background-position": backgroundX + "px -25px"
            });
        },
        off: function(){
            var backgroundX = $(this).css("background-position").split("px")[0];
            $(this).css({
                "background-position": backgroundX + "px 0px"
            });
        }
    };
    
    $("#footertoggler").hover(toggleHover.on, toggleHover.off);
    $("#sidebarToggler").hover(toggleHover.on, toggleHover.off);
    
    /*
     * Rezise dom elements on browser resize
     */
    $(window).resize(function(){
        updateViewPort();
		pager();
    });
    
	
    /*
     * toggle the footer
     */
    $("#footertoggler").toggle(function(){
        var backgroundY = $("#footertoggler").css("background-position").split("px ")[1];
        $("#footertoggler").css({
            "bottom": "190px",
            "background-position": "-75px " + backgroundY
        });
        $("#footer").css({
            "height": "200px"
        });
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
     * toggle the sidebar
     */
    $("#sidebarToggler").toggle(function(){
        var backgroundY = $("#sidebarToggler").css("background-position").split("px ")[1];
        $("#sidebarToggler").css({
            "right": "0px",
            "background-position": "-25px " + backgroundY
        });
        $("#sidebar, #sidebar h2,#sidebarfooter").css({
            "right": "-290px"
        });
        
    }, function(){
        $("#sidebarToggler").css({
            "right": "",
            "background-position": ""
        })
        $("#sidebar, #sidebar h2,#sidebarfooter").css({
            "right": ""
        })
    });
    
    /*
     * Make map and add listners
     */
    function createMap(){
        var latlng; 
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
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        
        
        /* checks if map is loaded, if it is than update on drag */

        google.maps.event.addListener(map, 'dragend', function(){
            refreshPage("something");
        });
        
        google.maps.event.addListener(map, 'zoom_changed', function(){
            refreshPage("something");
        });

        google.maps.event.addListener(map, 'bounds_changed', function(){
            refreshPage("something");
            google.maps.event.clearListeners(map, 'bounds_changed');
        });
    };

    /*
     * Adds click events on sorter buttons "on load"
     */
    function activateSortButtons(){
        $("li.found").click(function(){
            $('body').removeClass();
            $('body').addClass('found');
            var choice = "found";
            currentpage = 1;
            indexOfTopItem = 0;
            refreshPage(choice);
            return false;
        });
        $("li.lost").click(function(){
            $('body').removeClass();
            $('body').addClass('lost');
            var choice = "lost";
            currentpage = 1;
            indexOfTopItem = 0;
            refreshPage(choice);
            return false;
        });
        $("li.all").click(function(){
            $('body').removeClass();
            $('body').addClass('all');
            var choice = "all";
            currentpage = 1;
            indexOfTopItem = 0;
            refreshPage(choice);
            return false;
        });
    }
    /*
     * Refreshes markers on maps cordinates, takes lost or/and found.
     * the it calls db.php to do a request.
     * restkt data is stored in itemList. 
     * afterwords it calls drawmarkers() and pager()
     */
    function refreshPage(choice){
        if (choice == "lost" || choice == "found") {
            sorter = choice;
        }
        else
            if (choice == "all") {
                sorter = null;
            }
        itemList = [];
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
                itemList = data;
                drawMarkers(data);
                pager();
            });
        }
        else {
            $.getJSON("db.php", {
                "xstart": southWest.Ba,
                "xend": northEast.Ba,
                "ystart": southWest.za,
                "yend": northEast.za
            }, function(data){
                itemList = data;
                drawMarkers(data);
                pager();
            });
        }
    }
    /*
     * Clears all markers and print the new ones
     * and adds events. last but not least they are stored in markersArray
     * and a marker has the same index as a item has in itemList.
     * do i dare say some kind of #map????
     */
    function drawMarkers(data){
		
        clearOverlays();
		
        $.each(data, function(i, item){
            var point = new google.maps.LatLng(item.lat, item.long);
            
            if (item.lost_found == "lost") {
                var image = "layout/lost-icon.png";
                var marker = new google.maps.Marker({
                    position: point,
                    icon: image,
                    map: map,
                    title: item.title
                });
                google.maps.event.addListener(marker, 'click', function(){
                    displayItemPage(i);
                });
            }
            else 
                if (item.lost_found == "found") {
                    var image = "layout/found-icon.png";
                    var marker = new google.maps.Marker({
                        position: point,
                        icon: image,
                        map: map,
                        title: item.title
                    });
                    google.maps.event.addListener(marker, 'click', function(){
                        displayItemPage(i);
                    });
                }
                else {
                    var marker = new google.maps.Marker({
                        position: point,
                        map: map
                    });
                }
            
            markersArray.push(marker);
            
        });
    };
	
	/*
	 * Clears every marker as is in the array
	 * after it get flushed like yestedays dinner
	 */
    function clearOverlays(){
        if (markersArray) {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
        };
		markersArray=[];
    }
    
    /*
     * Gets your current position if user accepts it
     * 
     * This is currently inactivated because I wanted to throw 
     * my computer at a wall. buggy as downsouth!!
     * maby activate it by a button but not on starup!!!!!!
     *
     * if (navigator.geolocation) { browserSupportFlag = true;
     * navigator.geolocation.getCurrentPosition(function(position){ latlng = new
     * google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     * map.setCenter(latlng); }, function(){ backupLocation(); }); // Try Google
     * Gears Geolocation } else if (google.gears) { browserSupportFlag = true;
     * var geo = google.gears.factory.create('beta.geolocation');
     * geo.getCurrentPosition(function(position){ latlng = new
     * google.maps.LatLng(position.latitude, position.longitude);
     * map.setCenter(latlng); }, function(){ backupLocation(); }); // Browser
     * doesn't support Geolocation } else { browserSupportFlag = false;
     * backupLocation(); }
     */
	
	
    /*
     * If user don't accept your location find by ip-location
     * its not perfekt due too the ip adress often comes from a node
     * but zoomlevel makes it hardly noticable
     */
    function backupLocation(){
        $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data){
            latlng = new google.maps.LatLng(data.geoplugin_latitude, data.geoplugin_longitude);
            map.setCenter(latlng);
        });
    };
    
    /*
     * Update DOM sizes after window resizing
     * if you dont add overflow hidden on windowed sized
     * element you get at epeleptic jump when downscaling window
     * nasty! 
     */
    function updateViewPort(){
        var viewPortHeight = $(window).height();
        var viewPortWidth = $(window).width();
        
        $("#map_canvas").css({
            "width": viewPortWidth,
            "height": viewPortHeight-10
        });
        if (viewPortWidth < 960) {
            if ($("#sidebarToggler").css("right") != 0) {
                var backgroundY = $("#sidebarToggler").css("background-position").split("px ")[1];
                $("#sidebarToggler").css({
                    "right": "0px",
                    "background-position": "-25px " + backgroundY
                });
                $("#sidebar, #sidebar h2,#sidebarfooter").css({
                    "right": "-290px"
                });
            }
        }
        else {
            $("#sidebarToggler").css({
                "right": "",
                "background-position": ""
            });
            $("#sidebar, #sidebar h2,#sidebarfooter").css({
                "right": ""
            });
        }
        var sidebarHeight = viewPortHeight - 101;
        $("#sidebar").css({
            "height": sidebarHeight
        });
        var pageHeight = viewPortHeight - 210;
        $("#page").css({
            "height": pageHeight
        });
        $("html").css({
            "height": viewPortHeight-1,
            "width": viewPortWidth
        });
        $("body").css({
            "height": viewPortHeight-1,
            "width": viewPortWidth
        });
        $("#container").css({
            "height": viewPortHeight-1,
            "width": viewPortWidth
        });
		
    };
    
    /*
     * Empty the #page before reconstruct
     */
    function clearPage(){
        $("#title,#item_photo,#item_text,#item_contact,#close,#addform").empty();
        
    };
    /*
     * Draw the new page 
     * i is the index in itemList
     */
    function displayItemPage(i){
        clearPage();
        title = "#title";
        photo = "#item_photo";
        text = "#item_text";
        contact = "#item_contact";
        
        
        $("<h2/>").text(itemList[i].lost_found + " : " + itemList[i].title).appendTo(title);
        if (itemList[i].item_picture_link != null) {
            function x(i){
                getPhotoFromFlickr(itemList[i].item_picture_link, function(photoURL){
                    $("<img src='" + photoURL + "'/>").appendTo(photo);
                });
            }
            x(i);
        }
        else 
            if (itemList[i].where_picture_link != null) {
                $("<img class='thumbnail' src='" +
                itemList[i].where_picture_link +
                "'/>").appendTo(photo);
            }
        if (itemList[i].description != null) {
            $("<p/>").text("Description: " + itemList[i].description).appendTo(text);
        }
        if (itemList[i].datetime != null) {
            $("<p/>").text("Found/lost: " + itemList[i].datetime).appendTo(text);
        }
        else {
            $("<p/>").text("Posted: " + itemList[i].timestamp).appendTo(text);
        }
        if (itemList[i].when_comment != null) {
            $("<p/>").text(itemList[i].when_comment).appendTo(text);
        }
        if (itemList[i].where_street && itemList[i].where_street_no != null) {
            $("<p/>").text("Where: " + itemList[i].where_street + " " +
            itemList[i].where_street_no).appendTo(text);
        }
        if (itemList[i].where_city != null) {
            $("<p/>").text(itemList[i].where_city).appendTo(text);
        }
        if (itemList[i].where_comment != null) {
            $("<p/>").text(itemList[i].where_comment).appendTo(text);
        }
        $("<h3/>").text("Contact").appendTo(contact);
        if (itemList[i].email != null) {
            $("<p/>").text(itemList[i].email).appendTo(contact);
        }
        if (itemList[i].phone != null) {
            $("<p/>").text(itemList[i].phone).appendTo(contact);
        }
        if (itemList[i].contact_street && itemList[i].contact_street_no != null) {
            $("<p/>").text(itemList[i].contact_street + " " +
            itemList[i].contact_street_no).appendTo(contact);
        }
        if (itemList[i].contact_city != null) {
            $("<p/>").text(itemList[i].contact_city).appendTo(contact);
        }
        if (itemList[i].contact_comment != null) {
            $("<p/>").text(itemList[i].contact_comment).appendTo(contact);
        }
        $("<p/>").text("X").appendTo("#close");
        $("#close").click(function(){
            $("#page").css({
                "display": "none",
                "width": pageWidth
            });
        });
        var pageHeight = $(window).height();
        var pageWidth = $(window).width() - 350;
        $("#page").css({
            "display": "block",
            "width": pageWidth
        });
		$("#page").wrapInner('<div id="pageWrapper" />');
	};
      /*
       * Ej färdigt formulär 
       */
	/*function displayItemForm(){
		clearPage();
		$("<form enctype='multipart/form-data' action='uploader.php' method='post' id='addform' />").appendTo("#page");
		$("<input type='hidden' name='MAX_FILE_SIZE' value='100000' />").appendTo("#addform");
		$("<p/>").text("Choose a file to upload:");
		$("<input name='uploadedfile' type='file' />").appendTo("#addform");
		$("<input type='submit' value='Upload File' />").appendTo("#addform");
		$("<br />").appendTo("#addform");
		$("<p/>").text("Title:").appendTo("#addform");
		$("<input type='text' name='title' />").appendTo("#addform");
		$("<br />").appendTo("#addform");
		$("<p/>").text("Description: ").appendTo("#addform");
		$("<input type='text' name='title' />").appendTo("#addform");
		$("<br />").appendTo("#addform");
		$("<p/>").text("City: ").appendTo("#addform");
		$("<input type='text' name='title' />").appendTo("#addform");

		$("<p/ id='close'>").text("X").appendTo("#page");
		$("#close").click(function(){
			$("#page").css({
				"display": "none",
				"width": pageWidth
			});
		});
		var pageHeight = $(window).height();
        var pageWidth = $(window).width() - 350;
        $("#page").css({
            "display": "block",
            "width": pageWidth
        });
        $("#close").css({
			"float": "right"
		});
	};*/
    
    function getPhotoFromFlickr(photoId, callback){
        var photoURL;
        $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=' + apiKey + '&user_id=59832845@N07&format=json&jsoncallback=?', function(data){
            $.each(data.photos.photo, function(i, item){
                if (item.id == photoId) {
                    photoURL = 'http://farm' + item.farm +
                    '.static.flickr.com/' +
                    item.server +
                    '/' +
                    item.id +
                    '_' +
                    item.secret +
                    '_m.jpg';
                    callback(photoURL);
                }
            });
        });
    }
    
	/*
	 * Draws all items that will fit in sidebar takes amount from pager. 
	 * and adds events fore scaling, marker jumping, and page displayer
	 * TODO Break out scaling to an separate function...
	 * if this function was a book it would come out in volymes!!
	 */
	
    function drawSidebarItems(amount){
		$("#itemList").empty();
        $("<ul id='itemListItems'/>").appendTo("#itemList");
        for (var i = indexOfTopItem; i < indexOfTopItem + amount; i++) {
			
            if (itemList[i]) {
        
            var tempLi = $("<li id='sidebarItem" + i + "'/>");
            
			function markerBounce(i,tempLi){
				tempLi.hover(function(){
					markersArray[i].setAnimation(google.maps.Animation.BOUNCE)
				},function(){
					markersArray[i].setAnimation(null)
				});
			};
			markerBounce(i,tempLi);
            if (itemList[i].item_picture_link != null) {
                function addThumbnail(i, tempLi){
                    getPhotoFromFlickr(itemList[i].item_picture_link, function(photoURL){
                        var img = $("<img class='thumbnail' src='" + photoURL + "'/>").appendTo(tempLi);
						img.css({"display":"none"});
                        img.load(function(){
                            var maxWidth = 70; // Max width for the image
                            var maxHeight = 60; // Max height for the image
                            var ratio = 0; // Used for aspect ratio
                            var width = $(this).width(); // Current image width
                            var height = $(this).height(); // Current image height
                            // Check if the current width is larger than the max
                            if (width > maxWidth) {
                                ratio = maxWidth / width; // get ratio for scaling image
                                $(this).css("width", maxWidth); // Set new width
                                $(this).css("height", height * ratio); // Scale height based on ratio
                                height = height * ratio; // Reset height to match scaled image
                                width = width * ratio; // Reset width to match scaled image
                            }
                            
                            // Check if current height is larger than max
                            if (height > maxHeight) {
                                ratio = maxHeight / height; // get ratio for scaling image
                                $(this).css("height", maxHeight); // Set new height
                                $(this).css("width", width * ratio); // Scale width based on ratio
                                width = width * ratio; // Reset width to match scaled image
                            }
							$(this).css({"display":"block"});
                        });
                        img.hover(imageHoverIn, imageHoverOut);
                    });
                }
                addThumbnail(i, tempLi);
            }
            else 
                if (itemList[i].where_picture_link != null) {
                    getPhotoFromFlickr(itemList[i].item_picture_link, function(photoURL){
                        var img = $("<img class='thumbnail' src='" + photoURL + "'/>").appendTo(tempLi);
                        img.hover(imageHoverIn, imageHoverOut);
                    });
                }
                else {
                
                }
            
            $("<div/ class='sidebarTitle " + itemList[i].lost_found + "'>").text(itemList[i].lost_found + ": " + itemList[i].title).appendTo($(tempLi));
            if (itemList[i].description != null) {
                $("<div class='sidebarDescription'/>").text("Description: " + itemList[i].description).appendTo($(tempLi));
            }
            if (itemList[i].datetime != null) {
                $("<div/ class='sidebarTime'>").text("When: " + itemList[i].datetime).appendTo($(tempLi));
            }
            else {
                $("<div/ class='sidebarTime'>").text("When: " + itemList[i].timestamp).appendTo($(tempLi));
            }
            tempLi.appendTo("#itemListItems");
            $("#sidebarItem" + i).bind('click', {
                index: i
            }, function(event){
                displayItemPage(event.data.index);
                
            });
        };
		};
            };
    
	/*
	 * this major function is scaling back thumbnails
	 * if some one could make this code more sleek whold bee nice
	 * comments a plenty to engage creativity 
	 */
    function imageHoverOut(){
        $(this).each(function(){
            var maxWidth = 70; // Max width for the image
            var maxHeight = 60; // Max height for the image
            var ratio = 0; // Used for aspect ratio
            var width = $(this).css("width").split("px")[0]; // Current image width
            var height = $(this).css("height").split("px")[0]; // Current image height
            // Check if the current width is larger than the max
            
            // Check if current height is larger than max
            if (height > maxHeight) {
                ratio = maxHeight / height; // get ratio for scaling image
                $(this).animate({
                    "height": maxHeight,
                    "width": width * ratio
                }, 300); // Scale width based on ratio
                height = maxHeight; // Reset height to match scaled image
                width = width * ratio; // Reset width to match scaled image
            }
            if (width > maxWidth) {
                ratio = maxWidth / width; // get ratio for scaling image
                $(this).animate({
                    "height": height * ratio,
                    "width": maxWidth
                }, 100); // Scale width based on ratio
                height = maxHeight; // Reset height to match scaled image
                width = height * ratio; // Reset width to match scaled image
            }
        });
    }
    /*
     * function abnormus for scaling up a thumbnail...
     */
    function imageHoverIn(){
        $(this).each(function(){
            var maxWidth = 260; // Max width for the image
            var maxHeight = 124; // Max height for the image
            var ratio = 0; // Used for aspect ratio
            var width = $(this).css("width").split("px")[0]; // Current image width
            var height = $(this).css("height").split("px")[0]; // Current image height
            // Check if the current width is larger than the max
            // Check if current height is larger than max
            if (height < maxHeight) {
                ratio = maxHeight / height; // get ratio for scaling image
                $(this).stop().animate({
                    "height": maxHeight,
                    "width": width * ratio
                }, 300); // Scale width based on ratio
                height = maxHeight; // Reset height to match scaled image
                width = width * ratio; // Reset width to match scaled image
            }
            if (width > maxWidth) {
                ratio = maxWidth / width; // get ratio for scaling image
                $(this).stop().animate({
                    "height": maxHeight,
                    "width": height * ratio
                }, 100); // Scale width based on ratio
                height = maxHeight; // Reset height to match scaled image
                width = height * ratio; // Reset width to match scaled image
            }
        });
    }
    
	/*
	 * Pager function that pages items and caculates current position in the paging navigation
	 * calls drawSidebarItems()
	 */
    function pager(){
        $("#leftPager").empty();
        $("#currentPage").empty();
        $("#rightPager").empty();
        amount = Math.floor($("#sidebar").height() / 140);
        
        /*If indexOfTopItem is out of order (window resize) set it to the closes topitem rounded down*/
       /* if(index%amount != 0){
			var index = indexOfTopItem+1;
			for(var i = 0; i < amount; i++){
				index-= 1;
				if(index%amount == 0){
					break;
				}
			}
			update page properly
			currentpage = index/amount;
			indexOfTopItem = index-1;
		}*/
        var numberOfItems = itemList.length;
        var topPage = Math.ceil(numberOfItems / amount);
        var slatt = numberOfItems % amount;
        
		if(topPage != Infinity && topPage != 1){
			$("<span/ class='pagebutton'>").text(1).appendTo("#leftPager").click(function(){
				currentpage = 1;
				indexOfTopItem = 0;
				pager();
			});
			if (currentpage > 1) {
				$("<span/ class='pagebutton'>").text("Previous").appendTo("#leftPager").click(function(){
					indexOfTopItem -= amount;
					currentpage--;
					if(indexOfTopItem<0||currentpage<1){
						indexOfTopItem = 0;
						currentpage=1;
					}
					pager();
				});
			}
			$("<span/ class='current'>").text(currentpage).appendTo("#currentPage")
			$("<span/ class='pagebutton'>").text(topPage).appendTo("#rightPager").click(function(){
				currentpage = topPage;
				indexOfTopItem = (topPage-1)*amount ;
				pager();
			});
			if(currentpage < topPage) {
				$("<span/ class='pagebutton'>").text("Next").appendTo("#rightPager").click(function(){
					indexOfTopItem += amount;
					currentpage++;
					pager();
				});
			}
		}
		$("#sidebarfooter").empty();
		/*$("<span/ class='pagebutton formbutton'>").text("NEW FORM").appendTo("#sidebarfooter").click(function(){
			displayItemForm();
		});*/
        if (currentpage == topPage && slatt != 0) {
            drawSidebarItems(slatt);
        }
        else {
            drawSidebarItems(amount);
        }
        // alert(amount);
        // alert(numberOfTopItem);
    }
};
