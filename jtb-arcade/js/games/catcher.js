// js/games/catcher.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Catch the Coin';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Coins Caught</span>
                    <div id="catcher-score" class="text-xl font-black text-amber-400">0</div>
                </div>
                <div id="catcher-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="catcher-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="catcher-start-btn" class="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-amber-600/20">Start</button>
            </div>
            
            <div id="catcher-arena" class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mx-auto w-[300px] h-[320px] select-none">
                <div id="catcher-basket" class="absolute bottom-2 left-[120px] w-16 h-5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/40"></div>
                <div id="catcher-item" class="absolute top-0 left-[140px] text-2xl hidden">🪙</div>
                <div id="catcher-overlay" class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                    <i class="fa-solid fa-coins text-4xl text-amber-400 mb-2"></i>
                    <h3 class="font-bold text-slate-200 text-sm">Catch the Coin</h3>
                    <p class="text-[11px] text-slate-400 mt-1 mb-4">Slide basket or use buttons to catch gold. 30s round.</p>
                    <button id="catcher-play-btn" class="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg cursor-pointer">Play Now</button>
                </div>
            </div>

            <div class="flex justify-center gap-4 pt-1">
                <button id="btn-left" class="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-xl text-slate-200 cursor-pointer text-sm font-bold"><i class="fa-solid fa-arrow-left"></i> Left</button>
                <button id="btn-right" class="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-xl text-slate-200 cursor-pointer text-sm font-bold">Right <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
    `;

    let basketX = 120;
    let itemX = 140;
    let itemY = 0;
    let score = 0;
    let running = false;
    let gameInterval = null;
    let timerInterval = null;
    let timeLeft = 30;

    const basketElem = document.getElementById('catcher-basket');
    const itemElem = document.getElementById('catcher-item');
    const scoreElem = document.getElementById('catcher-score');
    const statusElem = document.getElementById('catcher-status');
    const timerElem = document.getElementById('catcher-timer');
    const overlay = document.getElementById('catcher-overlay');
    const startBtn = document.getElementById('catcher-start-btn');
    const playBtn = document.getElementById('catcher-play-btn');

    function moveBasket(offset) {
        if (!running) return;
        basketX = Math.max(0, Math.min(234, basketX + offset));
        basketElem.style.left = basketX + 'px';
    }

    function endGame() {
        running = false;
        if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        overlay.classList.remove('hidden');
        const title = overlay.querySelector('h3');
        const msg = overlay.querySelector('p');
        if (title) title.innerText = 'Time Up!';
        if (msg) msg.innerText = `Final Score: ${score} coins. Play again?`;
        playBtn.innerText = 'Play Again';
        statusElem.innerText = 'Finished';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('catcher', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        statusElem.innerText = 'Catch!';
        startBtn.innerText = 'Restart';

        score = 0;
        basketX = 120;
        itemX = Math.floor(Math.random() * 260);
        itemY = 0;
        timeLeft = 30;
        running = true;
        scoreElem.innerText = '0';
        timerElem.innerText = '30s';
        itemElem.style.display = 'block';

        if (gameInterval) clearInterval(gameInterval);
        if (timerInterval) clearInterval(timerInterval);

        gameInterval = setInterval(() => {
            if (!running) return;
            itemY += 5;
            itemElem.style.top = itemY + 'px';
            itemElem.style.left = itemX + 'px';

            if (itemY >= 280) {
                if (itemX >= basketX - 10 && itemX <= basketX + 55) {
                    score++;
                    scoreElem.innerText = score;
                }
                itemY = 0;
                itemX = Math.floor(Math.random() * 260);
            }
        }, 30);

        timerInterval = setInterval(() => {
            if (!running) return;
            timeLeft--;
            timerElem.innerText = timeLeft + 's';
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    startBtn.addEventListener('click', startGame);
    playBtn.addEventListener('click', startGame);
    document.getElementById('btn-left').addEventListener('click', () => moveBasket(-25));
    document.getElementById('btn-right').addEventListener('click', () => moveBasket(25));

    return () => {
        if (gameInterval) clearInterval(gameInterval);
        if (timerInterval) clearInterval(timerInterval);
    };
}
