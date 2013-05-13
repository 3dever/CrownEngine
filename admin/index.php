<?php

    require_once "config/users.php";
    require_once "libs/login.php";

?>

<html>
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <title>Crown Engine</title>

    <link rel="stylesheet" type="text/css" href="libs/extjs/resources/css/ext-all-gray.css">
    <script type="text/javascript" src="libs/extjs/ext-all.js"></script>

    <?php

        if($authorizedUser) {
            require_once "app/app.php";
            // Add $userName to JavaScript
            echo '<script type="text/javascript">';
            echo "var userName='" . $authorizedUser['name'] . "';";
            echo "var userRole='" . $authorizedUser['role'] . "';";
            echo '</script>';
        }
        else {
            echo '<script type="text/javascript" src="app/login/login.js"></script>';
        }
    ?>

    <style type="text/css">

        .x-tree-icon {
            margin-right: 8px;
        }

        .x-tree-panel .x-grid-row .x-grid-cell-inner {
            height: 38px;
            line-height: 26px;
            font-size: 14px;
            vertical-align: top;
            padding: 4px;
        }


    </style>


</head>

<body>

</body>
</html>