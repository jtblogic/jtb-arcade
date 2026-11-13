// js/games/oddoneout.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Odd One Out';
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span><div id="oo-score" class="text-xl font-black text-teal-400">0</div></div>
                <div id="oo-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="oo-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="oo-start" class="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div id="oo-grid" class="grid grid-cols-4 gap-2 mx-auto w-[280px]"></div>
            <div id="oo-overlay" class="hidden"><p id="oo-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="oo-restart" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const scoreElem=document.getElementById('oo-score'), timerElem=document.getElementById('oo-timer');
    const statusElem=document.getElementById('oo-status'), grid=document.getElementById('oo-grid');
    const overlay=document.getElementById('oo-overlay'), msgElem=document.getElementById('oo-msg');
    const restartBtn=document.getElementById('oo-restart');
    const emojis = ['??','??','??','??','??','??','??','??','??','??','??','??'];
    let score=0, timeLeft=30, running=false, timerInterval=null;
    function genRound(){
        grid.innerHTML='';
        const base = emojis[Math.floor(Math.random()*emojis.length)];
        let odd = base;
        while (odd === base) odd = emojis[Math.floor(Math.random()*emojis.length)];
        const oddIdx = Math.floor(Math.random()*16);
        for (let i=0;i<16;i++){
            const b=document.createElement('button');
            b.className='h-14 rounded-xl bg-slate-900 border border-slate-800 text-2xl touch-manipulation';
            b.innerText = i===oddIdx ? odd : base;
            b.addEventListener('click',()=>pick(i===oddIdx));
            b.addEventListener('touchstart',(e)=>{e.preventDefault();pick(i===oddIdx);},{passive:false});
            grid.appendChild(b);
        }
    }
    function pick(correct){ if(!running)return; if(correct){score++;scoreElem.innerText=score;statusElem.innerText='Correct!';genRound();} else { statusElem.innerText='Wrong!'; } }
    function endGame(){ running=false; if(timerInterval){clearInterval(timerInterval);timerInterval=null;} overlay.classList.remove('hidden'); msgElem.innerText=`Time's up! Score: ${score}`; statusElem.innerText='Finished'; if(window.app&&typeof window.app.reportScore==='function')window.app.reportScore('oddoneout',score); }
    function startGame(){ overlay.classList.add('hidden'); score=0;timeLeft=30;running=true; scoreElem.innerText='0';timerElem.innerText='30s';statusElem.innerText='Go!';document.getElementById('oo-start').innerText='Restart'; genRound(); if(timerInterval)clearInterval(timerInterval); timerInterval=setInterval(()=>{if(!running)return;timeLeft--;timerElem.innerText=timeLeft+'s';if(timeLeft<=0)endGame();},1000);}
    document.getElementById('oo-start').addEventListener('click',startGame);
    restartBtn.addEventListener('click',startGame);
    return ()=>{if(timerInterval)clearInterval(timerInterval);};
}
