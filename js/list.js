$(function() {

	callAPI();

	function callAPI() {
		$.getJSON("db.php",{'amount':'all'}, drawAdds);
	}

	function drawAdds(data) {
		$.each(data, function(i, ad) {
			tempUl = $("<ul/>").addClass("sidebarItem"+i);
			$("<img class='thumbnail' src='"+ad.item_picture_link+"'/>").appendTo($(tempUl));
			$("<li/>").text(ad.lost_found).appendTo($(tempUl));
			$("<li class='sidebarTitle'/>").text("What: "+ad.title).appendTo($(tempUl));
			$("<li class='sidebarDescription'/>").text("Description: "+ad.description).appendTo($(tempUl));
			$("<li/ class='sidebarTime'>").text("When: "+ad.timestamp).appendTo($(tempUl));
			tempUl.appendTo("#itemList");
			$(".sidebarItem"+i).click(function(event) {
				$("#title").empty();
				$("<h2/>").text(ad.lost_found+" : "+ad.title).appendTo("#title");
				$("#item_photo").empty();
				$("<img src='"+ad.item_picture_link+"'/>").appendTo("#item_photo");
				$("#item_text").empty();
				$("<p/>").text(ad.description).appendTo("#item_text");
				$("<p/>").text(ad.contact_comment).appendTo("#item_text");
				
			});
		});
	};
});