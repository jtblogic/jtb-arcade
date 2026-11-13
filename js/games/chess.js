// js/games/chess.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Chess (2P)';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div id="ch-status" class="text-xs font-bold text-slate-300">White to move</div>
                <button id="ch-start" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">New Game</button>
            </div>
            <div id="ch-board" class="grid grid-cols-8 gap-0 mx-auto w-[320px] border border-slate-700"></div>
            <div id="ch-overlay" class="hidden">
                <p id="ch-msg" class="text-sm font-bold text-slate-200 mb-2"></p>
                <button id="ch-restart" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-xl">Play Again</button>
            </div>
            <p class="text-[10px] text-slate-500">Tap a piece, then tap a square to move.</p>
        </div>
    `;

    const boardEl = document.getElementById('ch-board');
    const statusElem = document.getElementById('ch-status');
    const overlay = document.getElementById('ch-overlay');
    const msgElem = document.getElementById('ch-msg');
    const restartBtn = document.getElementById('ch-restart');
    const startBtn = document.getElementById('ch-start');

    const PIECES = { P:'♙', R:'♖', N:'♘', B:'♗', Q:'♕', K:'♔', p:'♟', r:'♜', n:'♞', b:'♝', q:'♛', k:'♚' };
    let board = [], turn = 'w', selected = null, legalMoves = [], gameOver = false;

    function initBoard() {
        board = [
            ['r','n','b','q','k','b','n','r'],
            ['p','p','p','p','p','p','p','p'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['P','P','P','P','P','P','P','P'],
            ['R','N','B','Q','K','B','N','R']
        ];
        turn = 'w'; selected = null; legalMoves = []; gameOver = false;
        overlay.classList.add('hidden');
        statusElem.innerText = 'White to move';
        renderBoard();
    }

    function colorOf(p) { if (!p) return null; return p === p.toUpperCase() ? 'w' : 'b'; }
    function typeOf(p) { return p ? p.toUpperCase() : null; }

    function inBounds(r,c) { return r>=0 && r<8 && c>=0 && c<8; }

    function attacks(r,c,color) {
        // does color attack square (r,c)?
        for (let rr=0;rr<8;rr++) for (let cc=0;cc<8;cc++) {
            const p = board[rr][cc];
            if (!p || colorOf(p)!==color) continue;
            if (canMovePiece(p,rr,cc,r,c,true)) return true;
        }
        return false;
    }

    function canMovePiece(p, fr, fc, tr, tc, attackOnly) {
        const t = typeOf(p), col = colorOf(p);
        const dr = tr - fr, dc = tc - fc;
        const target = board[tr][tc];
        const targetColor = target ? colorOf(target) : null;
        if (!attackOnly && targetColor === col) return false;
        switch(t) {
            case 'P': {
                const dir = col==='w' ? -1 : 1;
                const startRow = col==='w' ? 6 : 1;
                if (dc === 0 && !target) {
                    if (dr === dir) return true;
                    if (fr === startRow && dr === 2*dir && !board[fr+dir][fc]) return true;
                }
                if (Math.abs(dc)===1 && dr===dir && target && targetColor!==col) return true;
                if (attackOnly && Math.abs(dc)===1 && dr===dir) return true;
                return false;
            }
            case 'R': return (dr===0||dc===0) && clearPath(fr,fc,tr,tc);
            case 'B': return (Math.abs(dr)===Math.abs(dc)) && clearPath(fr,fc,tr,tc);
            case 'Q': return (dr===0||dc===0||Math.abs(dr)===Math.abs(dc)) && clearPath(fr,fc,tr,tc);
            case 'N': return (Math.abs(dr)===2 && Math.abs(dc)===1) || (Math.abs(dr)===1 && Math.abs(dc)===2);
            case 'K': return Math.abs(dr)<=1 && Math.abs(dc)<=1;
        }
        return false;
    }

    function clearPath(fr,fc,tr,tc) {
        const dr = Math.sign(tr-fr), dc = Math.sign(tc-fc);
        let r=fr+dr, c=fc+dc;
        while (r!==tr || c!==tc) {
            if (board[r][c]) return false;
            r+=dr; c+=dc;
        }
        return true;
    }

    function findKing(color) {
        const k = color==='w' ? 'K' : 'k';
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) if (board[r][c]===k) return [r,c];
        return null;
    }

    function inCheck(color) {
        const king = findKing(color);
        if (!king) return false;
        const opp = color==='w'?'b':'w';
        return attacks(king[0], king[1], opp);
    }

    function legalMovesFor(fr, fc) {
        const p = board[fr][fc];
        if (!p) return [];
        const col = colorOf(p);
        const moves = [];
        for (let tr=0;tr<8;tr++) for (let tc=0;tc<8;tc++) {
            if (!canMovePiece(p,fr,fc,tr,tc,false)) continue;
            // simulate
            const saved = board[tr][tc];
            board[tr][tc] = p; board[fr][fc] = '';
            const ok = !inCheck(col);
            board[fr][fc] = p; board[tr][tc] = saved;
            if (ok) moves.push([tr,tc]);
        }
        return moves;
    }

    function hasAnyLegal(color) {
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
            if (board[r][c] && colorOf(board[r][c])===color) {
                if (legalMovesFor(r,c).length > 0) return true;
            }
        }
        return false;
    }

    function renderBoard() {
        boardEl.innerHTML = '';
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
            const sq = document.createElement('button');
            const isLight = (r+c)%2===0;
            sq.className = 'ch-sq h-10 flex items-center justify-center text-2xl touch-manipulation ' + (isLight ? 'bg-amber-100' : 'bg-amber-700');
            const p = board[r][c];
            sq.innerText = p ? PIECES[p] : '';
            // highlight selected
            if (selected && selected[0]===r && selected[1]===c) sq.classList.add('ring-2','ring-indigo-500');
            if (legalMoves.some(m=>m[0]===r&&m[1]===c)) sq.classList.add('bg-indigo-300/60');
            sq.addEventListener('click', () => onTap(r,c));
            sq.addEventListener('touchstart', (e)=>{ e.preventDefault(); onTap(r,c); }, {passive:false});
            boardEl.appendChild(sq);
        }
    }

    function onTap(r,c) {
        if (gameOver) return;
        if (selected) {
            if (legalMoves.some(m=>m[0]===r&&m[1]===c)) {
                // move
                const p = board[selected[0]][selected[1]];
                // promotion
                if (typeOf(p)==='P' && (r===0||r===7)) {
                    board[r][c] = colorOf(p)==='w' ? 'Q' : 'q';
                } else {
                    board[r][c] = p;
                }
                board[selected[0]][selected[1]] = '';
                // check game over
                const opp = turn==='w'?'b':'w';
                turn = opp;
                if (inCheck(turn)) {
                    if (!hasAnyLegal(turn)) {
                        gameOver = true;
                        const winner = turn==='w' ? 'Black' : 'White';
                        overlay.classList.remove('hidden');
                        msgElem.innerText = `Checkmate! ${winner} wins.`;
                        statusElem.innerText = 'Game Over';
                        return;
                    }
                    statusElem.innerText = (turn==='w'?'White':'Black') + ' in check';
                } else {
                    if (!hasAnyLegal(turn)) {
                        gameOver = true;
                        overlay.classList.remove('hidden');
                        msgElem.innerText = 'Stalemate! Draw.';
                        statusElem.innerText = 'Draw';
                        return;
                    }
                    statusElem.innerText = (turn==='w'?'White':'Black') + ' to move';
                }
                selected = null; legalMoves = [];
                renderBoard();
                return;
            }
            // reselect own piece
            const p = board[r][c];
            if (p && colorOf(p)===turn) {
                selected = [r,c];
                legalMoves = legalMovesFor(r,c);
                renderBoard();
                return;
            }
            selected = null; legalMoves = [];
            renderBoard();
            return;
        }
        const p = board[r][c];
        if (p && colorOf(p)===turn) {
            selected = [r,c];
            legalMoves = legalMovesFor(r,c);
            renderBoard();
        }
    }

    function startGame() { initBoard(); }
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    initBoard();

    return () => {};
}
