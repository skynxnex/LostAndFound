onload = function(){
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();
	alert("hej");
	initialize();
	function initialize(){
		alert("hej");
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
			"bottom": "190px"
		})
		$("#footer").css({
			"height": "200px"
		})
	},function(){
		$(this).css({
			"bottom": "0px"
		})
		$("#footer").css({
			"height": "10px"
		})
	});
	
	//Thumbnail animation
	$('.thumbnail').mouseenter(function (event){
		
		$target = (event.target);

			$($target).animate({
			 height:"100%",
			 width:"100%"
			}), 2000;
			
	});
		
	$('.thumbnail').mouseleave(function (event){
		
		
		
		$target = (event.target);
			
			$($target).stop().animate({
				height:originalThumbnailHeight,
				width:originalThumbnailWidth
			}, 500).delay(500);	
	});
};
