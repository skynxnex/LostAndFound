$(function(){
	
	callAPI();
	
	function callAPI() {
		console.debug("nu provas getJSON");
		// $.getJSON("db.php",{'amount':'all'}, getAdds);
		$.getJSON("db.php",getAdds);
	}
	
	function getAdds(data) {
		console.debug("inne i getAdds funktionen");
		$.each(data, function(i,d) {
			// $("<h3/>").text(ad.name).appendTo($("#itemlist"));
//			$("<li/").appendTo($("#item"+i));
//			$("<img class='thumbnail' src='"+ad.item_picture_link +"' />").appendTo($("#item"+i));
//			$("<ul/>").appendTo($("#item1"));
//			$("<li class='what'><a href=''>"+ad.description+"</a></li>").appendTo($("#item"+i));
//			$("<li class='when'><a href=''>"+ad.timestamp+"</a></li>")
//			$("<li class='where'><a href=''>"+ad.where_city+"</a></li>").appendTo($("#item"+i));
		});
	};
	
});