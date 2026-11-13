// js/games/tictactoe.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Tic-Tac-Toe Clash';

    container.innerHTML = `
        <div class="text-center space-y-6 max-w-sm w-full">
            <div id="ttt-status" class="text-base font-bold text-slate-300">Player X's Turn</div>
            <div class="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-inner">
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="0"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="1"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="2"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="3"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="4"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="5"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="6"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="7"></button>
                <button class="ttt-cell h-20 bg-slate-900 hover:bg-slate-800 text-3xl font-black rounded-2xl text-indigo-400 transition cursor-pointer" data-index="8"></button>
            </div>
            <button id="ttt-reset-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl transition cursor-pointer w-full shadow-lg shadow-indigo-600/20">Restart Game</button>
        </div>
    `;

    let board = ['', '', '', '', '', '', '', '', ''];
    let turn = 'X';
    let active = true;

    const cells = container.querySelectorAll('.ttt-cell');
    const statusElem = document.getElementById('ttt-status');

    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            if (!active || board[idx] !== '') return;
            board[idx] = turn;
            cell.innerText = turn;

            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            let won = false;
            for (let condition of wins) {
                let [a, b, c] = condition;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    won = true;
                    break;
                }
            }

            if (won) {
                statusElem.innerText = `Player ${turn} Wins! 🎉`;
                if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('tictactoe', 10);
                active = false;
                return;
            }

            if (!board.includes('')) {
                statusElem.innerText = `It's a Draw! 🤝`;
                active = false;
                return;
            }

            turn = turn === 'X' ? 'O' : 'X';
            statusElem.innerText = `Player ${turn}'s Turn`;
        });
    });

    document.getElementById('ttt-reset-btn').addEventListener('click', () => {
        board = ['', '', '', '', '', '', '', '', ''];
        turn = 'X';
        active = true;
        statusElem.innerText = "Player X's Turn";
        cells.forEach(c => c.innerText = '');
    });

    // Cleanup function when switching views
    return () => {
        board = null;
    };
}