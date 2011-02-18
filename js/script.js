onload = function(){
    var originalThumbnailWidth = $('.thumbnail').width();
    var originalThumbnailHeight = $('.thumbnail').height();
    
    
    $(window).resize(function(){
        updateViewPort();
    });
    
    
    
    
    
    $("#footertoggler").hover(function(){
        var backgroundX=$(this).css("background-position").split("px")[0];
        console.debug("x",backgroundX+"px -50px");
        $(this).css({
            "background-position": backgroundX+"px -50px"
        });
    }, function(){
        $(this).css({
            "background-position": backgroundX+"px 0px"
        })
    });
    
    $("#footertoggler").toggle(function(){
        var backgroundY=$(this).css("background-position").split("px")[1];
        	console.debug("y this",$(this));
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
        var sidebarHeight = viewPortHeight - 101;
        console.debug("Sidebar height", sidebarHeight);
        $("#sidebar").css({
            "height": sidebarHeight + "px"
        });
    };
    
    };
