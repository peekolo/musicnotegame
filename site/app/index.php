<?php

include_once __DIR__.'/connect.php';
include_once __DIR__.'/helper.php';
include_once __DIR__.'/settings.php';
include_once __DIR__.'/icl/getpossiblenotes.inc.php';

$token=SGET('token')??null;
list(
    'possiblenotes'=>$possiblenotes,
    'gamemode'=>$mode,
)=getpossiblenotes($token);


$shownotenames=false;
if($mode==MODE_EASYKEYBOARD){
    $shownotenames=true;
}


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
    <div id="choices" class="<?if($mode!=MODE_MULCHOICE && $mode!=MODE_FREE) echo 'd-none';?>"></div>
    <div class="keyboard <?if($mode!=MODE_KEYBOARD && $mode!=MODE_EASYKEYBOARD) echo'd-none';?>" id="keyboard">
        <!-- White Keys -->
        <div class="white-key" data-note="C4"><?if($shownotenames) echo 'C';?></div>
        <div class="white-key" data-note="D4"><?if($shownotenames) echo 'D';?></div>
        <div class="white-key" data-note="E4"><?if($shownotenames) echo 'E';?></div>
        <div class="white-key" data-note="F4"><?if($shownotenames) echo 'F';?></div>
        <div class="white-key" data-note="G4"><?if($shownotenames) echo 'G';?></div>
        <div class="white-key" data-note="A4"><?if($shownotenames) echo 'A';?></div>
        <div class="white-key" data-note="B4"><?if($shownotenames) echo 'B';?></div>
        <div class="white-key" data-note="C5"><?if($shownotenames) echo 'C';?></div>

        <!-- Black Keys -->
        <div class="black-key" data-note="C#4"></div>
        <div class="black-key" data-note="D#4"></div>
        <!-- Skip E# (F natural has no sharp) -->
        <div class="black-key" data-note="F#4"></div>
        <div class="black-key" data-note="G#4"></div>
        <div class="black-key" data-note="A#4"></div>
    </div>
    <script>
        DataStore={
            'possibleNotes': <?echo json_encode($possiblenotes);?>
        };
    </script>

    <script src="core.js?v=6"></script>    
    <script src="lib.js?v=6"></script>
    <script src="script.js?v=6"></script>
</body>
</html>

