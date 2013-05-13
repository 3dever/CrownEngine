<?php

class CrownPlugin
{
    public static function execute()
    {
        call_user_func(get_called_class() . "::" . Crown::$function, Crown::$parameters);
    }
}