// js/games/coinflip.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Coin Flip';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span><div id="cf-score" class="text-xl font-black text-amber-400">0</div></div>
                <div id="cf-status" class="text-xs font-bold text-slate-300">Pick heads or tails</div>
                <button id="cf-start" class="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Flip</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="cf-coin" class="text-6xl mb-4">??</div>
                <div class="flex gap-3 justify-center">
                    <button id="cf-heads" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl touch-manipulation">Heads</button>
                    <button id="cf-tails" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl touch-manipulation">Tails</button>
                </div>
            </div>
            <div id="cf-overlay" class="hidden"><p id="cf-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="cf-restart" class="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const coinElem = document.getElementById('cf-coin'), scoreElem = document.getElementById('cf-score');
    const statusElem = document.getElementById('cf-status'), overlay = document.getElementById('cf-overlay');
    const msgElem = document.getElementById('cf-msg'), restartBtn = document.getElementById('cf-restart');
    let score=0, rounds=0, maxRounds=10, waiting=false, pick=null;
    function flip() {
        const res = Math.random() < 0.5 ? 'heads' : 'tails';
        coinElem.innerText = res === 'heads' ? '??' : '??';
        if (pick === res) { score++; scoreElem.innerText=score; statusElem.innerText='Correct!'; }
        else statusElem.innerText='Wrong!';
        waiting=false; rounds++;
        if (rounds>=maxRounds) endGame();
    }
    function endGame() { overlay.classList.remove('hidden'); msgElem.innerText=`Final score: ${score}/${maxRounds}`; if (window.app && typeof window.app.reportScore==='function') window.app.reportScore('coinflip', score); }
    document.getElementById('cf-start').addEventListener('click', () => { if (waiting) return; if (pick===null){statusElem.innerText='Pick first';return;} flip(); });
    function choose(p){ pick=p; statusElem.innerText = 'Chosen: '+p+' - flip now'; }
    document.getElementById('cf-heads').addEventListener('click', () => choose('heads'));
    document.getElementById('cf-tails').addEventListener('click', () => choose('tails'));
    document.getElementById('cf-heads').addEventListener('touchstart', (e)=>{e.preventDefault();choose('heads');},{passive:false});
    document.getElementById('cf-tails').addEventListener('touchstart', (e)=>{e.preventDefault();choose('tails');},{passive:false});
    restartBtn.addEventListener('click', () => { score=0;rounds=0;pick=null;scoreElem.innerText='0';coinElem.innerText='??';statusElem.innerText='Pick heads or tails';overlay.classList.add('hidden'); });
    return () => {};
}
