// js/games/mathquiz.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Math Quiz';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="mq-score" class="text-xl font-black text-blue-400">0</div>
                </div>
                <div id="mq-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="mq-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="mq-start-btn" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="mq-question" class="text-3xl font-black text-slate-100 mb-4">?</div>
                <div id="mq-options" class="grid grid-cols-2 gap-3"></div>
            </div>
            <div id="mq-overlay" class="hidden">
                <p id="mq-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="mq-restart-btn" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const scoreElem = document.getElementById('mq-score');
    const timerElem = document.getElementById('mq-timer');
    const statusElem = document.getElementById('mq-status');
    const startBtn = document.getElementById('mq-start-btn');
    const questionElem = document.getElementById('mq-question');
    const optionsElem = document.getElementById('mq-options');
    const overlay = document.getElementById('mq-overlay');
    const msgElem = document.getElementById('mq-msg');
    const restartBtn = document.getElementById('mq-restart-btn');

    let score = 0, timeLeft = 30, running = false, timerInterval = null, currentAnswer = 0;

    function genQuestion() {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, ans;
        if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; ans = a + b; }
        else if (op === '-') { a = Math.floor(Math.random() * 30) + 5; b = Math.floor(Math.random() * a); ans = a - b; }
        else { a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; ans = a * b; }
        currentAnswer = ans;
        questionElem.innerText = `${a} ${op} ${b} = ?`;
        // options
        const opts = new Set([ans]);
        while (opts.size < 4) opts.add(ans + Math.floor(Math.random() * 11) - 5);
        const arr = Array.from(opts).sort(() => Math.random() - 0.5);
        optionsElem.innerHTML = '';
        arr.forEach(v => {
            const btn = document.createElement('button');
            btn.className = 'bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-3 rounded-xl transition touch-manipulation';
            btn.innerText = v;
            btn.addEventListener('click', () => answer(v));
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); answer(v); }, { passive: false });
            optionsElem.appendChild(btn);
        });
    }

    function answer(v) {
        if (!running) return;
        if (v === currentAnswer) { score++; scoreElem.innerText = score; statusElem.innerText = 'Correct!'; }
        else { statusElem.innerText = 'Wrong!'; }
        genQuestion();
    }

    function endGame() {
        running = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        overlay.classList.remove('hidden');
        msgElem.innerText = `Time's up! Score: ${score}`;
        statusElem.innerText = 'Finished';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('mathquiz', score);
    }

    function startGame() {
        overlay.classList.add('hidden');
        score = 0; timeLeft = 30; running = true;
        scoreElem.innerText = '0'; timerElem.innerText = '30s'; statusElem.innerText = 'Go!';
        startBtn.innerText = 'Restart';
        genQuestion();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!running) return;
            timeLeft--;
            timerElem.innerText = timeLeft + 's';
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    return () => { if (timerInterval) clearInterval(timerInterval); };
}
