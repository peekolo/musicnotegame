<?php

include_once __DIR__.'/../connect.php';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musical Note Identification Game</title>
    <link rel="stylesheet" href="styles.css">
</head>
<style>
	.longstave{
		height:200px;
		width:1000px;
	}
	.staveholder{
		position:relative;
		margin:10px;
	}
	.boundarybox{
		z-index:999;
		cursor: pointer;
	}
	.outerdiv{
		padding-top:10px;
	}
    #urlholdertextbox{
        margin:10px;
        padding:5px;
        width:500px;
        background-color:#CCC;
        pointer-events: none;

    }
</style>
<body>
	<div class="outerdiv">
	    <div id="trebleholder" class="staveholder">
	    	<canvas class="longstave" id="mainmusicstaff_treble"></canvas>
	    </div>
	    <div id="bassholder" class="staveholder">
	    	<canvas class="longstave" id="mainmusicstaff_bass"></canvas>
	    </div>
	    <div style="text-align: center;">
	    	<div>
                <button onclick="generateurl();">Generate URL</button>
            </div>
            <div onclick="copytextbox(gid('urlholdertextbox'));" style="display: inline-block; cursor: pointer;">
                <input id="urlholdertextbox" type="text" disabled>
            </div>
	    </div>

	</div>
    
    <script src="../core.js?v=5"></script>  
	<script src="../lib.js?v=5"></script>  
	<script>
		function drawMainStaff(eleid,drawer,clef,minmaxnotemeta,color){
			const mainstaffCanvas=gid(eleid);
			const mainstaffCtx=mainstaffCanvas.getContext('2d');

			// Get the width of the browser's viewport
		    const browserWidth = window.innerWidth;

		    // Set the canvas width to 80% of the browser width
		    const canvasWidth = 1000;//browserWidth * 0.8;  // 80% of the browser's width
		    const canvasHeight = 400; // You can set a fixed height or adjust as needed

		    // Set the canvas width and height in the HTML attributes
		    //mainstaffCanvas.width = canvasWidth;
		    //mainstaffCanvas.height = canvasHeight;

		    // Optionally, adjust drawing context for device pixel ratio (for retina screens)
		    const dpi = window.devicePixelRatio || 1;  // Get the device pixel ratio
		    mainstaffCanvas.width = canvasWidth * dpi;
		    mainstaffCanvas.height = canvasHeight * dpi;
		    mainstaffCtx.scale(dpi, dpi);  

			drawer.drawStaff(mainstaffCtx,mainstaffCanvas);
			drawer.drawClef(mainstaffCtx,clef);

			const maxoct=minmaxnotemeta.maxoct;
			const maxnote=minmaxnotemeta.maxnote;

			const minoct=minmaxnotemeta.minoct;
			const minnote=minmaxnotemeta.minnote;

			var startdraw=false;
			var notes = [];
			let counter=0;
			for(let oct=minoct;oct<=maxoct;oct++){
				for(let i=0;i<drawer.noteMap.length;i++){
					if(minoct==oct && minnote==drawer.noteMap[i]){
						startdraw=true;
					}
					if(!startdraw){
						continue;
					}
					let thisnotemeta={
						'noteName':drawer.noteMap[i],
						'octave': oct,
						'clef': clef,
						'idx': i,
						'ctx': mainstaffCtx,
						'canvas': mainstaffCanvas,
						'noteoffset':counter
					};
					let posmeta=drawer.drawNote(mainstaffCtx,thisnotemeta,clef,counter++,color);

					thisnotemeta['x']=posmeta.x;
					thisnotemeta['y']=posmeta.y;
					thisnotemeta['radius']=posmeta.radius;
					notes.push(thisnotemeta);

					if(oct==maxoct && drawer.noteMap[i]==maxnote){
						break;
					}
				}
			}

			return notes;
		}

		function drawBoundary(parent,x,y,width,height,onclick){

			let color='transparent';

			let div=document.createElement('div');
			div.style.position = 'absolute'; // Position it absolutely on the screen
			div.style.left = `${x}px`;       // X-coordinate
			div.style.top = `${y}px`;        // Y-coordinate
			div.style.width = `${width}px`;  // Width
			div.style.height = `${height}px`; // Height
			
			div.style.backgroundColor = color; // Background color

			div.classList.add('boundarybox');

			if(onclick){
				div.onclick=onclick;
			}

			// Append the div to the document body
			parent.appendChild(div);

		}

		function getSelectedNotes(){
			const selectedNotes = [];
			document.querySelectorAll('.boundarybox').forEach(ele => {
				if(ele.noteselected){
					selectedNotes.push(ele.notemeta);
				}
			});
			return selectedNotes;
		}

		function generateurl(){
			const selectedNotes=getSelectedNotes();
			if(selectedNotes.length==0){
				alert('No notes selected. Please click on a note to select a note');
				return;
			}

			let f=function(rq){
                var url=rq.responseText;
                if(!url){
                    alert('Error has occurred. Please try again');
                }

                gid('urlholdertextbox').value=document.ownprotocol+'://'+document.ownurl+'?token='+url;

			}

			let data='selectednotes='+JSON.stringify(selectedNotes);
			let u='router.php?cmd=genurl';
			ajxnb(u,data,f);

		}

        function copytextbox(d) {
            // Select all the text in the input field
            if(d.triedandfailed){
                return;
            }
            d.disabled=false;
            d.select();
            try {
                // Copy the selected text to the clipboard
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('URL copied to clipboard! Send this URL to your students!');
                } else {
                    alert('Failed to copy URL. Try again.');
                    d.triedandfailed=true;
                }
            } catch (err) {
                alert('Error copying URL: ' + err);
                d.triedandfailed=true;
            }

            d.disabled=true;

        };

		window.onload=function(){

            document.webtoken='<?php echo $webtoken;?>';
            document.ownurl='<?php echo $_SERVER['HTTP_HOST'];?>';
            document.ownprotocol='<?php echo $httpsenabled?'https':'http';?>';
			const grayhex='#AAA';

			const clefImages={
				treble: {path:'../images/treble.png',dim:[15,108,35,200]},
    			bass: {path:'../images/bass.png',dim:[20,140,40,125]},
			}

			const getboundarydim=function(meta){
				let size=meta.radius;
				return {
					x: meta.x - size*0.5,
					y: meta.y/2 - size*0.5,
					w: size*3,
					h: size*3,
				};

			}
			const getclickfunc=function(meta,drawer){
				return function(){
					let ele=(event||window.event).target;
					if(!ele.notemeta) ele.notemeta=meta;
					if(!ele.noteselected){
						ele.noteselected=1;
					}else{
						ele.noteselected=0;
					}

					let dim=getboundarydim(meta);
					drawer.drawNote(meta.ctx,meta,meta.clef,meta.noteoffset,ele.noteselected?'red':grayhex);

				};
			}

			document.mainstaffDrawer_treble=Object.create(MusicNoteDrawer);
			document.mainstaffDrawer_treble.init(clefImages,150,80,0.5,14);

			let minmaxnotemeta_treble={
				'maxoct':5,
				'maxnote':'G',
				'minoct':2,
				'minnote':'G'
			};

			var treblenotes=drawMainStaff('mainmusicstaff_treble',document.mainstaffDrawer_treble,'treble',minmaxnotemeta_treble,grayhex);
			let trebleholder=gid('trebleholder');
			//draw bounding boxes
			for(var i in treblenotes){
				let dim=getboundarydim(treblenotes[i]);
				drawBoundary(trebleholder,dim.x,dim.y,dim.w,dim.h,getclickfunc(treblenotes[i],document.mainstaffDrawer_treble));
			}


			document.mainstaffDrawer_bass=Object.create(MusicNoteDrawer);
			document.mainstaffDrawer_bass.init(clefImages,150,80,0.5,14);

			let minmaxnotemeta_bass={
				'maxoct':3,
				'maxnote':'A',
				'minoct':0,
				'minnote':'A'
			};

			var bassnotes=drawMainStaff('mainmusicstaff_bass',document.mainstaffDrawer_bass,'bass',minmaxnotemeta_bass,grayhex);
			let bassholder=gid('bassholder');
			//draw bounding boxes
			for(var i in bassnotes){
				let dim=getboundarydim(bassnotes[i]);
				drawBoundary(bassholder,dim.x,dim.y,dim.w,dim.h,getclickfunc(bassnotes[i],document.mainstaffDrawer_bass));
			}


		}
	</script>
</body>
</html>