$(function() {

	callAPI();

	function callAPI() {
		$.getJSON("db.php",{'amount':'all'}, drawAdds);
	}

	function drawAdds(data) {
		$.each(data, function(i, ad) {
			tempUl = $("<ul/>").addClass("sidebarItem"+i);
			if(ad.item_picture_link != null){
				$("<img class='thumbnail' src='"+ad.item_picture_link+"'/>").appendTo($(tempUl));
			} else if(ad.where_picture_link != null){
				$("<img class='thumbnail' src='"+ad.where_picture_link+"'/>").appendTo($(tempUl));
			}
			$("<li/>").text(ad.lost_found).appendTo($(tempUl));
			$("<li class='sidebarTitle'/>").text("What: "+ad.title).appendTo($(tempUl));
			if(ad.description != null){
				$("<li class='sidebarDescription'/>").text("Description: "+ad.description).appendTo($(tempUl));
			}
			if(ad.datetime != null){
				$("<li/ class='sidebarTime'>").text("When: "+ad.datetime).appendTo($(tempUl));
			} else {
				$("<li/ class='sidebarTime'>").text("When: "+ad.timestamp).appendTo($(tempUl));
			}
			tempUl.appendTo("#itemList");
			$(".sidebarItem"+i).click(function(event) {	
				
				title = "#title";
				photo = "#item_photo";
				text = "#item_text";
				contact = "#item_contact";
				
				$("#title").empty();
				$("<h2/>").text(ad.lost_found+" : "+ad.title).appendTo(title);
				$("#item_photo").empty();
				if(ad.item_picture_link != null){
					$("<img src='"+ad.item_picture_link+"'/>").appendTo(photo);
				} else if(ad.where_picture_link != null){
					$("<img src='"+ad.where_picture_link+"'/>").appendTo(photo);
				}
				$("#item_text").empty();
				if(ad.description != null){
					$("<p/>").text("Description: " + ad.description).appendTo(text);
				}
				if(ad.datetime != null){
					$("<p/>").text("Found/lost: " + ad.datetime).appendTo(text);
				} else {
					$("<p/>").text("Posted: " + ad.timestamp).appendTo(text);
				}
				if(ad.when_comment != null){
					$("<p/>").text(ad.when_comment).appendTo(text);	
				}
				if(ad.where_street && ad.where_street_no != null){
					$("<p/>").text("Where: " + ad.where_street + " " + ad.where_street_no).appendTo(text);
				}
				if(ad.where_city != null){
					$("<p/>").text(ad.where_city).appendTo(text);
				}
				if(ad.where_comment != null){
					$("<p/>").text(ad.where_comment).appendTo(text);
				}
				$("#item_contact").empty();
				$("<h3/>").text("Contact").appendTo(contact);
				if(ad.email != null){
					$("<p/>").text(ad.email).appendTo(contact);
				}
				if(ad.phone != null){
					$("<p/>").text(ad.phone).appendTo(contact);
				}
				if(ad.contact_street && ad.contact_street_no != null){
					$("<p/>").text(ad.contact_street + " " + ad.contact_street_no).appendTo(contact);
				}
				if(ad.contact_city != null){
					$("<p/>").text(ad.contact_city).appendTo(contact);
				}
				if(ad.contact_comment != null){
					$("<p/>").text(ad.contact_comment).appendTo(contact);
				}
				$("#close").empty();
				$("<p/>").text("X").appendTo("#close");
				$("#close").click(function(){
					$("#page").css( {
					"display" : "none",
					"width" : pageWidth
					});	
				});
				var pageHeight = $(window).height();
				var pageWidth = $(window).width()-350;
				$("#page").css( {
					"display" : "block",
					"width" : pageWidth
				});	
			});
		});
	};
});