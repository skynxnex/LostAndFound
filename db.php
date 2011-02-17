<?php

		getAll();


	function connect() {
		$connection = mysql_connect('localhost','root','root') or die ('Kunde inte koppla upp mot databasen' . mysql_error());
		if ($connection) {
			   mysql_select_db('test');	
			   mysql_query('set names utf8');
			return true;
		} else {
			return false;
		}
    }

    function getAll() {
    connect();
    $sql = "SELECT * FROM `annons`";
	$result = mysql_query($sql);
    while($row = mysql_fetch_assoc($result)) {
		$return[] = $row;
		}
		echo json_encode($return);
    }
?>