<?php

// Try to execute function
GameItems::execute();

class GameItems extends CrownPlugin
{
    public static $userItemsKey = "user:VAR:items";

    // User register event
    public static function onUserRegister($userProfile)
    {
        // Add new player items
        CrownDB::query($userProfile["spot"]) -> set( CrownDB::key(self::$userItemsKey, $userProfile["userId"]), CrownGrids::getGridJSON("new_player_items"));
    }

    // Get current player items
    public static function getPlayerItems()
    {
        $playerItems = CrownDB::query(Crown::$userSpot) -> get( CrownDB::key($userItemsKey, Crown::$userId) );
        Crown::send($playerItems);
    }

}
