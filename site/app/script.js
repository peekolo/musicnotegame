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
    const maxScore = 10;

    const fireworksCanvas = gid('fireworksCanvas');
    const fireworksCtx = fireworksCanvas.getContext('2d');

    const starbarCanvas = gid('starbarCanvas');
    const starbarCtx = starbarCanvas.getContext('2d');

    function resizeCanvas() {
      fireworksCanvas.width = window.innerWidth;
      fireworksCanvas.height = window.innerHeight;
      canvas.width=canvas.getBoundingClientRect().width;
      xoffset=canvas.width/2;
      canvas.height=canvas.getBoundingClientRect().height;

    }
    resizeCanvas();

    // Update canvas size on window resize
    //window.addEventListener('resize', resizeCanvas);




    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
    const audioContext=new window.AudioContext();

    let score = 0;
    let starscore = 0;
    const noteMap = ['C','D','E','F','G','A','B'];

    const maxOctave=4;//5;
    const minOctave=1;//0;

    function generateNote(){
        let selectedNote={};

        if(DataStore && DataStore.possibleNotes.length>0){
            selectedNote=DataStore.possibleNotes[Math.floor(Math.random() * DataStore.possibleNotes.length)];
            note=selectedNote.noteName;
            oct=selectedNote.octave;

        }else{
            let note = noteMap[Math.floor(Math.random() * noteMap.length)];
            const oct = Math.floor(Math.random()*(maxOctave+1-minOctave))+minOctave;

            selectedNote = {
                'noteName':note,
                'octave': oct,
            };

        }

        if(document.previousNote == note+oct){  //prevent repeats
            return generateNote();
        }

        document.previousNote = note+oct;
        return selectedNote;
    }

    const noteC3Positions = {
        'treble': 155,
        'bass': 35
    };



    

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
                    choicesContainer.innerHTML = '';
                    startFireworks();
                    scoreDisplay.innerText = `Score: ${score}`;
                    moveRocket(score);  
                    if(score>=maxScore){
                        completeStage();
                        score=0;
                        setTimeout(function(){
                            moveRocket(score);
                            scoreDisplay.innerText = `Score: ${score}`;
                        },1000);
                    }else{  
                        startGame();
                    }
                } else {
                    playWrong();
                    startRedAlert(5);
                    if(score>0){
                        score--; 
                        scoreDisplay.innerText = `Score: ${score}`;
                    }
                    moveRocket(score);  
                }
            
            };
            choicesContainer.appendChild(button);
        });
    }


    function completeStage(){
        starscore++;
        StarDrawer.startAnimation(startGame);
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

    function startGame() {
        //console.log('starscore',starscore);
        drawStarBar();
        MusicNoteDrawer.drawStaff(ctx,canvas);
        const correctNoteMeta=generateNote();
        MusicNoteDrawer.drawNoteAndClef(ctx,correctNoteMeta);
        displayChoices(correctNoteMeta);
    }

    function drawStarBar(){
        const xoffset=10;
        const xspacing=5;
        const yoffset=10;
        const starwidth=20;
        let fillstar=starscore;
        let nofill=true;
        for(let i=0;i<5;i++){
            if(fillstar>0) nofill=false;
            StarDrawer.drawStar(starbarCtx, xoffset+starwidth+(i*starwidth*2)+(i*xspacing), yoffset+starwidth, starwidth, starwidth/2,'#FFD700','#FFD700',1, nofill, nofill);
            nofill=true;
            fillstar--;
        }

    }

    StarDrawer.ctx=fireworksCtx;
    StarDrawer.canvas=fireworksCanvas;

    startGame();
};
