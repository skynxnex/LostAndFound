<?php 
	$current = $_GET["view"];
	include("header.php");
	include("nav.php");
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
	<div class="clear"></div>
</div>
<?php 
		
		include("footer.php");
?>
