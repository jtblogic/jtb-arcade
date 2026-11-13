// js/games/patternmemory.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Pattern Memory';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Level</span><div id="pm-level" class="text-xl font-black text-pink-400">0</div></div>
                <div id="pm-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="pm-start" class="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div id="pm-grid" class="grid grid-cols-3 gap-2 mx-auto w-[240px]"></div>
            <div id="pm-overlay" class="hidden"><p id="pm-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="pm-restart" class="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const grid = document.getElementById('pm-grid');
    for (let i=0;i<9;i++){const c=document.createElement('button');c.className='pm-cell h-16 rounded-xl bg-slate-800 border border-slate-700 touch-manipulation';c.dataset.i=i;grid.appendChild(c);}
    const cells = Array.from(grid.querySelectorAll('.pm-cell'));
    const levelElem = document.getElementById('pm-level'), statusElem = document.getElementById('pm-status');
    const overlay = document.getElementById('pm-overlay'), msgElem = document.getElementById('pm-msg');
    const restartBtn = document.getElementById('pm-restart');
    let seq=[], player=[], level=0, showing=false, accepting=false;
    function flash(i){cells[i].style.background='#ec4899';setTimeout(()=>{cells[i].style.background='';},300);}
    function showSeq(){ accepting=false; statusElem.innerText='Watch...'; let i=0; const iv=setInterval(()=>{flash(seq[i]);i++;if(i>=seq.length){clearInterval(iv);setTimeout(()=>{accepting=true;player=[];statusElem.innerText='Your turn';},400);}},600);}
    function nextLevel(){level++;levelElem.innerText=level;seq.push(Math.floor(Math.random()*9));showSeq();}
    cells.forEach((c,i)=>{c.addEventListener('click',()=>{if(!accepting)return;flash(i);player.push(i);if(player[player.length-1]!==seq[player.length-1]){endGame();return;}if(player.length===seq.length){accepting=false;setTimeout(nextLevel,500);}});c.addEventListener('touchstart',(e)=>{e.preventDefault();if(!accepting)return;flash(i);player.push(i);if(player[player.length-1]!==seq[player.length-1]){endGame();return;}if(player.length===seq.length){accepting=false;setTimeout(nextLevel,500);}}, {passive:false});});
    function endGame(){accepting=false;overlay.classList.remove('hidden');msgElem.innerText=`Game over! Level ${level}`;statusElem.innerText='Defeat';if(window.app&&typeof window.app.reportScore==='function')window.app.reportScore('patternmemory',level);}
    function startGame(){overlay.classList.add('hidden');seq=[];level=0;levelElem.innerText='0';statusElem.innerText='Go!';document.getElementById('pm-start').innerText='Restart';nextLevel();}
    document.getElementById('pm-start').addEventListener('click',startGame);
    restartBtn.addEventListener('click',startGame);
    return ()=>{};
}
