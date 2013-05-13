<?php


class CrownConfig
{
    // Deploy
    public static $deployKey = "admin";

    // Server
    public static $serverUrl= "";
    public static $serverAPI = "default";
    public static $serverOnline = true;
    public static $serverAuthKey = "NFFDERER";

    // Debug
    public static $serverDebug = true;
    public static $serverLog = true;

    // Maintenance
    public static $maintenance = false;
    public static $maintenanceMsg = "Server is on the short maintenance now";

    //Assets
    public static $grids; //array stores all config grids
    public static $gridsJSON; // serialised grids

    // Platform parameters array
    public static $platform;

    // Redis database
    public static $dataServers = null;
    /* array(
        array("id" => "main", "host" => "127.0.0.1", "port" => 6379, "password" => "", "database" => 1),
        array("id" => "spot1", "host" => "127.0.0.1", "port" => 6379, "database" => 0, "free" => true ),
    ); */

    // Date
    public static $dateFullFormat = "y-m-d, H:i:s";

    // Time, that users is counted as online
    public static $onlineTimeRange = 60;


    // Hash algorithms
    public static $userNameHash = "crc32";
    public static $userPasswordHash = "md5";

    // Grade modules list
    public static $modules = array("Plugin", "DB", "Grids", "User");

    // Plugins list
    public static $plugins = null;

}


?>