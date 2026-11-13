// js/games/rps.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Rock Paper Scissors';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">You</span><div id="rps-you" class="text-xl font-black text-indigo-400">0</div></div>
                <div id="rps-status" class="text-xs font-bold text-slate-300">Pick one</div>
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">CPU</span><div id="rps-cpu" class="text-xl font-black text-rose-400">0</div></div>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="rps-result" class="text-2xl font-black text-slate-100 mb-4">?</div>
                <div class="flex gap-3 justify-center">
                    <button data-p="0" class="rps-btn bg-slate-800 hover:bg-slate-700 text-3xl py-4 px-5 rounded-2xl touch-manipulation">?</button>
                    <button data-p="1" class="rps-btn bg-slate-800 hover:bg-slate-700 text-3xl py-4 px-5 rounded-2xl touch-manipulation">?</button>
                    <button data-p="2" class="rps-btn bg-slate-800 hover:bg-slate-700 text-3xl py-4 px-5 rounded-2xl touch-manipulation">??</button>
                </div>
            </div>
            <div id="rps-overlay" class="hidden"><p id="rps-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="rps-restart" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const names = ['Rock','Paper','Scissors'];
    const youElem = document.getElementById('rps-you'), cpuElem = document.getElementById('rps-cpu');
    const statusElem = document.getElementById('rps-status'), resultElem = document.getElementById('rps-result');
    const overlay = document.getElementById('rps-overlay'), msgElem = document.getElementById('rps-msg');
    const restartBtn = document.getElementById('rps-restart');
    let you=0, cpu=0, rounds=0, maxRounds=10;
    function play(p) {
        const c = Math.floor(Math.random()*3);
        resultElem.innerText = `${names[p]} vs ${names[c]}`;
        if (p === c) statusElem.innerText = 'Draw';
        else if ((p+1)%3 === c) { cpu++; cpuElem.innerText = cpu; statusElem.innerText = 'You lose'; }
        else { you++; youElem.innerText = you; statusElem.innerText = 'You win'; }
        rounds++;
        if (rounds >= maxRounds) endGame();
    }
    function endGame() {
        overlay.classList.remove('hidden');
        msgElem.innerText = `Final: You ${you} - ${cpu} CPU`;
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('rps', you);
    }
    document.querySelectorAll('.rps-btn').forEach(b => {
        b.addEventListener('click', () => play(parseInt(b.dataset.p)));
        b.addEventListener('touchstart', (e) => { e.preventDefault(); play(parseInt(b.dataset.p)); }, { passive: false });
    });
    restartBtn.addEventListener('click', () => { you=0;cpu=0;rounds=0; youElem.innerText='0';cpuElem.innerText='0'; resultElem.innerText='?'; statusElem.innerText='Pick one'; overlay.classList.add('hidden'); });
    return () => {};
}
