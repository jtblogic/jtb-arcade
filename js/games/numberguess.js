// js/games/numberguess.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Number Guess';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Best</span>
                    <div id="ng-best" class="text-xl font-black text-teal-400">-</div>
                </div>
                <div id="ng-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="ng-start-btn" class="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">New Game</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div class="text-[10px] text-slate-500 uppercase mb-1">Guess a number 1-100</div>
                <div id="ng-hint" class="text-2xl font-black text-slate-100 mb-4">?</div>
                <div class="flex gap-2">
                    <input id="ng-input" type="number" min="1" max="100" placeholder="Your guess" class="search-input" style="padding-left:1rem;">
                    <button id="ng-submit" class="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 rounded-xl">Guess</button>
                </div>
                <div id="ng-history" class="mt-3 text-xs text-slate-400 max-h-20 overflow-y-auto"></div>
            </div>
            <div id="ng-overlay" class="hidden">
                <p id="ng-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="ng-restart-btn" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const bestElem = document.getElementById('ng-best');
    const statusElem = document.getElementById('ng-status');
    const startBtn = document.getElementById('ng-start-btn');
    const hintElem = document.getElementById('ng-hint');
    const input = document.getElementById('ng-input');
    const submitBtn = document.getElementById('ng-submit');
    const historyElem = document.getElementById('ng-history');
    const overlay = document.getElementById('ng-overlay');
    const msgElem = document.getElementById('ng-msg');
    const restartBtn = document.getElementById('ng-restart-btn');

    let secret = 0, guesses = 0, running = false, best = null;

    try { best = parseInt(localStorage.getItem('ng_best')); if (isNaN(best)) best = null; } catch (e) {}
    if (best !== null) bestElem.innerText = best;

    function newGame() {
        overlay.classList.add('hidden');
        secret = Math.floor(Math.random() * 100) + 1;
        guesses = 0; running = true;
        hintElem.innerText = 'Make a guess!';
        statusElem.innerText = 'Playing';
        historyElem.innerText = '';
        input.value = '';
        input.focus();
        startBtn.innerText = 'New Game';
    }

    function check() {
        if (!running) return;
        const g = parseInt(input.value);
        if (isNaN(g) || g < 1 || g > 100) { statusElem.innerText = 'Enter 1-100'; return; }
        guesses++;
        let hint = '';
        if (g === secret) {
            running = false;
            hint = `Correct! ${secret}`;
            hintElem.innerText = hint;
            statusElem.innerText = 'You won!';
            const score = Math.max(1, 100 - guesses + 1);
            if (best === null || guesses < best) { best = guesses; bestElem.innerText = best; try { localStorage.setItem('ng_best', best); } catch (e) {} }
            overlay.classList.remove('hidden');
            msgElem.innerText = `You found it in ${guesses} guesses! Score: ${score}`;
            if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('numberguess', score);
        } else if (g < secret) {
            hint = `${g} is too low`;
            hintElem.innerText = 'Higher ↑';
        } else {
            hint = `${g} is too high`;
            hintElem.innerText = 'Lower ↓';
        }
        historyElem.innerText = (historyElem.innerText + ' ' + g).trim();
        input.value = '';
        input.focus();
    }

    startBtn.addEventListener('click', newGame);
    submitBtn.addEventListener('click', check);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    restartBtn.addEventListener('click', newGame);

    newGame();

    return () => {};
}
