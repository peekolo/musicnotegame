window.onload = function() {
    const assetpath = 'images';
    const canvas = gid('musicCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = gid('score');
    const choicesContainer = gid('choices');
    const maxScore = 20;

    const fireworksCanvas = gid('fireworksCanvas');
    const fireworksCtx = fireworksCanvas.getContext('2d');

    fireworksCanvas.width=window.innerWidth;
    fireworksCanvas.height=window.innerHeight;

    const xoffset=400;

    let score = 0;

    const notePositions = {
        'treble': [
            { name: 'C', y: 150, notenum: '1' },
            { name: 'D', y: 140, notenum: '2' },
            { name: 'E', y: 130, notenum: '3' },
            { name: 'F', y: 120, notenum: '4' },
            { name: 'G', y: 110, notenum: '5' },
            { name: 'A', y: 100, notenum: '6' },
            { name: 'B', y: 90, notenum: '7' },
            { name: 'C', y: 80, notenum: '2:1' },
            { name: 'D', y: 70, notenum: '2:2' },
            { name: 'E', y: 60, notenum: '2:3' },
            { name: 'F', y: 50, notenum: '2:4' },
        ],
        'bass': [
            { name: 'E', y: 130, notenum: 1 },
            { name: 'F', y: 120, notenum: 1 },
            { name: 'G', y: 110, notenum: 1 },
            { name: 'A', y: 100, notenum: 1 },
            { name: 'B', y: 90, notenum: 1 },
            { name: 'C', y: 80, notenum: 1 },
            { name: 'D', y: 70, notenum: 1 },
            { name: 'E', y: 60, notenum: 1 },
            { name: 'F', y: 50, notenum: 1 },
        ],
    }

    const clefImages = {
        treble: {path:assetpath+'/treble.png',dim:[60,40,50,120]},
        bass: {path:assetpath+'/bass.png',dim:[60,47,42,85]},
    };


    function drawStaff() {
        const staffTop = 50;
        const staffSpacing = 20;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(50, staffTop + i * staffSpacing);
            ctx.lineTo(750, staffTop + i * staffSpacing);
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

    function drawNote(clef) {
        const note = notePositions[clef][Math.floor(Math.random() * notePositions[clef].length)];
        //console.log(note);
        ctx.beginPath();
        ctx.ellipse(xoffset, note.y, 15, 10, 0, 0, 2 * Math.PI);
        ctx.fill();

        if (note.y>=150){
            ctx.beginPath();
            ctx.moveTo(xoffset-20,150);
            ctx.lineTo(xoffset+20,150);
            ctx.stroke();
        }

        // Draw the note stem
        if (note.y<=90) {
            // Stem downwards
            ctx.beginPath();
            ctx.moveTo(xoffset-15, note.y);
            ctx.lineTo(xoffset-15, note.y + 55);
        } else {
            // Stem upwards
            ctx.beginPath();
            ctx.moveTo(xoffset+15, note.y);
            ctx.lineTo(xoffset+15, note.y - 55);
        }

        ctx.stroke();
        return note;
    }

    function displayChoices(correctNoteMeta) {
        const correctNote = correctNoteMeta.name;
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
                    playNote(correctNoteMeta.notenum);
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
            };
            choicesContainer.appendChild(button);
        });
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
        var m=['6','6'];
        var m2=['5','5'];
        var m3=['7','7'];  
        var v=[2,8];
        mplay(m,v,20);
        mplay(m2,v,20);
        mplay(m3,v,20);
    }

    function playCorrect(){
        var m=['3:5','3:8'];
        var v=[8,8];
        mplay(m,v,130);
    }

    function playNote(m){
        m=[m];
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
            var octave=1;
            var n=note;
            if(note.indexOf(':')!=-1){
                n=note.split(':');
                octave=2**(parseInt(n.shift())-1);
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
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
        var c=new window.AudioContext(),o=c.createOscillator(),a=c.createGain();
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

    function startGame() {
        drawStaff();
        const clef='treble';
        drawClef(clef);
        const correctNoteMeta = drawNote(clef);
        displayChoices(correctNoteMeta);
    }

    startGame();
};

