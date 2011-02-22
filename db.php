<?php
if(isset($_GET["amount"])){
	$numbersOfItems = $_GET["amount"];
} else {
	$numbersOfItems ="";
}
	$filter["xstart"] = $_GET["xstart"];
	$filter["xend"] = $_GET["xend"];
	$filter["ystart"] = $_GET["ystart"];
	$filter["yend"] = $_GET["yend"];
	
	if(isset($_GET["mainsort"])){
		$filter["mainsort"] = $_GET["mainsort"];
	}
	
if(isset($filter)) {
	makeQuery($filter);
} else {
	 echo"Error in creating filter array";
}


function makeQuery($filter){
	if(isset($filter["mainsort"])){
		$lostOrFound=" && `lost_found` = \"{$filter[mainsort]}\"";
	} else {
		$lostOrFound="";
	}
	$sql = "SELECT * FROM ad WHERE `lat` > {$filter['ystart']} && `lat` < {$filter['yend']} &&  `long` > {$filter['xstart']} && `long` < {$filter['xend']}".$lostOrFound." ORDER BY timestamp DESC";
	getAllMarkersInViewport($sql);
}

function connect() {
	// Tillfälliga inställningar för lokalt
	$host = "localhost";
	$user = "root";
	$pass = "root";
	$db = "test";

	// Inställningar när 3306 porten funkar
	// $host = "mysql38.kontrollpanelen.se:3306";
	// $user = "web74565_LnF65";
	// $pass = "g9L8UD7Z";
	// $db = "web74565_LnF65";

	$connection = mysql_connect($host,$user,$pass) or die ('Kunde inte koppla upp mot databasen: ' . mysql_error());
	if ($connection) {
		mysql_select_db($db);
		// mysql_select_db("web74565_LnF65");
		mysql_query('set names utf8');
		return true;
	} else {
		return false;
	}
}

function getAll() {
	connect();
	$sql = "SELECT * FROM `ad`";
	$result = mysql_query($sql);
	$return = array();
	while($row = mysql_fetch_assoc($result)) {
		$return[] = $row;
	}
	echo json_encode($return);
}

function getAllMarkersInViewport($sql) {
	connect();
	$result = mysql_query($sql);
	while($row = mysql_fetch_assoc($result)) {
		$return[] = $row;
	}
	echo json_encode($return);
}

function getOne($id) {
	connect();
	$sql = "SELECT * FROM `ad` WHERE id = {$id}";
	$result = mysql_query($sql);
	while($row = mysql_fetch_assoc($result)) {
		$return[] = $row;
	}
	echo json_encode($return);
}
?>
