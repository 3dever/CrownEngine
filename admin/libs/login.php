<?php

    session_start();

    // Logout and redirect to login page
    if(isset($_GET["logout"]))
    {
        setcookie("userHash", "", time() - 3600);
        header('Location: ./');
    }

    // Login
    $authorizedUser = false;

    $users = json_decode($config["users"], true);

    // Get username and password from COOKIE
    if(isset($_COOKIE["userHash"]))
    {
        $userHashCookie = $_COOKIE["userHash"];

        // Is users exists?
        foreach($users as $user)
        {
            $userHash = MD5($user["password"] . strlen($user["name"]));

            if($userHash == $userHashCookie) {
                $authorizedUser = $user;
                break;
            }
        }
    }

    // Get username and password from POST data
    if(!$authorizedUser && isset($_POST["userName"]) && isset($_POST["userPassword"]))
    {

        $userName = $_POST["userName"];
        $userHash = MD5($_POST["userPassword"] . strlen($userName));

        // Check username and password
        foreach($users as $user)
        {
            if($user["name"] == $userName && MD5($user["password"] . strlen($userName)) == $userHash)
            {
                // Save user session
                $cookieLifeTime = '0';
                if (isset($_POST["rememberMe"]) and $_POST["rememberMe"]==1)
                {
                    $cookieLifeTime = time() + 15552000;
                }

                setcookie("userHash", $userHash, $cookieLifeTime, null, null,false, true);

                $authorizedUser = $user;
            }
        }

        if($authorizedUser) die("{success: true}");
        else die("{success: false, errors: { reason: 'Wrong username or password' }}");

    }

?>