// js/games/hangman.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Hangman';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="hm-score" class="text-xl font-black text-rose-400">0</div>
                </div>
                <div id="hm-wrong" class="text-xs font-bold text-slate-300">Wrong: 0/6</div>
                <div id="hm-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="hm-start-btn" class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="hm-word" class="text-2xl font-black text-slate-100 tracking-widest mb-4">_ _ _ _</div>
                <div id="hm-letters" class="grid grid-cols-7 gap-1.5"></div>
            </div>
            <div id="hm-overlay" class="hidden">
                <p id="hm-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="hm-restart-btn" class="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const words = ['planet','school','friend','garden','window','castle','bridge','forest','animal','puzzle','rocket','silver','orange','purple','yellow','memory','arcade','coding','typing','laptop','keyboard','monitor','browser','internet','science','history','geography','mathematics','education','learning','knowledge','victory','champion','adventure','mystery','journey','treasure','diamond','crystal','thunder','lightning'];

    const scoreElem = document.getElementById('hm-score');
    const wrongElem = document.getElementById('hm-wrong');
    const statusElem = document.getElementById('hm-status');
    const startBtn = document.getElementById('hm-start-btn');
    const wordElem = document.getElementById('hm-word');
    const lettersElem = document.getElementById('hm-letters');
    const overlay = document.getElementById('hm-overlay');
    const msgElem = document.getElementById('hm-msg');
    const restartBtn = document.getElementById('hm-restart-btn');

    let score = 0, running = false, word = '', guessed = new Set(), wrong = 0;

    function renderWord() {
        wordElem.innerText = word.split('').map(c => guessed.has(c) ? c.toUpperCase() : '_').join(' ');
    }

    function buildLetters() {
        lettersElem.innerHTML = '';
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(97 + i);
            const btn = document.createElement('button');
            btn.className = 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-lg transition touch-manipulation text-sm';
            btn.innerText = ch.toUpperCase();
            btn.addEventListener('click', () => guess(ch));
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); guess(ch); }, { passive: false });
            lettersElem.appendChild(btn);
        }
    }

    function guess(ch) {
        if (!running || guessed.has(ch)) return;
        guessed.add(ch);
        // disable button
        const btns = lettersElem.querySelectorAll('button');
        btns.forEach(b => { if (b.innerText.toLowerCase() === ch) { b.classList.add('opacity-30','cursor-not-allowed'); b.disabled = true; } });
        if (word.includes(ch)) {
            renderWord();
            statusElem.innerText = 'Good!';
            if (word.split('').every(c => guessed.has(c))) {
                score++; scoreElem.innerText = score; statusElem.innerText = 'You got it!';
                nextWord();
            }
        } else {
            wrong++;
            wrongElem.innerText = `Wrong: ${wrong}/6`;
            statusElem.innerText = 'Wrong!';
            if (wrong >= 6) endGame(false);
        }
    }

    function nextWord() {
        word = words[Math.floor(Math.random() * words.length)];
        guessed = new Set(); wrong = 0;
        wrongElem.innerText = 'Wrong: 0/6';
        renderWord();
        // reset letters
        lettersElem.querySelectorAll('button').forEach(b => { b.classList.remove('opacity-30','cursor-not-allowed'); b.disabled = false; });
    }

    function endGame(won) {
        running = false;
        overlay.classList.remove('hidden');
        msgElem.innerText = won ? `You won! Score: ${score}` : `Game Over! Word was "${word}". Score: ${score}`;
        statusElem.innerText = won ? 'Victory' : 'Defeat';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('hangman', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        score = 0; running = true;
        scoreElem.innerText = '0'; statusElem.innerText = 'Go!';
        startBtn.innerText = 'Restart';
        buildLetters();
        nextWord();
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    return () => {};
}
