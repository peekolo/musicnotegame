window.onload = function() {
    const canvas = document.getElementById('musicCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const choicesContainer = document.getElementById('choices');

    const fireworksCanvas = document.getElementById('fireworksCanvas');
    const fireworksCtx = fireworksCanvas.getContext('2d');

    fireworksCanvas.width=window.innerWidth;
    fireworksCanvas.height=window.innerHeight;

    const xoffset=300;

    let score = 0;

    const notePositions = {
        'treble': [
            { name: 'C', y: 150 },
            { name: 'D', y: 140 },
            { name: 'E', y: 130 },
            { name: 'F', y: 120 },
            { name: 'G', y: 110 },
            { name: 'A', y: 100 },
            { name: 'B', y: 90 },
            { name: 'C', y: 80 },
            { name: 'D', y: 70 },
            { name: 'E', y: 60 },
            { name: 'F', y: 50 },
        ],
        'bass': [
            { name: 'E', y: 130 },
            { name: 'F', y: 120 },
            { name: 'G', y: 110 },
            { name: 'A', y: 100 },
            { name: 'B', y: 90 },
            { name: 'C', y: 80 },
            { name: 'D', y: 70 },
            { name: 'E', y: 60 },
            { name: 'F', y: 50 },
        ],
    }

    const clefImages = {
        treble: 'treble-clef.png',
        bass: 'bass-clef.png'
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
        clefImage.src = clefImages[clef];
        clefImage.onload = function() {
            ctx.drawImage(clefImage, 10, 30, 40, 100);
        };
    }

    function drawNote(clef) {
        const note = notePositions[clef][Math.floor(Math.random() * notePositions[clef].length)];
        console.log(note);
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
        return note.name;
    }

    function displayChoices(correctNote) {
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
                    startFireworks();
                } else {
                    score = 0;
                }
                scoreDisplay.innerText = `Score: ${score}`;
                startGame();
            };
            choicesContainer.appendChild(button);
        });
    }

    function startFireworks() {
        const particles = [];
        const numParticles = 100;
        const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: fireworksCanvas.width / 2,
                y: fireworksCanvas.height / 2,
                speed: Math.random() * 5 + 2,
                angle: Math.random() * 2 * Math.PI,
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

    function startGame() {
        drawStaff();
        const clef='treble';
        drawClef(clef);
        const correctNote = drawNote(clef);
        displayChoices(correctNote);
    }

    startGame();
};

