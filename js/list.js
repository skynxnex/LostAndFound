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
				if(ad.item_picture_link != null){
					$("<img src='"+ad.item_picture_link+"'/>").appendTo("#item_photo");
				} else if(ad.where_picture_link != null){
					$("<img src='"+ad.where_picture_link+"'/>").appendTo("#item_photo");
				}
				$("#item_text").empty();
				if(ad.description != null){
					$("<p/>").text("Description: " + ad.description).appendTo("#item_text");
				}
				if(ad.datetime != null){
					$("<p/>").text("Found/lost: " + ad.datetime).appendTo("#item_text");
				} else {
					$("<p/>").text("Posted: " + ad.timestamp).appendTo("#item_text");
				}
				if(ad.when_comment != null){
					$("<p/>").text(ad.when_comment).appendTo("#item_text");	
				}
				if(ad.where_street && ad.where_street_no != null){
					$("<p/>").text("Where: " + ad.where_street + " " + ad.where_street_no).appendTo("#item_text");
				}
				if(ad.where_city != null){
					$("<p/>").text(ad.where_city).appendTo("#item_text");
				}
				if(ad.where_comment != null){
					$("<p/>").text(ad.where_comment).appendTo("#item_text");
				}
				$("#item_contact").empty();
				$("<h3/>").text("Contact").appendTo("#item_contact");
				if(ad.email != null){
					$("<p/>").text(ad.email).appendTo("#item_contact");
				}
				if(ad.phone != null){
					$("<p/>").text(ad.phone).appendTo("#item_contact");
				}
				if(ad.contact_street && ad.contact_street_no != null){
					$("<p/>").text(ad.contact_street + " " + ad.contact_street_no).appendTo("#item_contact");
				}
				if(ad.contact_city != null){
					$("<p/>").text(ad.contact_city).appendTo("#item_contact");
				}
				if(ad.contact_comment != null){
					$("<p/>").text(ad.contact_comment).appendTo("#item_contact");
				}
					
			});
		});
	};
});