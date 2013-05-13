<?php

/*
 * Main user class
 * ErrorCode - 1xx
 */

class CrownUser extends CrownPlugin
{

    public static $userProfileKey = "user:VAR:profile";
    public static $userDataKey = "user:VAR:data";
    public static $userOnlineKey = "user:VAR:online";
    public static $userEntitiesKey = "user:VAR:entities";

    /*
    *  Login by user name and password, then return user id and key for the sercurity check soon
    */
    public static function loginByName($parameters)
    {
        $userName = $parameters["name"];
        $userPassword = $parameters["password"];

        // Get user id and password hash
        $userId = Hash(CrownConfig::$userNameHash, $userName);
        $userPasswordHash = Hash(CrownConfig::$userPasswordHash, $userPassword);

        // Get real user password
        $userProfile = self::getUserProfile($userId, true);
        if(!$userProfile) {
            Crown::fail("User not found", 100);
        }

        // Return user id and secure key
        if($userProfile["password"]  == $userPasswordHash)
        {
            Crown::event("onUserLogin", $userProfile);
            Crown::send($userProfile);
        }
        else Crown::fail("Wrong password", 101);
    }

    /*
     * Login by user id and key
     */

    public static function loginById()
    {
        // Check user id and key
        if(!CrownPlatform::checkUserKey(Crown::$userId, Crown::$userKey)) {
            Crown::error("Wrong user id or key");
        }

        // Get profile
        $userProfile = self::getUserProfile(Crown::$userId, true);
        if(!$userProfile) {
            Crown::fail("User not found", 100);
        }

        Crown::send($userProfile);
    }

    /*
     * Register new user by name
     */
    public static function registerByName($parameters)
    {
        $userName = $parameters["name"];
        $userPassword = $parameters["password"];

        // Get user id hash
        $userId = Hash(CrownConfig::$userNameHash, $userName);

        // Get user password hash
        $userProfile["password"] = Hash(CrownConfig::$userPasswordHash, $userPassword);

        // Get free db spot from servers list
        $userProfile["spot"] = CrownDB::getFreeServerId();

        // Is user exists?
        if( CrownDB::query() -> hExists( CrownDB::key(self::$userProfileKey, $userId), "spot" ) ) {
            Crown::fail("User already exists", 105);
        }

        // Add new user profile to db
        if( CrownDB::query() -> hMset( CrownDB::key(self::$userProfileKey, $userId), $userProfile ) )
        {
            // Add security user key to profile
            $userProfile["userKey"] = CrownPlatform::getRealUserKey($userProfile["userId"]);
            // Send user id to client
            $userProfile["userId"] = $userId;
            // Don't send password to client
            unset($userProfile["password"]);
        }
        else Crown::error("Can't save user profile", 106);

        Crown::event("onUserRegister", $userProfile);
        Crown::send($userProfile);
    }

    /*
    * Get user profile
    */
    public static function getUserProfile($userId, $full = false)
    {
        $userProfile = CrownDB::query() -> hGetAll( CrownDB::key(self::$userProfileKey, $userId) );
        if(!$userProfile) return false;

        // If user id is current - return authorization data
        if($full) {
            $userProfile["userId"] = $userId;
            $userProfile["userKey"] = CrownPlatform::getRealUserKey($userId);
        }
        else unset($userProfile["password"]);

        return $userProfile;
    }

}
