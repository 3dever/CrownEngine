<?php

    /*
     * Backend configuration files manager.
     * Can save new server or grid config data.
     */

    // Include current configuration files
    require_once "../CrownEngine/CrownConfig.php";
    require_once "project.php";

    // Check deploy key
    $key = null;
    if(isset($_POST["key"])) $key = $_POST["key"];
    if(isset($_GET["key"])) $key = $_GET["key"];
    if(CrownConfig::$deployKey != $key) {
        die("{success: false, errors: { reason: 'Wrong deploy key' }}");
    }

    // Ping
    if(isset($_POST["ping"])) {
        if(!CrownConfig::$maintenance) die("{success: true}");
        else die("{success: false, errors: { reason: 'Maintenance' }}");
    }


    // Get filename
    if(isset($_GET["name"])) $filename = $_GET["name"];
    else die("{success: false, errors: { reason: 'Wrong config name' }}");

    // Get data
    $data = null;
    if(isset($_POST["data"])) $data =  $_POST["data"];


    // Save or print data
    if(isset($_GET["type"]))
    {
        $type = $_GET["type"];

        // Save new project config
        if($type == "project") {
            if($data) saveProject($filename, $data);
        }

        // Save or get grid
        if($type == "grid") {
            // Save new grid data
            if($data) saveGrid($filename, $data);
            // Print grid
            else printGrid($filename);
        }
    }


    /*
     *  Save project (server) CrownEngine configuration file
     */
    function saveProject($filename, $data)
    {
        // Extract slashes
        if (get_magic_quotes_gpc())
        {
            $data = stripslashes($data);
        }

        // Decode JSON data
        $data = json_decode($data, true);
        if( !$data)
        {
            die("{success: false, errors: { reason: 'Wrong config data format' }}");
        }

        // Convert JSON array to PHP parameters list
        $configText = "<?php \n";
        foreach($data as $key=>$value)
        {
            if (property_exists('CrownConfig', $key))
            {
                if (is_array($value))
                {
                    $tmp1 = array();
                    foreach($value as $key2=>$value2)
                    {
                        // checking is it array of arrays
                        if (is_array($value2))
                        {
                            $tmp2 = array();
                            foreach($value2 as $key3=>$value3)
                            {
                                $tmp2[] = "\"".$key3."\" => \"".addslashes($value3)."\"";
                            }
                            $tmp1[] = "\t array(".implode(", ",$tmp2).")";

                        }
                        else
                        {
                            $tmp1[] = "\"".$key2."\" => \"".addslashes($value2)."\"";
                        }
                    }
                    $configText .= "\n\n CrownConfig::$".$key." = array (\n". implode(",\n",$tmp1)."\n );";
                }
                elseif (is_string($value))
                {
                    $configText .= "\n CrownConfig::$".$key." = \"".addslashes($value)."\";";
                }
                elseif (is_bool($value))
                {
                    if($value) $value = "true";
                    else $value = "false";
                    $configText .= "\n CrownConfig::$".$key." = $value;";
                }
                echo gettype($value)."exists $key <br> ";
            }
        }

        // Save config
        saveConfig($filename, $configText);
    }

    /*
     * Save grid
     */
    function saveGrid($filename, $data)
    {
        // Compose data
        $configText = '<?php' . "\n" . 'CrownConfig::$gridsJSON[' . "'$filename']='" . $data . "';";
        $arrayData = var_export(json_decode($data, true), true);
        $configText = $configText . "\n" . 'CrownConfig::$grids[' . "'$filename']=" . $arrayData . ";";
        // Save config
        saveConfig("grids/" . $filename, $configText);
    }

    /*
     * Print grid by name
     */
    function printGrid($filename)
    {
        require_once "grids/$filename.php";
        die(CrownConfig::$gridsJSON[$filename]);
    }

    /*
     * Save php config with data
     */
    function saveConfig($filename, $data)
    {
        // Save config
        $filename = $filename . ".php";

        // Save data to file and close
        $file = fopen($filename, "w");
        $res = fwrite($file, $data);
        fclose($file);

        if (!$res)
        {
            die("{success: false, errors: { reason: 'Can`t save file' }}");
        }
        else die("{success: true}");
    }

?>