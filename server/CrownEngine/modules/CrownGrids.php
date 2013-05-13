<?php

class CrownGrids
{
    public static function getGrid($gridName)
    {
        require_once "config/grids/$gridName.php";
        return CrownConfig::$grids[$gridName];
    }

    public static function getGridJSON($gridName)
    {
        require_once "config/grids/$gridName.php";
        return CrownConfig::$gridsJSON[$gridName];
    }

}