// js/games/capitalquiz.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Capital Quiz';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="cq-score" class="text-xl font-black text-purple-400">0</div>
                </div>
                <div id="cq-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="cq-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="cq-start-btn" class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div class="text-[10px] text-slate-500 uppercase mb-1">Capital of</div>
                <div id="cq-country" class="text-2xl font-black text-slate-100 mb-4">?</div>
                <div id="cq-options" class="grid grid-cols-2 gap-3"></div>
            </div>
            <div id="cq-overlay" class="hidden">
                <p id="cq-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="cq-restart-btn" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const data = [
        ['France','Paris'],['Germany','Berlin'],['Italy','Rome'],['Spain','Madrid'],['United Kingdom','London'],
        ['Japan','Tokyo'],['China','Beijing'],['India','New Delhi'],['Australia','Canberra'],['Brazil','Brasilia'],
        ['Canada','Ottawa'],['Russia','Moscow'],['Egypt','Cairo'],['Turkey','Ankara'],['Greece','Athens'],
        ['Portugal','Lisbon'],['Netherlands','Amsterdam'],['Sweden','Stockholm'],['Norway','Oslo'],['Denmark','Copenhagen'],
        ['Poland','Warsaw'],['Austria','Vienna'],['Switzerland','Bern'],['Belgium','Brussels'],['Ireland','Dublin']
    ];

    const scoreElem = document.getElementById('cq-score');
    const timerElem = document.getElementById('cq-timer');
    const statusElem = document.getElementById('cq-status');
    const startBtn = document.getElementById('cq-start-btn');
    const countryElem = document.getElementById('cq-country');
    const optionsElem = document.getElementById('cq-options');
    const overlay = document.getElementById('cq-overlay');
    const msgElem = document.getElementById('cq-msg');
    const restartBtn = document.getElementById('cq-restart-btn');

    let score = 0, timeLeft = 30, running = false, timerInterval = null, currentAnswer = '';

    function genQuestion() {
        const idx = Math.floor(Math.random() * data.length);
        const [country, capital] = data[idx];
        currentAnswer = capital;
        countryElem.innerText = country;
        const capitals = data.map(d => d[1]);
        const opts = new Set([capital]);
        while (opts.size < 4) opts.add(capitals[Math.floor(Math.random() * capitals.length)]);
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
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('capitalquiz', score);
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
