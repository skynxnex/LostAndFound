$(function(){
	
	callAPI();
	
	function callAPI() {
		$.getJSON("db.php", printMessages);
	}
	
	function printMessages(data) {
		$.each(data, function(i,annons) {
			$("<h3/>").text(annons.name).appendTo($("#title"));
		});
	};
	
});