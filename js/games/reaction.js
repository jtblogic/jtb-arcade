// js/games/reaction.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Reaction Time';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Best (ms)</span><div id="rt-best" class="text-xl font-black text-teal-400">-</div></div>
                <div id="rt-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="rt-start" class="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <button id="rt-box" class="w-full h-48 rounded-2xl bg-rose-600 text-white text-xl font-black touch-manipulation transition">Wait for green...</button>
            <div id="rt-overlay" class="hidden"><p id="rt-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="rt-restart" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const box = document.getElementById('rt-box'), statusElem = document.getElementById('rt-status');
    const bestElem = document.getElementById('rt-best'), overlay = document.getElementById('rt-overlay');
    const msgElem = document.getElementById('rt-msg'), restartBtn = document.getElementById('rt-restart');
    let best = null; try { best = parseInt(localStorage.getItem('rt_best')); if(isNaN(best)) best=null; } catch(e){}
    if (best !== null) bestElem.innerText = best;
    let state='idle', startTime=0, timer=null, attempts=0, total=0;
    function reset(){ box.style.background='#dc2626'; box.innerText='Wait for green...'; state='waiting'; const delay=1000+Math.random()*3000; timer=setTimeout(()=>{ state='ready'; box.style.background='#16a34a'; box.innerText='CLICK NOW!'; startTime=performance.now(); },delay); }
    function clickBox(){ if(state==='waiting'){ clearTimeout(timer); state='idle'; box.style.background='#dc2626'; box.innerText='Too early!'; statusElem.innerText='Too early'; setTimeout(()=>{ box.innerText='Press Start'; },800); return; } if(state==='ready'){ const rt=Math.round(performance.now()-startTime); state='idle'; box.style.background='#0f172a'; box.innerText=`${rt} ms`; statusElem.innerText=`${rt} ms`; attempts++; total+=rt; if(best===null||rt<best){best=rt;bestElem.innerText=best;try{localStorage.setItem('rt_best',best);}catch(e){}} if(attempts>=5) endGame(); else setTimeout(reset,800); } }
    function endGame(){ overlay.classList.remove('hidden'); const avg=Math.round(total/attempts); msgElem.innerText=`5 attempts. Avg: ${avg} ms. Best: ${best} ms`; if(window.app&&typeof window.app.reportScore==='function')window.app.reportScore('reaction', Math.max(1,1000-avg)); }
    function startGame(){ overlay.classList.add('hidden'); attempts=0;total=0;statusElem.innerText='Go!';document.getElementById('rt-start').innerText='Restart'; reset(); }
    box.addEventListener('click',clickBox);
    box.addEventListener('touchstart',(e)=>{e.preventDefault();clickBox();},{passive:false});
    document.getElementById('rt-start').addEventListener('click',startGame);
    restartBtn.addEventListener('click',startGame);
    return ()=>{ if(timer)clearTimeout(timer); };
}
