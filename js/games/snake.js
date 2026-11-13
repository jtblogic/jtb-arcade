// js/games/snake.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Snake Retro Arcade';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="snake-score" class="text-xl font-black text-emerald-400">0</div>
                </div>
                <div id="snake-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="snake-start-btn" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mx-auto w-[300px] h-[300px] touch-none">
                <canvas id="snake-canvas" width="300" height="300" class="block touch-none"></canvas>
                <div id="snake-overlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center hidden">
                    <div class="text-4xl mb-2">🐍</div>
                    <h3 id="snake-overlay-title" class="font-bold text-slate-200 text-sm">Game Over</h3>
                    <p id="snake-overlay-msg" class="text-[11px] text-slate-400 mt-1 mb-4">Final Score: 0</p>
                    <button id="snake-restart-btn" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/30">Play Again</button>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElem = document.getElementById('snake-score');
    const statusElem = document.getElementById('snake-status');
    const startBtn = document.getElementById('snake-start-btn');
    const overlay = document.getElementById('snake-overlay');
    const overlayTitle = document.getElementById('snake-overlay-title');
    const overlayMsg = document.getElementById('snake-overlay-msg');
    const restartBtn = document.getElementById('snake-restart-btn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [];
    let food = { x: 0, y: 0 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let running = false;
    let gameInterval = null;
    let nextDir = { x: 0, y: 0 };

    function initGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            { x: 10, y: 12 }
        ];
        dx = 0;
        dy = -1;
        nextDir = { x: 0, y: -1 };
        score = 0;
        running = true;
        scoreElem.innerText = '0';
        statusElem.innerText = 'Playing';
        startBtn.innerText = 'Restart';
        overlay.classList.add('hidden');
        placeFood();
        draw();
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        for (let part of snake) {
            if (part.x === food.x && part.y === food.y) {
                placeFood();
                return;
            }
        }
    }

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0, Math.PI * 2
        );
        ctx.fill();

        snake.forEach((part, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#10b981' : '#34d399';
            ctx.shadowColor = isHead ? '#10b981' : 'transparent';
            ctx.shadowBlur = isHead ? 10 : 0;
            ctx.fillRect(
                part.x * gridSize + 1,
                part.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
        });
        ctx.shadowBlur = 0;
    }

    function move() {
        dx = nextDir.x;
        dy = nextDir.y;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        for (let part of snake) {
            if (head.x === part.x && head.y === part.y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElem.innerText = score;
            placeFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function gameOver() {
        running = false;
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        overlayTitle.innerText = 'Game Over';
        overlayMsg.innerText = `Final Score: ${score}`;
        overlay.classList.remove('hidden');
        statusElem.innerText = 'Game Over';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('snake', score);
    }

    function changeDirection(e) {
        if (!running) return;
        const key = e.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (key === 'ArrowUp' && !goingDown) { nextDir = { x: 0, y: -1 }; }
        if (key === 'ArrowDown' && !goingUp) { nextDir = { x: 0, y: 1 }; }
        if (key === 'ArrowLeft' && !goingRight) { nextDir = { x: -1, y: 0 }; }
        if (key === 'ArrowRight' && !goingLeft) { nextDir = { x: 1, y: 0 }; }
    }

    startBtn.addEventListener('click', () => {
        if (running) {
            gameOver();
        } else {
            initGame();
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(move, 180);
        }
    });

    restartBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        initGame();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(move, 180);
    });


    // Mobile D-pad + swipe controls
    const dpad = document.createElement('div');
    dpad.className = 'grid grid-cols-3 gap-2 mx-auto w-[180px] mt-2 md:hidden';
    dpad.innerHTML = `
        <div></div>
        <button data-dir="up" class="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl py-3 text-lg font-bold touch-manipulation">?</button>
        <div></div>
        <button data-dir="left" class="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl py-3 text-lg font-bold touch-manipulation">?</button>
        <button data-dir="down" class="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl py-3 text-lg font-bold touch-manipulation">?</button>
        <button data-dir="right" class="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl py-3 text-lg font-bold touch-manipulation">?</button>
    `;
    const wrapper = container.firstElementChild;
    if (wrapper) wrapper.appendChild(dpad);

    function setDir(d) {
        if (!running) return;
        const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1;
        if (d === 'up' && !goingDown) nextDir = { x: 0, y: -1 };
        if (d === 'down' && !goingUp) nextDir = { x: 0, y: 1 };
        if (d === 'left' && !goingRight) nextDir = { x: -1, y: 0 };
        if (d === 'right' && !goingLeft) nextDir = { x: 1, y: 0 };
    }
    dpad.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); setDir(btn.getAttribute('data-dir')); }, { passive: false });
        btn.addEventListener('click', () => setDir(btn.getAttribute('data-dir')));
    });

    let touchStart = null;
    canvas.addEventListener('touchstart', (e) => { if (e.touches[0]) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
    canvas.addEventListener('touchend', (e) => {
        if (!touchStart || !e.changedTouches[0]) return;
        const dxs = e.changedTouches[0].clientX - touchStart.x;
        const dys = e.changedTouches[0].clientY - touchStart.y;
        if (Math.abs(dxs) > Math.abs(dys)) {
            if (dxs > 20) setDir('right'); else if (dxs < -20) setDir('left');
        } else {
            if (dys > 20) setDir('down'); else if (dys < -20) setDir('up');
        }
        touchStart = null;
    });

    window.addEventListener('keydown', changeDirection);

    return () => {
        if (gameInterval) clearInterval(gameInterval);
        window.removeEventListener('keydown', changeDirection);
    };
}
