<?php 
	if(isset($_GET["view"])){
		$current = $_GET["view"];
	} else {
		$current ="";
	}
	include("header.php");
?>
<div id="content">
<?php 
		if($current =="lost") {
			include("lost.php");
		}else if($current =="found") {
			include("found.php");
		} else if($current =="item") {
			include("item.php");
		}else {
			include("main.php");
		}
		include("sidebar.php");
?>
	<div id="map_canvas"></div>
	<div class="clear"></div>
</div>
<?php 
	include("footer.php");
?>
