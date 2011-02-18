onload = function(){
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();
	
	updateViewPort();
	$(window).resize(function(){
        updateViewPort();
    });
	initialize();
	function initialize(){
		var latlng = new google.maps.LatLng(-34.397, 150.644);
		var myOptions = {
		  zoom: 8,
		  center: latlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	};
	
	$("#footertoggler").hover(
	function(){
	  	//console.debug("hover element",$(this));
	    $(this).css({
			"background":"url(layout/uparrowg.png)"
		});	
  	}, 
	function(){
	    $(this).css({
			"background":"url(layout/uparrow.png)"
		})	
  });
  
	$("#footertoggler").toggle(function(){
		$(this).css({
            "bottom": "190px",
			"background-position":"-150px "+backgroundY
        })
        $("#footer").css({
            "height": "200px"
        })
    }, function(){
        console.debug("y this",$(this));
        $(this).css({
            "bottom": "0px",
			"background-position":"-100px "+backgroundY
        })
        $("#footer").css({
            "height": "10px"
        })
    });
    
    //Thumbnail animation
    $('.thumbnail').mouseenter(function(event){
    
        $target = (event.target);
        
        $($target).animate({
            height: "100%",
            width: "100%"
        }), 2000;
        
    });
    
    $('.thumbnail').mouseleave(function(event){
    
    
    
        $target = (event.target);
        
        $($target).stop().animate({
            height: originalThumbnailHeight,
            width: originalThumbnailWidth
        }, 500).delay(500);
        
    });
    
    function updateViewPort(){
        var viewPortHeight = $(window).height();
        var viewPortWidth = $(window).width();
        var sidebarHeight = viewPortHeight - 101;
        console.debug("Sidebar height", sidebarHeight);
        $("#sidebar").css({
            "height": sidebarHeight + "px"
        });
		$("map_canvas").css({
			"height":viewPortHeight,
			"width":viewPortWidth
			})
		    };

    
    };