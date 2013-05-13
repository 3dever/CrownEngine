<?php

class CrownDB {

    private static $connection;

    /*
    *  Connect to redis database
    */
    public static function connect($config)
    {
        $connection = new Redis();
        $connected = $connection -> connect($config["host"], $config["port"]);
        if($connected && isset($config["password"]) && $config["password"]!= "") $connected = $connection -> auth($config["password"]);
        if($connected && isset($config["database"]) && $config["database"]!= "") $connected = $connection -> select($config["database"]);

        if(!$connected) Crown::error("Database " . $config["id"] . " not available");
        else return $connection;
    }

    /*
    *  Connect to server or it's replica
    */
    public static function query($serverId = "main", $readOnly = false)
    {
        //TODO: if($readOnly) connect and return replica
        if( !isset(self::$connection[$serverId]) ) {
            self::$connection[$serverId] = self::connect( self::getServerConfig( $serverId ) );
        }
        return self::$connection[$serverId];
    }

    /*
    *  Get free spot id
    */
    public static function getFreeServerId()
    {
        foreach(CrownConfig::$dataServers as $config) {
            if( $config["id"] != "main" && $config["free"] ) return $config["id"];
        }
        Crown::error("No free spot");
    }

    /*
    *  Get server config by id
    */
    public static function getServerConfig($serverId)
    {
        foreach(CrownConfig::$dataServers as $config) {
            if( $config["id"] == $serverId ) return $config;
        }
        Crown::error("Data server " . $serverId . " not found");
    }

    /*
    *  Get key template and replace it"s values
    */
    public static function key($keyTemplate, $values, $replace = "VAR")
    {
        return str_replace($replace, $values, $keyTemplate);
    }

    /*
    * Convert hash values with serialized JSON arrays to PHP arrays
    */
    public static function decodeVars($vars)
    {
        $vars["-999"] = ""; // JSON fix to serialize id's
        foreach ($vars as $key => $value)
        {
            $vars[$key] = json_decode($value);
        }

        return $vars;
    }

}


?>