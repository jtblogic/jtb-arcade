// js/games/snakesladders.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Snakes & Ladders (2-4P)';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 flex-wrap gap-2">
                <div id="sl-players" class="flex gap-2 flex-wrap"></div>
                <div id="sl-status" class="text-xs font-bold text-slate-300">Roll dice</div>
                <button id="sl-roll" class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Roll</button>
            </div>
            <div class="flex gap-2 justify-center">
                <button data-n="2" class="sl-nplayers bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">2 Players</button>
                <button data-n="3" class="sl-nplayers bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">3 Players</button>
                <button data-n="4" class="sl-nplayers bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">4 Players</button>
            </div>
            <div id="sl-board" class="grid grid-cols-10 gap-0.5 mx-auto w-[300px]"></div>
            <div id="sl-dice" class="text-2xl font-black text-slate-200">-</div>
            <div id="sl-overlay" class="hidden">
                <p id="sl-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="sl-restart" class="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
        </div>
    `;

    const board = document.getElementById('sl-board');
    const statusElem = document.getElementById('sl-status');
    const diceElem = document.getElementById('sl-dice');
    const rollBtn = document.getElementById('sl-roll');
    const overlay = document.getElementById('sl-overlay');
    const msgElem = document.getElementById('sl-msg');
    const restartBtn = document.getElementById('sl-restart');
    const playersDiv = document.getElementById('sl-players');

    const colors = ['#f43f5e','#3b82f6','#22c55e','#f59e0b'];
    const tokens = ['R','B','G','Y'];
    const jumps = {16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78, 2:38,7:14,8:31,15:26,21:42,28:84,36:44,51:67,71:91,78:98,80:100};

    const cells = [];
    for (let i = 100; i >= 1; i--) {
        const c = document.createElement('div');
        c.className = 'h-7 flex items-center justify-center text-[9px] font-bold border border-slate-800 bg-slate-900 text-slate-400 relative';
        c.innerText = i;
        if (jumps[i]) c.style.background = jumps[i] > i ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)';
        board.appendChild(c);
        cells.push(c);
    }

    let numPlayers = 2;
    let pos = [];
    let turn = 0;
    let running = false;

    function cellIndex(n) { return 100 - n; }

    function renderPlayers() {
        playersDiv.innerHTML = '';
        for (let i=0;i<numPlayers;i++){
            const d=document.createElement('div');
            d.className='text-xs font-bold px-2 py-1 rounded-lg';
            d.style.color=colors[i];
            d.innerText = `P${i+1}: ${pos[i]}`;
            playersDiv.appendChild(d);
        }
    }

    function renderPos() {
        cells.forEach(c => { c.querySelectorAll('.token').forEach(t => t.remove()); });
        pos.forEach((p, i) => {
            const token = document.createElement('span');
            token.className = 'token absolute text-xs font-black';
            token.innerText = tokens[i];
            token.style.left = (2 + i*8) + 'px';
            token.style.top = '0px';
            token.style.color = colors[i];
            const cell = cells[cellIndex(p)];
            cell.style.position = 'relative';
            cell.appendChild(token);
        });
        renderPlayers();
    }

    function rollDice() {
        if (!running) return;
        const d = Math.floor(Math.random() * 6) + 1;
        diceElem.innerText = d;
        let np = pos[turn] + d;
        if (np > 100) np = pos[turn];
        if (jumps[np]) np = jumps[np];
        pos[turn] = np;
        renderPos();
        if (np >= 100) { endGame(turn); return; }
        turn = (turn + 1) % numPlayers;
        statusElem.innerText = 'P' + (turn+1) + ' turn';
    }

    function endGame(w) {
        running = false;
        overlay.classList.remove('hidden');
        msgElem.innerText = 'Player ' + (w+1) + ' wins!';
        statusElem.innerText = 'Game Over';
    }

    function startGame(n) {
        if (n) numPlayers = n;
        pos = Array(numPlayers).fill(1);
        turn = 0;
        running = true;
        overlay.classList.add('hidden');
        statusElem.innerText = 'P1 turn';
        renderPos();
    }

    rollBtn.addEventListener('click', rollDice);
    restartBtn.addEventListener('click', () => startGame());
    document.querySelectorAll('.sl-nplayers').forEach(b => {
        b.addEventListener('click', () => startGame(parseInt(b.dataset.n)));
        b.addEventListener('touchstart', (e) => { e.preventDefault(); startGame(parseInt(b.dataset.n)); }, { passive: false });
    });

    startGame(2);

    return () => {};
}
