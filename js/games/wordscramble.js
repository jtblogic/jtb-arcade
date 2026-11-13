// js/games/wordscramble.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Word Scramble';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="ws-score" class="text-xl font-black text-green-400">0</div>
                </div>
                <div id="ws-timer" class="text-xs font-bold text-slate-300">60s</div>
                <div id="ws-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="ws-start-btn" class="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div class="text-[10px] text-slate-500 uppercase mb-1">Unscramble this word</div>
                <div id="ws-scrambled" class="text-3xl font-black text-slate-100 tracking-widest mb-4">?</div>
                <div class="flex gap-2">
                    <input id="ws-input" type="text" placeholder="Your answer" class="search-input" style="padding-left:1rem;">
                    <button id="ws-submit" class="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 rounded-xl">Go</button>
                </div>
            </div>
            <div id="ws-overlay" class="hidden">
                <p id="ws-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="ws-restart-btn" class="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const words = ['planet','school','friend','garden','window','castle','bridge','forest','animal','puzzle','rocket','silver','orange','purple','yellow','memory','arcade','coding','typing','laptop','keyboard','monitor','browser','internet','science','history','geography','mathematics','education','learning','knowledge','victory','champion','adventure','mystery','journey','treasure','diamond','crystal','thunder','lightning'];

    const scoreElem = document.getElementById('ws-score');
    const timerElem = document.getElementById('ws-timer');
    const statusElem = document.getElementById('ws-status');
    const startBtn = document.getElementById('ws-start-btn');
    const scrambledElem = document.getElementById('ws-scrambled');
    const input = document.getElementById('ws-input');
    const submitBtn = document.getElementById('ws-submit');
    const overlay = document.getElementById('ws-overlay');
    const msgElem = document.getElementById('ws-msg');
    const restartBtn = document.getElementById('ws-restart-btn');

    let score = 0, timeLeft = 60, running = false, timerInterval = null, currentWord = '';

    function scramble(w) {
        const arr = w.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const s = arr.join('');
        return s === w ? scramble(w) : s;
    }

    function newWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        scrambledElem.innerText = scramble(currentWord).toUpperCase();
        input.value = '';
        input.focus();
    }

    function check() {
        if (!running) return;
        if (input.value.trim().toLowerCase() === currentWord) {
            score++; scoreElem.innerText = score; statusElem.innerText = 'Correct!';
            newWord();
        } else {
            statusElem.innerText = 'Try again';
        }
    }

    function endGame() {
        running = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        overlay.classList.remove('hidden');
        msgElem.innerText = `Time's up! Score: ${score}`;
        statusElem.innerText = 'Finished';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('wordscramble', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        score = 0; timeLeft = 60; running = true;
        scoreElem.innerText = '0'; timerElem.innerText = '60s'; statusElem.innerText = 'Go!';
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
    submitBtn.addEventListener('click', check);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    restartBtn.addEventListener('click', startGame);

    return () => { if (timerInterval) clearInterval(timerInterval); };
}
