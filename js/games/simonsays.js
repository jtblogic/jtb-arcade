// js/games/simonsays.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Simon Says';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Level</span>
                    <div id="ss-level" class="text-xl font-black text-amber-400">0</div>
                </div>
                <div id="ss-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="ss-start-btn" class="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="grid grid-cols-2 gap-3 mx-auto w-[260px]">
                <button data-color="0" class="ss-btn h-24 rounded-2xl bg-rose-500/70 hover:bg-rose-500 active:scale-95 transition touch-manipulation"></button>
                <button data-color="1" class="ss-btn h-24 rounded-2xl bg-blue-500/70 hover:bg-blue-500 active:scale-95 transition touch-manipulation"></button>
                <button data-color="2" class="ss-btn h-24 rounded-2xl bg-emerald-500/70 hover:bg-emerald-500 active:scale-95 transition touch-manipulation"></button>
                <button data-color="3" class="ss-btn h-24 rounded-2xl bg-yellow-500/70 hover:bg-yellow-500 active:scale-95 transition touch-manipulation"></button>
            </div>
            <div id="ss-overlay" class="hidden">
                <p id="ss-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="ss-restart-btn" class="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const levelElem = document.getElementById('ss-level');
    const statusElem = document.getElementById('ss-status');
    const startBtn = document.getElementById('ss-start-btn');
    const btns = Array.from(document.querySelectorAll('.ss-btn'));
    const overlay = document.getElementById('ss-overlay');
    const msgElem = document.getElementById('ss-msg');
    const restartBtn = document.getElementById('ss-restart-btn');

    const colors = ['#f43f5e','#3b82f6','#10b981','#eab308'];
    let sequence = [], playerIdx = 0, level = 0, running = false, accepting = false;

    function flash(idx) {
        const btn = btns[idx];
        const orig = btn.style.filter;
        btn.style.filter = 'brightness(1.8)';
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => { btn.style.filter = ''; btn.style.transform = ''; }, 300);
    }

    function playSequence() {
        accepting = false;
        statusElem.innerText = 'Watch...';
        let i = 0;
        const iv = setInterval(() => {
            flash(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(iv);
                setTimeout(() => { accepting = true; playerIdx = 0; statusElem.innerText = 'Your turn'; }, 400);
            }
        }, 600);
    }

    function nextLevel() {
        level++;
        levelElem.innerText = level;
        sequence.push(Math.floor(Math.random() * 4));
        playSequence();
    }

    function handleColor(idx) {
        if (!running || !accepting) return;
        flash(idx);
        if (idx === sequence[playerIdx]) {
            playerIdx++;
            if (playerIdx >= sequence.length) {
                accepting = false;
                statusElem.innerText = 'Good!';
                setTimeout(nextLevel, 600);
            }
        } else {
            endGame();
        }
    }

    btns.forEach((btn, i) => {
        btn.addEventListener('click', () => handleColor(i));
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleColor(i); }, { passive: false });
    });

    function endGame() {
        running = false; accepting = false;
        overlay.classList.remove('hidden');
        msgElem.innerText = `Game Over! Reached level ${level}`;
        statusElem.innerText = 'Defeat';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('simonsays', level);
    }

    function startGame() {
        overlay.classList.add('hidden');
        sequence = []; level = 0; running = true;
        levelElem.innerText = '0'; statusElem.innerText = 'Go!';
        startBtn.innerText = 'Restart';
        nextLevel();
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    return () => {};
}
