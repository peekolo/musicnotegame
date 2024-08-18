window.onload = function() {
    const salutations = [
        'Star',
        'Super Star',
        'Super Duper Star',
        'Super Nova Duper Star',
        'Super Nova Musical Duper Star',
    ];



    const assetpath = 'images';
    const canvas = gid('musicCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = gid('score');
    const choicesContainer = gid('choices');
    const maxScore = 5;

    const fireworksCanvas = gid('fireworksCanvas');
    const fireworksCtx = fireworksCanvas.getContext('2d');

    function resizeCanvas() {
      fireworksCanvas.width = window.innerWidth;
      fireworksCanvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Update canvas size on window resize
    window.addEventListener('resize', resizeCanvas);


    const xoffset=300;
    const yStep=10;

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
    const audioContext=new window.AudioContext();

    let score = 0;
    const noteMap = ['C','D','E','F','G','A','B'];

    const maxOctave=4;//5;
    const minOctave=1;//0;

    function generateNote(){
        let note = noteMap[Math.round(Math.random() * (noteMap.length-1))];
        const oct = Math.round(Math.random()*(maxOctave-minOctave))+minOctave;

        const selectedNote = {
            'noteName':note,
            'octave': oct,
        };

        //console.log(selectedNote);

        return selectedNote;
    }

    const noteC3Positions = {
        'treble': 150,
        'bass': 30
    };

    const clefImages = {
        treble: {path:assetpath+'/treble.png',dim:[60,40,50,120]},
        bass: {path:assetpath+'/bass.png',dim:[60,47,42,85]},
    };


    function drawStaff() {
        const staffTop = 50;
        const staffSpacing = yStep * 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(50, staffTop + i * staffSpacing);
            ctx.lineTo(550, staffTop + i * staffSpacing);
            ctx.stroke();
        }
    }

    function drawClef(clef) {
        const clefImage = new Image();
        clefImage.src = clefImages[clef]['path'];
        const dim = clefImages[clef]['dim'];

        clefImage.onload = function() {
            ctx.drawImage(clefImage, ...dim);
        };
    }

    function drawNoteAndClef(noteMeta,clef){
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

        const c3position=noteC3Positions[clef];

        //calc number of steps from C3
        const noteSteps=noteMap.indexOf(notename);
        const octSteps=octave-middleCoctave;
        const numPerOct=noteMap.length;



        const deltaY=((octSteps*numPerOct)+noteSteps)*yStep;

        const y=c3position-deltaY;

        //console.log(octSteps,numPerOct,noteSteps,c3position,y);

        //draw ledger lines below staff
        let ledger_y = noteC3Positions['treble'];
        while (y>=ledger_y){
            ctx.beginPath();
            ctx.moveTo(xoffset-23,ledger_y);
            ctx.lineTo(xoffset+23,ledger_y);
            ctx.stroke();
            ledger_y+=(yStep*2);
        }

        //draw ledger lines above staff
        ledger_y = noteC3Positions['bass'];
        while (y<=ledger_y){
            ctx.beginPath();
            ctx.moveTo(xoffset-23,ledger_y);
            ctx.lineTo(xoffset+23,ledger_y);
            ctx.stroke();
            ledger_y-=(yStep*2);
        }

        ctx.beginPath();
        ctx.ellipse(xoffset, y, 1.5*yStep, yStep, 0, 0, 2 * Math.PI);
        ctx.fill();


        // Draw the note stem
        if (y<=90) {
            // Stem downwards
            ctx.beginPath();
            ctx.moveTo(xoffset-15, y);
            ctx.lineTo(xoffset-15, y + 63);
        } else {
            // Stem upwards
            ctx.beginPath();
            ctx.moveTo(xoffset+15, y);
            ctx.lineTo(xoffset+15, y - 63);
        }
        ctx.stroke();

        drawClef(clef);

    }

    function displayChoices(correctNoteMeta) {
        const correctNote = correctNoteMeta.noteName;
        var options = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        options.splice(options.indexOf(correctNote),1);
        const shuffledOptions = options.sort(() => 0.5 - Math.random()).slice(0, 3);
        shuffledOptions.push(correctNote);
        shuffledOptions.sort(() => 0.5 - Math.random());

        choicesContainer.innerHTML = '';
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('choice-button');
            button.onclick = function() {
                if (option === correctNote) {
                    score++;
                    playNote(correctNoteMeta);
                    playCorrect();
                    startFireworks();
                    scoreDisplay.innerText = `Score: ${score}`;
                    startGame();
                } else {
                    playWrong();
                    startRedAlert(5);
                    if(score>0){
                        score--; 
                        scoreDisplay.innerText = `Score: ${score}`;
                    }
                }
                moveRocket(score);  
                if(score>=maxScore){
                    completeStage();
                    setTimeout(function(){
                        score=0;
                        moveRocket(score);
                        scoreDisplay.innerText = `Score: ${score}`;
                    },1000);
                }              
            };
            choicesContainer.appendChild(button);
        });
    }


    function completeStage(){
        requestAnimationFrame(StarDrawer.animate);


    }

    function startFireworks() {
        const particles = [];
        const numParticles = 200;
        const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: fireworksCanvas.width / 2,
                y: fireworksCanvas.height / 2,
                speed: Math.random() * 5 + 5,
                angle: Math.random() * 2 * Math.PI + 3,
                radius: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function animateFireworks() {
            fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

            particles.forEach((particle, index) => {
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed;
                particle.speed *= 0.98; // Slow down the particles
                particle.radius *= 0.98; // Shrink the particles

                if (particle.radius < 0.5) {
                    particles.splice(index, 1);
                } else {
                    fireworksCtx.beginPath();
                    fireworksCtx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
                    fireworksCtx.fillStyle = particle.color;
                    fireworksCtx.fill();
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animateFireworks);
            }
        }

        animateFireworks();
    }

    function startRedAlert(n){
        if(n<=0){
            gid('redalert').style.display='none';
            return;
        }
        if(n%2==0){
            gid('redalert').style.display='none';
        }else{
            gid('redalert').style.display='block';
        }

        setTimeout(function (){
            startRedAlert(--n);
        },50);

    }

    function moveRocket(x){
        const holder=gid('rocketholder');
        const rocket=gid('rocket');
        const holderdim=holder.getBoundingClientRect();
        const rocketdim=rocket.getBoundingClientRect();
        const y=(holderdim.height-rocket.height)*x/maxScore;
        rocket.style.bottom=(holderdim.y+y) + 'px';

    }

    function playWrong(){
        var m=['3:6','3:6'];
        var m2=['3:5','3:5'];
        var m3=['3:7','3:7'];  
        var v=[2,8];
        mplay(m,v,20);
        mplay(m2,v,20);
        mplay(m3,v,20);
    }

    function playCorrect(){
        var m=['5:5','5:8'];
        var v=[8,8];
        mplay(m,v,130);
    }

    function playNote(noteMeta){
        const noteNum=noteMap.indexOf(noteMeta.noteName)+1;
        const octave=noteMeta.octave;
        const m=[octave+':'+noteNum];
        mplay(m,[8],10);
    }

    function mplay(m,v,s){
        // m = melody
        // 1 for do, 2 for re .... (do is c - fixed do!)
        // no flats, only sharps. 0.1 is do sharp, 0.2 is re sharp, etc...
        // have fun!
        // v = note value
        // in semiquavers - 1 is semiquaver, 4 is 4 semiquavers=quarternote, 8 is minum... etc
        // s = speed, the bigger the value the faster
        getf=function(note){
            var octave=3;
            var n=note;
            if(note.indexOf(':')!=-1){
                n=note.split(':');
                octave=2**(parseInt(n.shift())-3);
                n=n.shift();
            }
            var freq=f[Math.abs(n)];
            if(n<1 && n>0) freq=fs[Math.abs(n)*10];
            //console.log(freq,n,octave);
            freq=freq*octave;
            return freq;
        }
        if(!s) s=1;

        v.unshift(0);
        var fs=[0,277.18,311.13,349.23,369.99,415.30,466.16,523.25];
        var f=[246.94,261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25];
        //window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const c=audioContext;
        var o=c.createOscillator(),a=c.createGain();
        var ts=0;
        o.frequency.value=getf(m[0]);
        o.connect(a).connect(c.destination);o.start(0);
        for(var i=0;i<v.length;i++){
            ts+=v[i]/s;
            if(v[i]>0){
                //a.gain.setValueAtTime(1,c.currentTime+ts);
                a.gain.exponentialRampToValueAtTime(1,c.currentTime+ts);
                a.gain.linearRampToValueAtTime(0,c.currentTime+ts-0.05);
                if(i<m.length) o.frequency.setValueAtTime(getf(m[i]),c.currentTime+ts-0.05);
            }
        }
        a.gain.linearRampToValueAtTime(0,c.currentTime+ts-0.01);
        
        o.stop(c.currentTime+ts);
    }

    function drawStarBar(){
        //StarDrawer.drawStar(ctx, centerX, centerY, outerRadius);
    }


    function startGame() {
        //animate();
        drawStaff();
        const correctNoteMeta=generateNote();
        drawNoteAndClef(correctNoteMeta);
        displayChoices(correctNoteMeta);
    }

    StarDrawer.ctx=fireworksCtx;
    StarDrawer.canvas=fireworksCanvas;

    startGame();
};


StarDrawer={
    // Animation parameters
    maxScale : 5, // Maximum scale the star will reach
    animationDuration : 1000, // Animation duration in milliseconds
    // Star Drawing Parameters
    defaultFill : '#FFD700',
    defaultStroke: '#DAA520',
    defaultInnerOuterRatio: 0.5,
    defaultNumOfSpikes: 5,

    ctx: null,
    canvas: null,
    startTime : null,
    scale : 0.1, // Initial scale of the star
    
    reset : function (){
        StarDrawer.startTime=null;
        StarDrawer.scale=0.1;
    },
    drawStar: function (ctx, cx, cy, outerRadius, innerRadius, fillStyle, strokeStyle, spikes) {

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

        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        ctx.beginPath();
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
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 5;
        ctx.stroke();
    },
    easeOutBack: function(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t -1, 2);
    },
    animate(timestamp) {
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
            requestAnimationFrame(StarDrawer.animate);
        }else{
            StarDrawer.reset();
        }
    }   
};

