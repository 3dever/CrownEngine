<?php

    /*
     * Admin configuration files manager.
     * Can save new config files or return existed.
     */

    // Include configs
    require_once "users.php";
    require_once "projects.php";

    // Is user authorized?
    require_once "../libs/login.php";
    if(!$authorizedUser) die;

    // Save new config to file from POST data
    if(isset($_POST["data"]))
    {
        // Check admin rights
        if($authorizedUser["role"] != "Admin") die("{success: false, errors: { reason: 'You don't have rights to save data' }}");

        // Get file name
        $filename = $_GET["name"];

        // Get and compose file data
        $data = $_POST["data"];
        $data = '<?php $config["' . $filename . '"]' . "='" . $data . "';";

        // Save data to file
        if(!$authorizedUser) die("{success: false, errors: { reason: 'Login error' }}");

        if($filename && $data)
        {
            // Extract slashes
            if (get_magic_quotes_gpc()) {
                $filename = stripslashes($filename);
                $data = stripslashes($data);
            }
            // Save data to file and close
            $file = fopen($filename . ".php", "w");
            fwrite($file, $data);
            fclose($file);

            if (isset($_POST['deploy']))
            {
                $res=true;
            }

            die("{success: true}");
        }
        else die("{success: false, errors: { reason: 'Wrong data' }}");

    }
    // Just return existed config data
    else
    {
        $configname = $_GET["name"];
        echo $config[$configname];
    }

?>