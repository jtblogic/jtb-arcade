// js/games/diceroll.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Dice Roll';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span><div id="dr-score" class="text-xl font-black text-indigo-400">0</div></div>
                <div id="dr-status" class="text-xs font-bold text-slate-300">Guess high or low</div>
                <button id="dr-start" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Roll</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="dr-dice" class="text-6xl mb-4">??</div>
                <div class="flex gap-3 justify-center">
                    <button id="dr-low" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl touch-manipulation">Low (1-3)</button>
                    <button id="dr-high" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl touch-manipulation">High (4-6)</button>
                </div>
            </div>
            <div id="dr-overlay" class="hidden"><p id="dr-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="dr-restart" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const diceElem = document.getElementById('dr-dice'), scoreElem = document.getElementById('dr-score');
    const statusElem = document.getElementById('dr-status'), overlay = document.getElementById('dr-overlay');
    const msgElem = document.getElementById('dr-msg'), restartBtn = document.getElementById('dr-restart');
    const faces = ['?','?','?','?','?','?'];
    let score=0, rounds=0, maxRounds=10, waiting=false, lastRoll=0;
    function roll() { lastRoll = Math.floor(Math.random()*6)+1; diceElem.innerText = faces[lastRoll-1]; }
    function guess(high) {
        if (!waiting) { statusElem.innerText='Roll first'; return; }
        waiting=false;
        const isHigh = lastRoll >=4;
        if (isHigh === high) { score++; scoreElem.innerText=score; statusElem.innerText='Correct!'; }
        else statusElem.innerText='Wrong!';
        rounds++;
        if (rounds>=maxRounds) endGame();
    }
    function endGame() { overlay.classList.remove('hidden'); msgElem.innerText=`Final score: ${score}/${maxRounds}`; if (window.app && typeof window.app.reportScore==='function') window.app.reportScore('diceroll', score); }
    document.getElementById('dr-start').addEventListener('click', () => { roll(); waiting=true; statusElem.innerText='High or low?'; });
    document.getElementById('dr-low').addEventListener('click', () => guess(false));
    document.getElementById('dr-high').addEventListener('click', () => guess(true));
    document.getElementById('dr-low').addEventListener('touchstart', (e)=>{e.preventDefault();guess(false);},{passive:false});
    document.getElementById('dr-high').addEventListener('touchstart', (e)=>{e.preventDefault();guess(true);},{passive:false});
    restartBtn.addEventListener('click', () => { score=0;rounds=0;scoreElem.innerText='0';diceElem.innerText='??';statusElem.innerText='Guess high or low';overlay.classList.add('hidden'); });
    return () => {};
}
