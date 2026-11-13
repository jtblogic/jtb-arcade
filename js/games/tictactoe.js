// js/games/tictactoe.js

import { OnlineRoom, showRoomCode, promptJoinCode } from '../online.js';

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Tic-Tac-Toe';

    container.innerHTML = `
        <div class="text-center space-y-6 max-w-sm w-full">
            <div id="ttt-status" class="text-base font-bold text-slate-300">Choose mode</div>
            <div class="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-inner">
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="0"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="1"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="2"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="3"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="4"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="5"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="6"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="7"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer touch-manipulation" data-index="8"></button>
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
                <button id="ttt-ai" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition">vs AI</button>
                <button id="ttt-local" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition">2P Local</button>
                <button id="ttt-host" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">Host Online</button>
                <button id="ttt-join" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">Join Online</button>
            </div>
            <button id="ttt-reset-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl transition cursor-pointer w-full shadow-lg shadow-indigo-600/20">Restart Game</button>
        </div>
    `;

    let board = ['', '', '', '', '', '', '', '', ''];
    let turn = 'X';
    let active = true;
    let mode = 'none';
    let room = null;
    const cells = container.querySelectorAll('.ttt-cell');
    const statusElem = document.getElementById('ttt-status');

    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function checkWin(b, mark) {
        for (const [a,bb,c] of wins) if (b[a]===mark && b[bb]===mark && b[c]===mark) return true;
        return false;
    }

    function aiMove() {
        if (!active || mode !== 'ai' || turn !== 'O') return;
        // simple: try win, block, else random
        let move = -1;
        for (let i=0;i<9;i++) if (!board[i]) {
            board[i]='O'; if (checkWin(board,'O')) { move=i; board[i]=''; break; } board[i]='';
        }
        if (move<0) for (let i=0;i<9;i++) if (!board[i]) {
            board[i]='X'; if (checkWin(board,'X')) { move=i; board[i]=''; break; } board[i]='';
        }
        if (move<0) {
            const empty = board.map((v,i)=>v===''?i:-1).filter(i=>i>=0);
            move = empty[Math.floor(Math.random()*empty.length)];
        }
        if (move>=0) makeMove(move, 'O');
    }

    function makeMove(idx, mark) {
        if (!active || board[idx] !== '') return;
        board[idx] = mark;
        cells[idx].innerText = mark;
        let won = checkWin(board, mark);
        if (won) {
            statusElem.innerText = `Player ${mark} Wins!`;
            active = false;
            if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('tictactoe', mark==='X'?10:0);
            return;
        }
        if (!board.includes('')) {
            statusElem.innerText = `It's a Draw!`;
            active = false;
            return;
        }
        turn = mark === 'X' ? 'O' : 'X';
        statusElem.innerText = `Player ${turn}'s Turn`;
        // online host/guest handling
        if (mode === 'online-host' && room) room.send({ type:'move', idx, mark, turn, board: [...board], active });
        if (mode === 'online-guest' && room) room.send({ type:'move', idx, mark, turn, board: [...board], active });
        // AI response
        if (mode === 'ai' && turn === 'O') setTimeout(aiMove, 300);
    }

    function handleCellClick(idx) {
        if (!active) return;
        if (mode === 'online-guest' && turn !== 'O') return; // guest is O? Actually guest can be O
        // determine if this player can move
        if (mode === 'online-host' && turn !== 'X') return;
        if (mode === 'online-guest' && turn !== 'O') return;
        if (mode === 'online-host' || mode === 'online-guest' || mode === 'local' || mode === 'ai') {
            const mark = (mode === 'online-guest') ? 'O' : (mode === 'online-host' ? 'X' : turn);
            if (mode === 'local' || mode === 'ai') {
                if (board[idx] !== '') return;
                makeMove(idx, turn);
            } else {
                if (board[idx] !== '') return;
                makeMove(idx, mark);
            }
        }
    }

    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => handleCellClick(idx));
        cell.addEventListener('touchstart', (e) => { e.preventDefault(); handleCellClick(idx); }, { passive: false });
    });

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        turn = 'X';
        active = true;
        statusElem.innerText = "Choose mode or press Restart";
        cells.forEach(c => c.innerText = '');
    }

    document.getElementById('ttt-reset-btn').addEventListener('click', () => { resetBoard(); statusElem.innerText = "Player X's Turn"; active = true; });

    document.getElementById('ttt-ai').addEventListener('click', () => { resetBoard(); mode = 'ai'; statusElem.innerText = "vs AI - Player X's Turn"; });
    document.getElementById('ttt-local').addEventListener('click', () => { resetBoard(); mode = 'local'; statusElem.innerText = "2P Local - Player X's Turn"; });

    document.getElementById('ttt-host').addEventListener('click', async () => {
        try {
            room = new OnlineRoom();
            const code = await room.create();
            const overlay = showRoomCode(code);
            room.onConnect = () => { overlay.remove(); resetBoard(); mode = 'online-host'; statusElem.innerText = 'Online - You are X'; };
            room.onMessage = (d) => {
                if (d.type === 'move') {
                    board = d.board; turn = d.turn; active = d.active;
                    cells.forEach((c, i) => c.innerText = board[i]);
                    statusElem.innerText = active ? `Player ${turn}'s Turn` : statusElem.innerText;
                }
            };
            room.onDisconnect = () => { statusElem.innerText = 'Opponent left'; active = false; };
        } catch (e) { statusElem.innerText = 'Online unavailable'; }
    });

    document.getElementById('ttt-join').addEventListener('click', async () => {
        const code = promptJoinCode();
        if (!code) return;
        try {
            room = new OnlineRoom();
            await room.join(code);
            room.onMessage = (d) => {
                if (d.type === 'move') {
                    board = d.board; turn = d.turn; active = d.active;
                    cells.forEach((c, i) => c.innerText = board[i]);
                    statusElem.innerText = active ? `Player ${turn}'s Turn` : statusElem.innerText;
                }
            };
            room.onDisconnect = () => { statusElem.innerText = 'Host left'; active = false; };
            resetBoard(); mode = 'online-guest'; statusElem.innerText = 'Online - You are O';
        } catch (e) { statusElem.innerText = 'Join failed'; }
    });

    return () => { if (room) room.close(); };
}
