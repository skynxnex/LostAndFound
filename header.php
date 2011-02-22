<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="js/jquery.js" type="text/javascript" language="javascript"></script>
	<script src="http://maps.google.com/maps/api/js?sensor=true" type="text/javascript" language="javascript"></script>
	<script src="http://code.google.com/apis/gears/gears_init.js" type="text/javascript" language="javascript"></script>
	<script src="js/script.js" type="text/javascript" language="javascript"></script>
	<script src="js/list.js" type="text/javascript" language="javascript"></script>
	<script src="js/navigation.js" type="text/javascript" language="javascript"></script>
	<title>LostAndFound webApp</title>
	<link rel="stylesheet" href="styles.css" type="text/css" />
</head>


<body class="all">
	

	<div id="container">
		
<div id="map_canvas"></div>
		<div id="header">
			<h1 id="logo">Lost And Found</h1>
			<div id="nav">
				<ul>
					<li id="tools"><span>Tools</span></li>
					<li class='lost'><a href='index.php?view=lost' class='selected' title='home page'>Lost</a></li>
					<li class='found'><a href='index.php?view=found' title='CSS and XHTML web templates'>Found</a></li>
					<li class='all'><a href='index.php?view=all' title='web scripts'>All</a></li>
				</ul>
				<form action="#" method="get">
					<p>
						<input type="text" name="q" value="Search..." />
						<input type="submit" value="Go" class="button" />
					</p>
				</form>
			</div>
		</div>
