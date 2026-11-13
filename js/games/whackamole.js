// js/games/whackamole.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Whack-a-Mole';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="wm-score" class="text-xl font-black text-orange-400">0</div>
                </div>
                <div id="wm-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="wm-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="wm-start-btn" class="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div id="wm-grid" class="grid grid-cols-3 gap-3 mx-auto w-[280px]"></div>
            <div id="wm-overlay" class="hidden">
                <p id="wm-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="wm-restart-btn" class="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const scoreElem = document.getElementById('wm-score');
    const timerElem = document.getElementById('wm-timer');
    const statusElem = document.getElementById('wm-status');
    const startBtn = document.getElementById('wm-start-btn');
    const grid = document.getElementById('wm-grid');
    const overlay = document.getElementById('wm-overlay');
    const msgElem = document.getElementById('wm-msg');
    const restartBtn = document.getElementById('wm-restart-btn');

    // build holes
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('button');
        hole.className = 'wm-hole h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl transition touch-manipulation';
        hole.dataset.index = i;
        hole.innerText = '';
        grid.appendChild(hole);
    }
    const holes = Array.from(grid.querySelectorAll('.wm-hole'));

    let score = 0, timeLeft = 30, running = false, timerInterval = null, moleInterval = null, activeMole = -1;

    function showMole() {
        if (!running) return;
        if (activeMole >= 0) holes[activeMole].innerText = '';
        activeMole = Math.floor(Math.random() * 9);
        holes[activeMole].innerText = '🐹';
    }

    function whack(i) {
        if (!running) return;
        if (i === activeMole) {
            score++; scoreElem.innerText = score; statusElem.innerText = 'Hit!';
            holes[activeMole].innerText = '';
            activeMole = -1;
        }
    }

    holes.forEach((h, i) => {
        h.addEventListener('click', () => whack(i));
        h.addEventListener('touchstart', (e) => { e.preventDefault(); whack(i); }, { passive: false });
    });

    function endGame() {
        running = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        if (moleInterval) { clearInterval(moleInterval); moleInterval = null; }
        if (activeMole >= 0) { holes[activeMole].innerText = ''; activeMole = -1; }
        overlay.classList.remove('hidden');
        msgElem.innerText = `Time's up! Score: ${score}`;
        statusElem.innerText = 'Finished';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('whackamole', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        score = 0; timeLeft = 30; running = true;
        scoreElem.innerText = '0'; timerElem.innerText = '30s'; statusElem.innerText = 'Go!';
        startBtn.innerText = 'Restart';
        if (activeMole >= 0) { holes[activeMole].innerText = ''; activeMole = -1; }
        if (timerInterval) clearInterval(timerInterval);
        if (moleInterval) clearInterval(moleInterval);
        showMole();
        moleInterval = setInterval(showMole, 900);
        timerInterval = setInterval(() => {
            if (!running) return;
            timeLeft--;
            timerElem.innerText = timeLeft + 's';
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    return () => {
        if (timerInterval) clearInterval(timerInterval);
        if (moleInterval) clearInterval(moleInterval);
    };
}
