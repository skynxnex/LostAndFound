onload = function(){
	var originalThumbnailWidth = $('.thumbnail').width();
	var originalThumbnailHeight = $('.thumbnail').height();
	
	console.debug("hej");
	$("#footertoggler").hover(
	function(){
	  	console.debug("då",$(this));
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
			 height:"75%",
			 width:"100%"
			}), 2000;
			
	});
		
	$('.thumbnail').mouseleave(function (event){
		
		
		$target = (event.target);
			
			$($target).stop().animate({
				height:originalThumbnailHeight,
				width:originalThumbnailWidth
			}), 2000;
			
	});

};