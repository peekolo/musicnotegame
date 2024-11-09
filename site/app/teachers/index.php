<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musical Note Identification Game</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div>
    	<canvas id="mainmusicstaff"></canvas>
    </div>
    <div>
    	<canvas class="musicstaff"></canvas>
    </div>
    

    <script src="../core.js?v=3"></script>  
	<script src="../lib.js?v=3"></script>  
	<script>
		function drawMainStaff(){
			if(!document.mainstaffDrawer){
				document.mainstaffDrawer=Object.create(MusicNoteDrawer);
				const mainstaffCanvas=gid('mainmusicstaff');
				const mainstaffCtx=mainstaffCanvas.getContext('2d');

				document.mainstaffDrawer.init();

			}

			const drawer=document.mainstaffDrawer;



			
			MusicNoteDrawer.drawStaff(mainstaffCtx,mainstaffCanvas);


		}
		window.onload=function(){
			drawMainStaff();
		}
	</script>
</body>
</html>

