// js/games/twenty48.js

export function render(container) {
    document.getElementById('active-game-title').innerText = '2048 Tiles';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
                    <div id="t48-score" class="text-xl font-black text-yellow-400">0</div>
                </div>
                <div id="t48-status" class="text-xs font-bold text-slate-300">Slide to merge</div>
                <button id="t48-start-btn" class="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">New Game</button>
            </div>
            <div id="t48-grid" class="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 mx-auto w-[280px]"></div>
            <div id="t48-overlay" class="hidden text-center">
                <p id="t48-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="t48-restart-btn" class="bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
            <p class="text-[10px] text-slate-500">Use arrow keys or swipe</p>
        </div>
    `;

    const gridEl = document.getElementById('t48-grid');
    const scoreElem = document.getElementById('t48-score');
    const statusElem = document.getElementById('t48-status');
    const startBtn = document.getElementById('t48-start-btn');
    const overlay = document.getElementById('t48-overlay');
    const msgElem = document.getElementById('t48-msg');
    const restartBtn = document.getElementById('t48-restart-btn');

    let grid = [];
    let score = 0;
    let gameOver = false;
    let won = false;

    const COLORS = {
        0: 'bg-slate-900 text-transparent',
        2: 'bg-slate-800 text-slate-100',
        4: 'bg-slate-700 text-slate-100',
        8: 'bg-orange-600 text-white',
        16: 'bg-orange-500 text-white',
        32: 'bg-rose-500 text-white',
        64: 'bg-rose-600 text-white',
        128: 'bg-yellow-500 text-white',
        256: 'bg-yellow-400 text-slate-900',
        512: 'bg-amber-400 text-slate-900',
        1024: 'bg-amber-300 text-slate-900',
        2048: 'bg-emerald-400 text-slate-900'
    };

    function initGame() {
        grid = Array.from({ length: 4 }, () => Array(4).fill(0));
        score = 0;
        gameOver = false;
        won = false;
        overlay.classList.add('hidden');
        scoreElem.innerText = '0';
        statusElem.innerText = 'Slide to merge';
        addTile(); addTile();
        renderGrid();
    }

    function addTile() {
        const empty = [];
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (grid[r][c] === 0) empty.push({ r, c });
        if (empty.length === 0) return;
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function renderGrid() {
        gridEl.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const v = grid[r][c];
                const tile = document.createElement('div');
                tile.className = `h-16 rounded-xl flex items-center justify-center text-xl font-black transition ${COLORS[v] || 'bg-emerald-300 text-slate-900'}`;
                tile.innerText = v === 0 ? '' : v;
                gridEl.appendChild(tile);
            }
        }
    }

    function slideRow(row) {
        // remove zeros
        let arr = row.filter(x => x !== 0);
        // merge
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        while (arr.length < 4) arr.push(0);
        return arr;
    }

    function move(dir) {
        if (gameOver) return;
        let moved = false;
        const before = JSON.stringify(grid);

        if (dir === 'left') {
            for (let r = 0; r < 4; r++) { const nr = slideRow(grid[r]); if (JSON.stringify(nr) !== JSON.stringify(grid[r])) moved = true; grid[r] = nr; }
        } else if (dir === 'right') {
            for (let r = 0; r < 4; r++) { const nr = slideRow(grid[r].slice().reverse()).reverse(); if (JSON.stringify(nr) !== JSON.stringify(grid[r])) moved = true; grid[r] = nr; }
        } else if (dir === 'up') {
            for (let c = 0; c < 4; c++) {
                const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
                const nc = slideRow(col);
                if (JSON.stringify(nc) !== JSON.stringify(col)) moved = true;
                for (let r = 0; r < 4; r++) grid[r][c] = nc[r];
            }
        } else if (dir === 'down') {
            for (let c = 0; c < 4; c++) {
                const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
                const nc = slideRow(col.slice().reverse()).reverse();
                if (JSON.stringify(nc) !== JSON.stringify(col)) moved = true;
                for (let r = 0; r < 4; r++) grid[r][c] = nc[r];
            }
        }

        if (!moved) return;
        scoreElem.innerText = score;
        addTile();
        renderGrid();

        // check win
        if (!won && grid.flat().includes(2048)) {
            won = true; statusElem.innerText = 'You reached 2048! 🎉';
        }
        // check game over
        if (isGameOver()) {
            gameOver = true;
            msgElem.innerText = `Game Over! Final Score: ${score}`;
            overlay.classList.remove('hidden');
            statusElem.innerText = 'Game Over';
            if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('twenty48', score);
        }
    }

    function isGameOver() {
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
            if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
        return true;
    }

    const onKey = (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
    };
    window.addEventListener('keydown', onKey);

    // swipe support
    let touchStart = null;
    const onTouchStart = (e) => { if (e.touches[0]) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchEnd = (e) => {
        if (!touchStart || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStart.x;
        const dy = e.changedTouches[0].clientY - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) move('right'); else if (dx < -30) move('left');
        } else {
            if (dy > 30) move('down'); else if (dy < -30) move('up');
        }
        touchStart = null;
    };
    gridEl.addEventListener('touchstart', onTouchStart, { passive: true });
    gridEl.addEventListener('touchend', onTouchEnd);

    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    initGame();

    return () => {
        window.removeEventListener('keydown', onKey);
        gridEl.removeEventListener('touchstart', onTouchStart);
        gridEl.removeEventListener('touchend', onTouchEnd);
    };
}
