// js/games/colorswitch.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Color Switch Reflex';

    container.innerHTML = `
        <div class="text-center space-y-6 max-w-sm w-full">
            <div class="flex justify-around bg-slate-950 p-4 rounded-3xl border border-slate-800">
                <div>
                    <div class="text-xs text-slate-400 font-medium">Streak</div>
                    <div id="color-score" class="text-3xl font-black text-purple-400">0</div>
                </div>
                <div class="h-10 w-[1px] bg-slate-800 self-center"></div>
                <div>
                    <div class="text-xs text-slate-400 font-medium">Time Left</div>
                    <div id="color-timer" class="text-3xl font-black text-amber-400">15s</div>
                </div>
            </div>

            <div class="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center h-36">
                <span class="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Does ink color match word?</span>
                <div id="color-word" class="text-3xl font-black tracking-wide">RED</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <button id="btn-yes" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer shadow-lg shadow-emerald-600/20">YES</button>
                <button id="btn-no" class="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer shadow-lg shadow-rose-600/20">NO</button>
            </div>

            <button id="color-start-btn" class="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-2xl transition cursor-pointer w-full shadow-lg shadow-purple-600/20">Start Reflex Test</button>
        </div>
    `;

    let score = 0;
    let timer = 15;
    let active = false;
    let isMatch = false;
    let timerInterval = null;

    const scoreElem = document.getElementById('color-score');
    const timerElem = document.getElementById('color-timer');
    const wordElem = document.getElementById('color-word');
    const startBtn = document.getElementById('color-start-btn');

    function nextRound() {
        if (!active) return;
        const words = ['RED', 'BLUE', 'GREEN', 'PURPLE'];
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#a855f7'];

        let randWordIdx = Math.floor(Math.random() * words.length);
        let randColorIdx = Math.floor(Math.random() * colors.length);

        isMatch = randWordIdx === randColorIdx;
        wordElem.innerText = words[randWordIdx];
        wordElem.style.color = colors[randColorIdx];
    }

    function checkAnswer(userAnswer) {
        if (!active) return;
        if (userAnswer === isMatch) {
            score++;
            scoreElem.innerText = score;
        } else {
            score = Math.max(0, score - 1);
            scoreElem.innerText = score;
        }
        nextRound();
    }

    startBtn.addEventListener('click', () => {
        score = 0;
        timer = 15;
        active = true;
        scoreElem.innerText = '0';
        timerElem.innerText = '15s';
        startBtn.classList.add('hidden');
        nextRound();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer--;
            timerElem.innerText = timer + 's';
            if (timer <= 0) {
                clearInterval(timerInterval);
                active = false;
                wordElem.innerText = `Time's Up! Streak: ${score}`;
                if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('colorswitch', score);
                wordElem.style.color = '#ffffff';
                startBtn.innerText = 'Play Again';
                startBtn.classList.remove('hidden');
            }
        }, 1000);
    });

    document.getElementById('btn-yes').addEventListener('click', () => checkAnswer(true));
    document.getElementById('btn-no').addEventListener('click', () => checkAnswer(false));

    return () => {
        if (timerInterval) clearInterval(timerInterval);
    };
}