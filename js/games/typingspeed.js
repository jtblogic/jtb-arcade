// js/games/typingspeed.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Typing Speed';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="ts-score" class="text-xl font-black text-cyan-400">0</div>
                </div>
                <div id="ts-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="ts-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="ts-start-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div class="text-[10px] text-slate-500 uppercase mb-1">Type this word</div>
                <div id="ts-word" class="text-3xl font-black text-slate-100 tracking-wide mb-4">?</div>
                <input id="ts-input" type="text" placeholder="Type here" class="search-input" style="padding-left:1rem;" autocapitalize="off" autocomplete="off" spellcheck="false">
            </div>
            <div id="ts-overlay" class="hidden">
                <p id="ts-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="ts-restart-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const words = ['planet','school','friend','garden','window','castle','bridge','forest','animal','puzzle','rocket','silver','orange','purple','yellow','memory','arcade','coding','typing','laptop','keyboard','monitor','browser','internet','science','history','geography','education','learning','knowledge','victory','champion','adventure','mystery','journey','treasure','diamond','crystal','thunder','lightning','keyboard','developer','software','hardware','network','database'];

    const scoreElem = document.getElementById('ts-score');
    const timerElem = document.getElementById('ts-timer');
    const statusElem = document.getElementById('ts-status');
    const startBtn = document.getElementById('ts-start-btn');
    const wordElem = document.getElementById('ts-word');
    const input = document.getElementById('ts-input');
    const overlay = document.getElementById('ts-overlay');
    const msgElem = document.getElementById('ts-msg');
    const restartBtn = document.getElementById('ts-restart-btn');

    let score = 0, timeLeft = 30, running = false, timerInterval = null, currentWord = '';

    function newWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        wordElem.innerText = currentWord;
        input.value = '';
        input.focus();
    }

    function check() {
        if (!running) return;
        if (input.value.trim().toLowerCase() === currentWord) {
            score++; scoreElem.innerText = score; statusElem.innerText = 'Correct!';
            newWord();
        }
    }

    function endGame() {
        running = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        const wpm = Math.round((score / 30) * 60);
        overlay.classList.remove('hidden');
        msgElem.innerText = `Time's up! Score: ${score} words (${wpm} WPM)`;
        statusElem.innerText = 'Finished';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('typingspeed', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        score = 0; timeLeft = 30; running = true;
        scoreElem.innerText = '0'; timerElem.innerText = '30s'; statusElem.innerText = 'Go!';
        startBtn.innerText = 'Restart';
        newWord();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!running) return;
            timeLeft--;
            timerElem.innerText = timeLeft + 's';
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    startBtn.addEventListener('click', startGame);
    input.addEventListener('input', check);
    restartBtn.addEventListener('click', startGame);

    return () => { if (timerInterval) clearInterval(timerInterval); };
}
