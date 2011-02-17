<?php
/*	$temp = $_GET["amount"];
	if($temp=="all")) {
			getAll();
	}else if ($temp == 'id') {
		getOne(1);
	} */
		// Tillfälliga inställningar för lokalt
		// $host = "localhost";
		// $user = "root";
		// $pass = "root";
		// $db = = "test";
	
		// Inställningar när 3306 porten funkar
		// $host = "mysql38.kontrollpanelen.se:3306";
		// $user = "web74565_LnF65";
		// $pass = "g9L8UD7Z";
		// $db = "web74565_LnF65";
		
	getAll();
	function connect() {
		$connection = mysql_connect("localhost","root","root") or die ('Kunde inte koppla upp mot databasen: ' . mysql_error());
		if ($connection) {
			echo ("uppkoppling till databas lyckades");
			   mysql_select_db("test");	
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