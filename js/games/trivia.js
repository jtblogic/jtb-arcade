// js/games/trivia.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Trivia Quiz';
    const qs = [
        {q:'Which planet is known as the Red Planet?',a:['Mars','Venus','Jupiter','Saturn'],c:0},
        {q:'What is the capital of Japan?',a:['Tokyo','Kyoto','Osaka','Seoul'],c:0},
        {q:'Who painted the Mona Lisa?',a:['Leonardo da Vinci','Picasso','Van Gogh','Michelangelo'],c:0},
        {q:'What is H2O?',a:['Water','Hydrogen','Oxygen','Salt'],c:0},
        {q:'Largest ocean on Earth?',a:['Pacific','Atlantic','Indian','Arctic'],c:0},
        {q:'How many continents are there?',a:['7','5','6','8'],c:0},
        {q:'Fastest land animal?',a:['Cheetah','Lion','Horse','Tiger'],c:0},
        {q:'Which country invented pizza?',a:['Italy','France','Spain','Greece'],c:0},
        {q:'Smallest prime number?',a:['2','1','3','0'],c:0},
        {q:'What gas do plants absorb?',a:['CO2','Oxygen','Nitrogen','Hydrogen'],c:0},
    ];
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span><div id="tr-score" class="text-xl font-black text-indigo-400">0</div></div>
                <div id="tr-timer" class="text-xs font-bold text-slate-300">30s</div>
                <div id="tr-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="tr-start" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div id="tr-q" class="text-lg font-bold text-slate-100 mb-4">?</div>
                <div id="tr-opts" class="grid grid-cols-2 gap-3"></div>
            </div>
            <div id="tr-overlay" class="hidden"><p id="tr-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="tr-restart" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const scoreElem=document.getElementById('tr-score'), timerElem=document.getElementById('tr-timer');
    const statusElem=document.getElementById('tr-status'), qElem=document.getElementById('tr-q');
    const optsElem=document.getElementById('tr-opts'), overlay=document.getElementById('tr-overlay');
    const msgElem=document.getElementById('tr-msg'), restartBtn=document.getElementById('tr-restart');
    let score=0, timeLeft=30, running=false, timerInterval=null, current=null, used=new Set();
    function genQ(){ if(used.size>=qs.length) used.clear(); let i; do{i=Math.floor(Math.random()*qs.length);}while(used.has(i)); used.add(i); current=qs[i]; qElem.innerText=current.q; optsElem.innerHTML=''; current.a.forEach((v,idx)=>{const b=document.createElement('button');b.className='bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-3 rounded-xl transition touch-manipulation';b.innerText=v;b.addEventListener('click',()=>answer(idx));b.addEventListener('touchstart',(e)=>{e.preventDefault();answer(idx);},{passive:false});optsElem.appendChild(b);});}
    function answer(idx){ if(!running)return; if(idx===current.c){score++;scoreElem.innerText=score;statusElem.innerText='Correct!';}else statusElem.innerText='Wrong!'; genQ(); }
    function endGame(){ running=false; if(timerInterval){clearInterval(timerInterval);timerInterval=null;} overlay.classList.remove('hidden'); msgElem.innerText=`Time's up! Score: ${score}`; statusElem.innerText='Finished'; if(window.app&&typeof window.app.reportScore==='function')window.app.reportScore('trivia',score); }
    function startGame(){ overlay.classList.add('hidden'); score=0;timeLeft=30;running=true;used.clear(); scoreElem.innerText='0';timerElem.innerText='30s';statusElem.innerText='Go!';document.getElementById('tr-start').innerText='Restart'; genQ(); if(timerInterval)clearInterval(timerInterval); timerInterval=setInterval(()=>{if(!running)return;timeLeft--;timerElem.innerText=timeLeft+'s';if(timeLeft<=0)endGame();},1000);}
    document.getElementById('tr-start').addEventListener('click',startGame);
    restartBtn.addEventListener('click',startGame);
    return ()=>{if(timerInterval)clearInterval(timerInterval);};
}
