<?php

class CrownPlatform {

    // Check user authorization key
    public static function checkUserKey($userId, $userKey)
    {
        $realKey = self::getRealUserKey($userId);
        if( $userKey == $realKey ) return true;
    }

    // Get real user key
    public static function getRealUserKey($userId)
    {
        return md5( $userId . '_' . CrownConfig::$serverAuthKey );
    }

}


?>