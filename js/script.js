onload = function(){
    var originalThumbnailWidth = $('.thumbnail').width();
    var originalThumbnailHeight = $('.thumbnail').height();
    var markersArray = [];
    var map;
    var sorter = null;
    var mapLoaded = null;
    var itemList;
    var indexOfTopItem = 0;
    var currentpage = 1;
    
    /*
     * actions on load
     */
    initialize();
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
            //console.debug("hover prop on",$(this).css("background-position"));
        },
        off: function(){
            var backgroundX = $(this).css("background-position").split("px")[0];
            $(this).css({
                "background-position": backgroundX + "px 0px"
            });
            console.debug("hover prop off", $(this).css("background-position"));
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
     * toggle the sidebar
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
    
    
    
    
    
    /*
     * Make map
     * and add listners
     */
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
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        
        
        
        /* checks if map is loaded, if it is than update on drag */
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
        
        
    };
    /*
     * Adds click events on sorter buttons "on load"
     */
    function activateSortButtons(){
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
    }
    /*
     * Refreshes markers on map, takes lost and found changes
     * default is all.
     */
    function refreshPage(choice){
        if (choice == "lost" || choice == "found") {
            sorter = choice;
        } else if (choice == "all") {
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
				itemList = data;
				pager();
                drawMarkers(data);
                console.debug(itemList[0].title);
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
                console.debug(itemList[0].title);
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
     function drawPaging(data){
     if(page > 1 && page < data.length()){
     $("<a/>").appendTo("#sidebarfooter").addClass("pagelinkBack").text("<");
     $("<a/>").appendTo("#sidebarfooter").addClass("pagelinkForth").text(">");
     }else if(page == 1){
     $("<a/>").appendTo("#sidebarfooter").addClass("pagelinkForth").text(">");
     }else if(page == data.length()){
     $("<a/>").appendTo("#sidebarfooter").addClass("pagelinkBack").text("<");
     }
     if($(".pagelinkForth").click()){
     page+=1;
     }
     if($(".pagelinkBack").click()){
     page-=1;
     }
     
     var amount = $("#sidebar").height()/140;
     for(var i = page;  i < amount ; i++){
     var tempArray = new Array();
     tempArray[] = data[i];
     drawAdds(tempArray);
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
        $("#map_canvas").css({
            "width": viewPortWidth,
            "height": viewPortHeight
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
        // console.debug("Sidebar height", sidebarHeight);
        $("#sidebar").css({
            "height": sidebarHeight
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
    
    
    /*
     * Empty the #page before reconstruct
     */
    function clearPage(){
        $("#title,#item_photo,#item_text,#item_contact,#close").empty();
        
    };
    /*
     * Draw the new page
     */
    function displayItemPage(i){
    
        clearPage();
        title = "#title";
        photo = "#item_photo";
        text = "#item_text";
        contact = "#item_contact";
        
        console.debug("Sidans alla ojekt", itemList);
        
        $("<h2/>").text(itemList[i].lost_found + " : " + itemList[i].title).appendTo(title);
        if (itemList[i].item_picture_link != null) {
            $("<img src='" + itemList[i].item_picture_link + "'/>").appendTo(photo);
        }
        else 
            if (itemList[i].where_picture_link != null) {
                $("<img src='" + itemList[i].where_picture_link + "'/>").appendTo(photo);
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
            $("<p/>").text("Where: " + itemList[i].where_street + " " + itemList[i].where_street_no).appendTo(text);
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
            $("<p/>").text(itemList[i].contact_street + " " + itemList[i].contact_street_no).appendTo(contact);
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
        
    };
    
    function drawAdds(amount) {
		$("#itemList").empty(); 
		console.debug("itemlist:",amount, indexOfTopItem, itemList);
		var udda = amount%numberOfItems;
		
		for(var i = indexOfTopItem; i < indexOfTopItem+amount; i++){	
			tempUl = $("<ul/>").addClass("sidebarItem"+i);
			
			if(itemList[i].item_picture_link != null){
				$("<img class='thumbnail' src='"+itemList[i].item_picture_link+"'/>").appendTo($(tempUl));
			} else if(itemList[i].where_picture_link != null){
				$("<img class='thumbnail' src='"+itemList[i].where_picture_link+"'/>").appendTo($(tempUl));
			}
			$("<li/>").text(itemList[i].lost_found).appendTo($(tempUl));
			$("<li class='sidebarTitle'/>").text("What: "+itemList[i].title).appendTo($(tempUl));
			if(itemList[i].description != null){
				$("<li class='sidebarDescription'/>").text("Description: "+itemList[i].description).appendTo($(tempUl));
			}
			if(itemList[i].datetime != null){
				$("<li/ class='sidebarTime'>").text("When: "+itemList[i].datetime).appendTo($(tempUl));
			} else {
				$("<li/ class='sidebarTime'>").text("When: "+itemList[i].timestamp).appendTo($(tempUl));
			}
			tempUl.appendTo("#itemList");
			$(".sidebarItem"+i).click(function(event) {	
				
				displayItemPage(i);

			});
		};
	};
    function pager(){
		$("#pager").empty();
		var numberOfItems = itemList.length;
		console.debug("itemlist:", itemList);
		var amount = Math.floor($("#sidebar").height()/140);
		$("<a/>").text("Previous").appendTo("#pager").addClass("pagelink").click(function(){
			if(currentpage > 1){
					indexOfTopItem -= amount;
					currentpage--; 
			}
		});
		$("<a/>").text("Next").appendTo("#pager").addClass("pagelink").click(function(){
			if(currentpage < numberOfItems/amount){
					indexOfTopItem += amount; 
					currentpage++;
			}
		});
		drawAdds(amount, indexOfTopItem);
		//alert(amount);
		//alert(numberOfTopItem);
	}   
};
