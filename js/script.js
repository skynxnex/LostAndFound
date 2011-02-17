onload = function(){
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

};