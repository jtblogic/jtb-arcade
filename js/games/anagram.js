// js/games/anagram.js
export function render(container) {
    document.getElementById('active-game-title').innerText = 'Anagram Hunt';
    const words = ['listen','silent','earth','heart','stone','notes','below','elbow','night','thing','angel','glean','lemon','melon','cinema','iceman','secure','rescue','teacher','cheater','players','parsley','stressed','desserts'];
    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span><div id="an-score" class="text-xl font-black text-purple-400">0</div></div>
                <div id="an-timer" class="text-xs font-bold text-slate-300">60s</div>
                <div id="an-status" class="text-xs font-bold text-slate-300">Press Start</div>
                <button id="an-start" class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Start</button>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div class="text-[10px] text-slate-500 uppercase mb-1">Find an anagram of</div>
                <div id="an-word" class="text-2xl font-black text-slate-100 tracking-widest mb-4">?</div>
                <div class="flex gap-2">
                    <input id="an-input" type="text" placeholder="Anagram" class="search-input" style="padding-left:1rem;">
                    <button id="an-submit" class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 rounded-xl">Go</button>
                </div>
            </div>
            <div id="an-overlay" class="hidden"><p id="an-msg" class="text-sm font-bold text-slate-200 mb-2"></p><button id="an-restart" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button></div>
        </div>
    `;
    const scoreElem=document.getElementById('an-score'), timerElem=document.getElementById('an-timer');
    const statusElem=document.getElementById('an-status'), wordElem=document.getElementById('an-word');
    const input=document.getElementById('an-input'), submitBtn=document.getElementById('an-submit');
    const overlay=document.getElementById('an-overlay'), msgElem=document.getElementById('an-msg');
    const restartBtn=document.getElementById('an-restart');
    let score=0, timeLeft=60, running=false, timerInterval=null, current='', answers=new Set();
    function newWord(){ current=words[Math.floor(Math.random()*words.length)]; wordElem.innerText=current.toUpperCase(); answers=new Set([current]); input.value=''; input.focus(); }
    function check(){ if(!running)return; const v=input.value.trim().toLowerCase(); if(!v)return; if(v===current){statusElem.innerText='Same word!';return;} if([...v].sort().join('')===[...current].sort().join('')){ if(answers.has(v)){statusElem.innerText='Already used';return;} answers.add(v); score++; scoreElem.innerText=score; statusElem.innerText='Correct!'; newWord(); } else statusElem.innerText='Not an anagram'; }
    function endGame(){ running=false; if(timerInterval){clearInterval(timerInterval);timerInterval=null;} overlay.classList.remove('hidden'); msgElem.innerText=`Time's up! Score: ${score}`; statusElem.innerText='Finished'; if(window.app&&typeof window.app.reportScore==='function')window.app.reportScore('anagram',score); }
    function startGame(){ overlay.classList.add('hidden'); score=0;timeLeft=60;running=true; scoreElem.innerText='0';timerElem.innerText='60s';statusElem.innerText='Go!';document.getElementById('an-start').innerText='Restart'; newWord(); if(timerInterval)clearInterval(timerInterval); timerInterval=setInterval(()=>{if(!running)return;timeLeft--;timerElem.innerText=timeLeft+'s';if(timeLeft<=0)endGame();},1000);}
    document.getElementById('an-start').addEventListener('click',startGame);
    submitBtn.addEventListener('click',check);
    input.addEventListener('keydown',(e)=>{if(e.key==='Enter')check();});
    restartBtn.addEventListener('click',startGame);
    return ()=>{if(timerInterval)clearInterval(timerInterval);};
}
