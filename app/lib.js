

MusicNoteDrawer={
    'staffTop': 55,
    'xoffset':160,
    'yStep':10,
    'noteC3Positions': {
        'treble': 155,
        'bass': 35
    },
    'noteMap': ['C','D','E','F','G','A','B'],
    'clefImages' :{
        treble: {path:'images/treble.png',dim:[20,45,50,120]},
        bass: {path:'images/bass.png',dim:[20,52,42,85]},
    },
    
    'drawNoteAndClef': function(ctx,noteMeta,clef){
        const middleCoctave=3;
        const octave=noteMeta.octave;
        const notename=noteMeta.noteName;
        
        if(!clef){
            if(octave>=middleCoctave){
                clef='treble';
            }else{
                clef='bass';
            }
        }

        const c3position=this.noteC3Positions[clef];

        //calc number of steps from C3
        const noteSteps=this.noteMap.indexOf(notename);
        const octSteps=octave-middleCoctave;
        const numPerOct=this.noteMap.length;

        const yStep=this.yStep;


        const deltaY=((octSteps*numPerOct)+noteSteps)*yStep;

        const y=c3position-deltaY;

        //console.log(octSteps,numPerOct,noteSteps,c3position,y);

        //draw ledger lines below staff
        let ledger_y = this.noteC3Positions['treble'];
        while (y>=ledger_y){
            ctx.beginPath();
            ctx.moveTo(this.xoffset-23,ledger_y);
            ctx.lineTo(this.xoffset+23,ledger_y);
            ctx.stroke();
            ledger_y+=(yStep*2);
        }

        //draw ledger lines above staff
        ledger_y = this.noteC3Positions['bass'];
        while (y<=ledger_y){
            ctx.beginPath();
            ctx.moveTo(this.xoffset-23,ledger_y);
            ctx.lineTo(this.xoffset+23,ledger_y);
            ctx.stroke();
            ledger_y-=(yStep*2);
        }

        ctx.beginPath();
        ctx.ellipse(this.xoffset, y, 1.5*yStep, yStep, 0, 0, 2 * Math.PI);
        ctx.fill();


        // Draw the note stem
        const midline=this.noteC3Positions['treble']-(yStep*6);

        if (y<=midline) {
            // Stem downwards
            ctx.beginPath();
            ctx.moveTo(this.xoffset-15, y);
            ctx.lineTo(this.xoffset-15, y + 63);
        } else {
            // Stem upwards
            ctx.beginPath();
            ctx.moveTo(this.xoffset+15, y);
            ctx.lineTo(this.xoffset+15, y - 63);
        }
        ctx.stroke();

        this.drawClef(ctx,clef);

    },
    'drawStaff':function(ctx,canvas) {
        const yStep=this.yStep;
        const staffTop=this.staffTop;
        const staffSpacing = yStep * 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(10, staffTop + i * staffSpacing);
            ctx.lineTo(canvas.width-10, staffTop + i * staffSpacing);
            ctx.stroke();
        }
    },
    'drawClef':function(ctx,clef) {
        const clefImages=this.clefImages;
        const clefImage = new Image();
        clefImage.src = clefImages[clef]['path'];
        const dim = clefImages[clef]['dim'];

        clefImage.onload = function() {
            ctx.drawImage(clefImage, ...dim);
        };
    }


};



StarDrawer={
    // Animation parameters
    maxScale : 4, // Maximum scale the star will reach
    animationDuration : 1000, // Animation duration in milliseconds
    // Star Drawing Parameters
    defaultFill : '#FFD700',
    defaultStroke: '#DAA520',
    defaultInnerOuterRatio: 0.5,
    defaultNumOfSpikes: 5,
    defaultLineWidth: 5,

    ctx: null,
    canvas: null,
    startTime : null,
    scale : 0.1, // Initial scale of the star
    
    reset : function (){
        StarDrawer.startTime=null;
        StarDrawer.scale=0.1;
        StarDrawer.ctx.clearRect(0, 0, StarDrawer.canvas.width, StarDrawer.canvas.height);        
    },
    drawStar: function (ctx, cx, cy, outerRadius, innerRadius, fillStyle, strokeStyle, lineWidth, nofill, dashed, spikes) {

        if(!fillStyle){
            fillStyle = StarDrawer.defaultFill;
        }
        if(!strokeStyle){
            strokeStyle = StarDrawer.defaultStroke;
        }
        if(!innerRadius){
            innerRadius = StarDrawer.defaultInnerOuterRatio * outerRadius;
        }
        if(!spikes){
            spikes = StarDrawer.defaultNumOfSpikes;
        }
        if(!lineWidth){
            lineWidth = StarDrawer.defaultLineWidth;
        }

        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        ctx.beginPath();
        if(dashed) ctx.setLineDash([2, 4]);
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        if(!nofill){
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    },
    easeOutBack: function(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t -1, 2);
    },
    startAnimation(callback) {
        function animate(timestamp){
            let ctx=StarDrawer.ctx;
            let canvas=StarDrawer.canvas;
            if (!StarDrawer.startTime) StarDrawer.startTime = timestamp;
            const elapsed = timestamp - StarDrawer.startTime;
            const progress = Math.min(elapsed / StarDrawer.animationDuration, 1);
            const easedProgress = StarDrawer.easeOutBack(progress);

            const opacity = 1 * progress;
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            //ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate the current scale based on easing
            StarDrawer.scale = 0.1 + (StarDrawer.maxScale - 0.1) * easedProgress;

            // Draw the star at the center of the canvas
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const outerRadius = 50 * StarDrawer.scale; // Adjust size as needed

            // Optional: Add glow effect
            ctx.save();
            ctx.shadowColor = 'rgba(255, 223, 0, 0.8)'; // Golden glow
            ctx.shadowBlur = 20 * StarDrawer.scale;
            StarDrawer.drawStar(ctx, centerX, centerY, outerRadius);
            ctx.restore();
            // Continue the animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            }else{
                StarDrawer.reset();
                if(callback && typeof callback === "function"){
                    callback();
                }
            }
        }
        requestAnimationFrame(animate);
    }
};
