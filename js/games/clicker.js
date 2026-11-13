// js/games/clicker.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Energy Tap Rush';

    container.innerHTML = `
        <div class="text-center space-y-6 max-w-sm w-full">
            <div class="flex justify-around bg-slate-950 p-4 rounded-3xl border border-slate-800">
                <div>
                    <div class="text-xs text-slate-400 font-medium">Score</div>
                    <div id="click-score" class="text-3xl font-black text-cyan-400">0</div>
                </div>
                <div class="h-10 w-[1px] bg-slate-800 self-center"></div>
                <div>
                    <div class="text-xs text-slate-400 font-medium">Time Left</div>
                    <div id="click-timer" class="text-3xl font-black text-amber-400">10s</div>
                </div>
            </div>
            <button id="tap-btn" class="w-36 h-36 mx-auto bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full flex items-center justify-center text-3xl font-black shadow-xl shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer select-none">
                TAP!
            </button>
            <div id="click-message" class="text-xs text-slate-400 h-6"></div>
            <button id="click-start-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl transition cursor-pointer w-full shadow-lg shadow-indigo-600/20">Start Challenge</button>
        </div>
    `;

    let score = 0;
    let timeLeft = 10;
    let timerInterval = null;
    let isPlaying = false;

    const scoreElem = document.getElementById('click-score');
    const timerElem = document.getElementById('click-timer');
    const msgElem = document.getElementById('click-message');
    const startBtn = document.getElementById('click-start-btn');
    const tapBtn = document.getElementById('tap-btn');

    startBtn.addEventListener('click', () => {
        if (isPlaying) return;
        score = 0;
        timeLeft = 10;
        isPlaying = true;
        scoreElem.innerText = score;
        timerElem.innerText = timeLeft + 's';
        msgElem.innerText = 'Game On! Tap fast!';
        startBtn.classList.add('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElem.innerText = timeLeft + 's';
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isPlaying = false;
                msgElem.innerText = `Time up! Final Score: ${score}`;
                if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('clicker', score);
                startBtn.innerText = 'Play Again';
                startBtn.classList.remove('hidden');
            }
        }, 1000);
    });

    tapBtn.addEventListener('click', () => {
        if (!isPlaying) return;
        score++;
        scoreElem.innerText = score;
    });

    // Cleanup function
    return () => {
        if (timerInterval) clearInterval(timerInterval);
    };
}