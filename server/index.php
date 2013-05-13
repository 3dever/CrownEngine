<?php

    require_once "CrownEngine/Crown.php";
    require_once "./config/project.php";

    // Include plugins
    CrownConfig::$plugins = explode(",", CrownConfig::$plugins);
    foreach(CrownConfig::$plugins as $plugin) {
        require_once "./plugins/" . $plugin . ".php";
    }

    // Start server
    Crown::start();

?>