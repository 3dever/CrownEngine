<?php

class CrownPlatform {

    // Check user authorization key
    public static function checkUserKey($userId, $userKey)
    {
        $realKey = self::getRealUserKey($userId);
        if( $userKey == $realKey ) return true;
    }

    // Send notification to user
    public static function sendNotification()
    {

    }

    // Withdraw user money
    public static function withdrawMoney()
    {

    }

    // Get real user key
    public static function getRealUserKey($userId)
    {
        return md5( CrownConfig::$platform["VK"]["appId"] . '_' . $userId . '_' . CrownConfig::$platform["VK"]["appKey"] );
    }


}

?>