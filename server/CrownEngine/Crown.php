<?php

require_once "CrownConfig.php";

// Include modules
foreach(CrownConfig::$modules as $module) {
    require_once "modules/Crown" . $module . ".php";
}

/*
 *  Main GoSDK Server singletone class
 */

class Crown
{

    // Client request main data
    public static $function;
    public static $parameters;

    // Client request user data
    public static $userId;
    public static $userKey;
    public static $userSpot;
    public static $userLogins;

    /*
     * Start server
     */
    public static function start()
    {
        // Get API request data
        self::getData();

        // Include platform
        require_once 'platforms/' . strtoupper(CrownConfig::$platform) . '.php';

        // Check user key
        if(Crown::$userSpot) {
            if( !CrownPlatform::checkUserKey(self::$userId, self::$userKey) ) {
                self::error("Wrong user id or key");
            }
        }

        // Execute function and return result
        CrownUser::execute();

        // Return error if server is offline and user is not admin
        /*if(!GoConfig::$serverOnline && !GoUser::$isAdmin) {
            GoRequest::error("Server is offline");
        } */

    }

    /*
    *  Get request data from the www get or post
    */
    public static function getData()
    {
        // Get function name (required)
        if(isset($_GET["function"])) self::$function = $_GET["function"];
        else if(isset($_POST["function"])) self::$function = $_POST["function"];
        else self::error("Wrong function");

        // Get and decode json parameters
        if(isset($_GET["parameters"])) self::$parameters = json_decode($_POST["parameters"], true);
        else if(isset($_POST["parameters"])) self::$parameters = json_decode($_POST["parameters"], true);

        // Get user id
        if(isset($_GET["userId"])) self::$userId = $_GET["userId"];
        else if(isset($_POST["userId"])) self::$userId = $_POST["userId"];

        // Get user key
        if(isset($_GET["userKey"])) self::$userKey = $_GET["userKey"];
        else if(isset($_POST["userKey"])) self::$userKey = $_POST["userKey"];

        // Get user spot
        if(isset($_GET["userSpot"])) self::$userSpot = $_GET["userSpot"];
        else if(isset($_POST["userSpot"])) self::$userSpot = $_POST["userSpot"];

        // Get user logins
        if(isset($_GET["userLogins"])) self::$userLogins = $_GET["userLogins"];
        else if(isset($_POST["userLogins"])) self::$userLogins = $_POST["userLogins"];

    }

    /*
    *  Send data to client
    */
    public static function send($data)
    {
        $result = array("data" => $data);
        $result = json_encode($result);
        $result = str_replace(",\"-999\":null", "", $result); // JSON fix to serialize id's (clean trash)
        echo $result;
        die();
    }

    /*
    *  Return fail result
    */
    public static function fail($text, $code = "")
    {
        self::send( array("fail" => $text, "failCode" => $code) );
    }

    /*
    *  Return and log error
    */
    public static function error($text, $code = "")
    {
        $result = array("error" => $text, "errorCode" => $code);
        echo json_encode($result);
        die();
    }

    /*
     * Send event to all plugins
     */
    public static function event($name, $vars)
    {
        foreach(CrownConfig::$plugins as $plugin) {
            call_user_func($plugin . "::" . $name, $vars);
        }
    }


}

?>