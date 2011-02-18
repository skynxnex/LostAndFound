onload = function(){
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();
	
	$("#footertoggler").hover(
	function(){
<<<<<<< HEAD
	  	console.debug("d�",$(this));
=======
	  	//console.debug("hover element",$(this));
>>>>>>> bd1d5e7012c9612050ece585d1746f43140124e4
	    $(this).css({
			"background":"url(layout/uparrowg.png)"
		});	
  	}, 
	function(){
	    $(this).css({
			"background":"url(layout/uparrow.png)"
		});	
  });
  
	$("#footertoggler").toggle(function(){
		$(this).css({
			"bottom": "190px"
		});
		$("#footer").css({
			"height": "200px"
		});
	},function(){
		$(this).css({
			"bottom": "0px"
		});
		$("#footer").css({
			"height": "10px"
		});
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