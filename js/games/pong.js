// js/games/pong.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Pong Duel';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">You</span>
                    <div id="pong-player" class="text-xl font-black text-rose-400">0</div>
                </div>
                <div id="pong-status" class="text-xs font-bold text-slate-300">First to 7</div>
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">AI</span>
                    <div id="pong-ai" class="text-xl font-black text-slate-400">0</div>
                </div>
                <button id="pong-start-btn" class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mx-auto w-[300px] h-[300px]">
                <canvas id="pong-canvas" width="300" height="300" class="block touch-none"></canvas>
                <div id="pong-overlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center hidden">
                    <div class="text-4xl mb-2">🏓</div>
                    <h3 id="pong-overlay-title" class="font-bold text-slate-200 text-sm">Game Over</h3>
                    <p id="pong-overlay-msg" class="text-[11px] text-slate-400 mt-1 mb-4">Final Score</p>
                    <button id="pong-restart-btn" class="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2 rounded-xl shadow-lg shadow-rose-500/30">Play Again</button>
                </div>
            </div>
            <p class="text-[10px] text-slate-500">Move mouse over the arena or use ↑/↓</p>
        </div>
    `;

    const canvas = document.getElementById('pong-canvas');
    const ctx = canvas.getContext('2d');
    const playerScoreElem = document.getElementById('pong-player');
    const aiScoreElem = document.getElementById('pong-ai');
    const statusElem = document.getElementById('pong-status');
    const startBtn = document.getElementById('pong-start-btn');
    const overlay = document.getElementById('pong-overlay');
    const overlayTitle = document.getElementById('pong-overlay-title');
    const overlayMsg = document.getElementById('pong-overlay-msg');
    const restartBtn = document.getElementById('pong-restart-btn');

    const W = canvas.width, H = canvas.height;
    const PADDLE_H = 60, PADDLE_W = 8;
    const BALL_R = 6;
    const WIN = 7;

    let playerY = H / 2 - PADDLE_H / 2;
    let aiY = H / 2 - PADDLE_H / 2;
    let ball = { x: W / 2, y: H / 2, vx: 4, vy: 3 };
    let playerScore = 0, aiScore = 0;
    let running = false;
    let raf = null;
    let keys = {};

    function resetBall(dir) {
        ball.x = W / 2; ball.y = H / 2;
        const speed = 4.5;
        ball.vx = speed * (dir > 0 ? 1 : -1);
        ball.vy = (Math.random() * 4 - 2);
    }

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);
        // center line
        ctx.strokeStyle = '#1e293b';
        ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
        ctx.setLineDash([]);
        // paddles
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(4, playerY, PADDLE_W, PADDLE_H);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(W - PADDLE_W - 4, aiY, PADDLE_W, PADDLE_H);
        // ball
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    }

    function update() {
        // player keyboard
        if (keys['ArrowUp']) playerY -= 6;
        if (keys['ArrowDown']) playerY += 6;
        playerY = Math.max(0, Math.min(H - PADDLE_H, playerY));

        // ai tracking
        const aiCenter = aiY + PADDLE_H / 2;
        const target = ball.y;
        if (aiCenter < target - 4) aiY += 4.2;
        else if (aiCenter > target + 4) aiY -= 4.2;
        aiY = Math.max(0, Math.min(H - PADDLE_H, aiY));

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = -ball.vy; }
        if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy = -ball.vy; }

        // paddle collisions
        if (ball.x - BALL_R < 4 + PADDLE_W && ball.y > playerY && ball.y < playerY + PADDLE_H && ball.vx < 0) {
            ball.vx = -ball.vx * 1.05;
            const hit = (ball.y - (playerY + PADDLE_H / 2)) / (PADDLE_H / 2);
            ball.vy = hit * 5;
        }
        if (ball.x + BALL_R > W - PADDLE_W - 4 && ball.y > aiY && ball.y < aiY + PADDLE_H && ball.vx > 0) {
            ball.vx = -ball.vx * 1.05;
            const hit = (ball.y - (aiY + PADDLE_H / 2)) / (PADDLE_H / 2);
            ball.vy = hit * 5;
        }

        // scoring
        if (ball.x < 0) {
            aiScore++; aiScoreElem.innerText = aiScore;
            if (aiScore >= WIN) { endGame(false); return; }
            resetBall(-1);
        }
        if (ball.x > W) {
            playerScore++; playerScoreElem.innerText = playerScore;
            if (playerScore >= WIN) { endGame(true); return; }
            resetBall(1);
        }
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        raf = requestAnimationFrame(loop);
    }

    function endGame(playerWon) {
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        overlayTitle.innerText = playerWon ? 'You Win! 🏆' : 'AI Wins';
        overlayMsg.innerText = `Final: You ${playerScore} - ${aiScore} AI`;
        overlay.classList.remove('hidden');
        statusElem.innerText = playerWon ? 'Victory' : 'Defeat';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('pong', playerScore);
    }

    function startGame() {
        overlay.classList.add('hidden');
        playerScore = 0; aiScore = 0;
        playerScoreElem.innerText = '0'; aiScoreElem.innerText = '0';
        statusElem.innerText = 'Playing';
        startBtn.innerText = 'Restart';
        playerY = H / 2 - PADDLE_H / 2; aiY = H / 2 - PADDLE_H / 2;
        resetBall(Math.random() > 0.5 ? 1 : -1);
        running = true;
        loop();
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => { overlay.classList.add('hidden'); startGame(); });

    const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const y = (e.clientY - rect.top) * (H / rect.height);
        playerY = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2));
    };
    canvas.addEventListener('mousemove', onMove);
    const onTouch = (e) => { e.preventDefault(); if (e.touches[0]) onMove(e.touches[0]); };
    canvas.addEventListener('touchmove', onTouch, { passive: false });

    const onKey = (e) => { keys[e.key] = (e.type === 'keydown'); if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);


    // Mobile up/down controls
    const pControls = document.createElement('div');
    pControls.className = 'flex gap-3 justify-center mt-2 md:hidden';
    pControls.innerHTML = '<button id="pong-up" class="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-6 py-3 text-lg font-bold touch-manipulation">? Up</button><button id="pong-down" class="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-6 py-3 text-lg font-bold touch-manipulation">? Down</button>';
    const pWrapper = container.firstElementChild;
    if (pWrapper) pWrapper.appendChild(pControls);
    const pUp = document.getElementById('pong-up');
    const pDown = document.getElementById('pong-down');
    let pHeld = null;
    function pHold(dir, on) { if (on) pHeld = dir; else if (pHeld === dir) pHeld = null; }
    if (pUp) {
        pUp.addEventListener('touchstart', (e) => { e.preventDefault(); pHold('up', true); }, { passive: false });
        pUp.addEventListener('touchend', () => pHold('up', false));
        pUp.addEventListener('mousedown', () => pHold('up', true));
        pUp.addEventListener('mouseup', () => pHold('up', false));
        pUp.addEventListener('mouseleave', () => pHold('up', false));
    }
    if (pDown) {
        pDown.addEventListener('touchstart', (e) => { e.preventDefault(); pHold('down', true); }, { passive: false });
        pDown.addEventListener('touchend', () => pHold('down', false));
        pDown.addEventListener('mousedown', () => pHold('down', true));
        pDown.addEventListener('mouseup', () => pHold('down', false));
        pDown.addEventListener('mouseleave', () => pHold('down', false));
    }
    // integrate held direction into update: override player movement when held
    const origUpdate = update;
    // We'll patch by adding held movement inside the existing loop via monkey: instead, add interval
    const pHoldInterval = setInterval(() => {
        if (!running) return;
        if (pHeld === 'up') playerY = Math.max(0, playerY - 8);
        if (pHeld === 'down') playerY = Math.min(H - PADDLE_H, playerY + 8);
    }, 30);

    draw();

    return () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        clearInterval(pHoldInterval);
        canvas.removeEventListener('mousemove', onMove);
        canvas.removeEventListener('touchmove', onTouch);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKey);
    };
}
