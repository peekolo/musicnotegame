<?php

include_once __DIR__.'/connect.php';
include_once __DIR__.'/helper.php';
include_once __DIR__.'/icl/getpossiblenotes.inc.php';

$token=SGET('token')??null;
$possiblenotes=getpossiblenotes($token);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musical Note Identification Game</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,1,0" />

</head>
<body>
    <div class="backgrounddiv"></div>
    <div id="redalert">&nbsp;</div>
    <canvas id="fireworksCanvas"></canvas>
    <div class="progressanimator">
        <div id="rocketholder">
            <img id="rocket"/>
        </div>
    </div>
    <canvas id="starbarCanvas"></canvas>
    <div id="settingsdiv">
        <a class="material-symbols-outlined gearicon" href="teachers/">
            settings
        </a>
    </div>
    <div id="score">Score: 0</div>
    <canvas id="musicCanvas"></canvas>
    <div id="choices"></div>
    <script>
        DataStore={
            'possibleNotes': <?echo json_encode($possiblenotes);?>
        };
    </script>

    <script src="core.js?v=5"></script>    
    <script src="lib.js?v=5"></script>
    <script src="script.js?v=5"></script>
</body>
</html>

