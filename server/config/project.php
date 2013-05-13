<?php 

 CrownConfig::$platform = "";
 CrownConfig::$serverUrl = "http://188.93.17.194/crown/server/";
 CrownConfig::$deployKey = "admin";
 CrownConfig::$maintenance = false;
 CrownConfig::$maintenanceMsg = "";
 CrownConfig::$plugins = "";

 CrownConfig::$dataServers = array (
	 array("id" => "spot1", "host" => "127.0.0.1", "port" => "6379", "database" => "1", "password" => "", "free" => "1"),
	 array("id" => "main", "host" => "127.0.0.1", "port" => "6379", "database" => "0", "password" => "", "free" => "1")
 );