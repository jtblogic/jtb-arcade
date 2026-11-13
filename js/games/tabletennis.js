// js/games/tabletennis.js

import { OnlineRoom, showRoomCode, promptJoinCode } from '../online.js';

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Table Tennis';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">P1</span><div id="tt-p1" class="text-xl font-black text-rose-400">0</div></div>
                <div id="tt-status" class="text-xs font-bold text-slate-300">Choose mode</div>
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">P2</span><div id="tt-p2" class="text-xl font-black text-blue-400">0</div></div>
            </div>
            <div class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mx-auto w-[300px] h-[300px]">
                <canvas id="tt-canvas" width="300" height="300" class="block touch-none"></canvas>
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
                <button id="tt-ai" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition">vs AI</button>
                <button id="tt-local" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition">2P Local</button>
                <button id="tt-host" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">Host Online</button>
                <button id="tt-join" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">Join Online</button>
            </div>
            <p id="tt-hint" class="text-[10px] text-slate-500">P1: W/S or touch left. P2: Arrow keys or touch right. Online: host creates room.</p>
        </div>
    `;

    const canvas = document.getElementById('tt-canvas');
    const ctx = canvas.getContext('2d');
    const p1Elem = document.getElementById('tt-p1');
    const p2Elem = document.getElementById('tt-p2');
    const statusElem = document.getElementById('tt-status');
    const W = 300, H = 300, PH = 60, PW = 8, BR = 6, WIN = 7;
    let p1y = H / 2 - PH / 2;
    let p2y = H / 2 - PH / 2;
    let ball = { x: W / 2, y: H / 2, vx: 4, vy: 3 };
    let s1 = 0, s2 = 0, running = false, raf = null;
    const keys = {};
    let mode = 'none'; // 'ai','local','online-host','online-guest'
    let aiTimer = null;
    let room = null;
    let isHost = false;

    function resetBall(dir) { ball.x = W / 2; ball.y = H / 2; ball.vx = 4 * (dir > 0 ? 1 : -1); ball.vy = (Math.random() * 4 - 2); }

    function draw() {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#1e293b'; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#f43f5e'; ctx.fillRect(4, p1y, PW, PH);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(W - PW - 4, p2y, PW, PH);
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2); ctx.fill();
    }

    function update() {
        if (mode === 'ai') {
            // P2 (right) tracks ball
            const target = ball.y - PH / 2;
            if (p2y < target - 2) p2y = Math.min(H - PH, p2y + 4.5);
            else if (p2y > target + 2) p2y = Math.max(0, p2y - 4.5);
        }
        if (mode === 'local') {
            if (keys['w'] || keys['W']) p1y = Math.max(0, p1y - 6);
            if (keys['s'] || keys['S']) p1y = Math.min(H - PH, p1y + 6);
            if (keys['ArrowUp']) p2y = Math.max(0, p2y - 6);
            if (keys['ArrowDown']) p2y = Math.min(H - PH, p2y + 6);
        }
        // online guest: only move own paddle (P2) locally, host handles ball
        if (mode === 'online-guest') {
            if (keys['ArrowUp']) p2y = Math.max(0, p2y - 6);
            if (keys['ArrowDown']) p2y = Math.min(H - PH, p2y + 6);
            // send paddle pos
            if (room) room.send({ type: 'paddle', y: p2y });
        }
        if (mode === 'online-host') {
            if (keys['w'] || keys['W']) p1y = Math.max(0, p1y - 6);
            if (keys['s'] || keys['S']) p1y = Math.min(H - PH, p1y + 6);
            // send state
        }

        // physics only on host/local/ai
        if (mode !== 'online-guest') {
            ball.x += ball.vx; ball.y += ball.vy;
            if (ball.y - BR < 0) { ball.y = BR; ball.vy = -ball.vy; }
            if (ball.y + BR > H) { ball.y = H - BR; ball.vy = -ball.vy; }
            if (ball.x - BR < 4 + PW && ball.y > p1y && ball.y < p1y + PH && ball.vx < 0) {
                ball.vx = -ball.vx * 1.05; const hit = (ball.y - (p1y + PH / 2)) / (PH / 2); ball.vy = hit * 5;
            }
            if (ball.x + BR > W - PW - 4 && ball.y > p2y && ball.y < p2y + PH && ball.vx > 0) {
                ball.vx = -ball.vx * 1.05; const hit = (ball.y - (p2y + PH / 2)) / (PH / 2); ball.vy = hit * 5;
            }
            if (ball.x < 0) {
                s2++; p2Elem.innerText = s2;
                if (s2 >= WIN) { endGame(false); return; }
                resetBall(-1);
            }
            if (ball.x > W) {
                s1++; p1Elem.innerText = s1;
                if (s1 >= WIN) { endGame(true); return; }
                resetBall(1);
            }
        }

        // online host broadcast
        if (mode === 'online-host' && room) {
            room.send({ type: 'state', ball: { x: ball.x, y: ball.y }, p1y, p2y, s1, s2 });
        }
    }

    function endGame(p1won) {
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        statusElem.innerText = p1won ? 'Player 1 Wins!' : 'Player 2 Wins!';
        if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('tabletennis', p1won ? s1 : s2);
    }

    function loop() { if (!running) return; update(); draw(); raf = requestAnimationFrame(loop); }

    function startGame(m) {
        mode = m;
        s1 = 0; s2 = 0; p1Elem.innerText = '0'; p2Elem.innerText = '0';
        p1y = H / 2 - PH / 2; p2y = H / 2 - PH / 2;
        resetBall(Math.random() > 0.5 ? 1 : -1);
        statusElem.innerText = 'Playing';
        running = true;
        loop();
    }

    // buttons
    document.getElementById('tt-ai').addEventListener('click', () => { startGame('ai'); });
    document.getElementById('tt-local').addEventListener('click', () => { startGame('local'); });
    document.getElementById('tt-host').addEventListener('click', async () => {
        try {
            room = new OnlineRoom();
            const code = await room.create();
            isHost = true;
            const overlay = showRoomCode(code);
            room.onConnect = () => { overlay.remove(); statusElem.innerText = 'Opponent connected!'; startGame('online-host'); };
            room.onMessage = (d) => {
                if (d.type === 'paddle') p2y = d.y;
            };
            room.onDisconnect = () => { statusElem.innerText = 'Opponent left'; running = false; };
        } catch (e) { statusElem.innerText = 'Online unavailable, playing vs AI'; startGame('ai'); }
    });
    document.getElementById('tt-join').addEventListener('click', async () => {
        const code = promptJoinCode();
        if (!code) return;
        try {
            room = new OnlineRoom();
            await room.join(code);
            isHost = false;
            room.onMessage = (d) => {
                if (d.type === 'state') {
                    ball.x = d.ball.x; ball.y = d.ball.y; p1y = d.p1y; p2y = d.p2y; s1 = d.s1; s2 = d.s2;
                    p1Elem.innerText = s1; p2Elem.innerText = s2;
                }
                if (d.type === 'end') { running = false; statusElem.innerText = d.msg; }
            };
            room.onDisconnect = () => { statusElem.innerText = 'Host left'; running = false; };
            statusElem.innerText = 'Connected! Playing...';
            startGame('online-guest');
        } catch (e) { statusElem.innerText = 'Join failed, playing vs AI'; startGame('ai'); }
    });

    const onKey = (e) => { keys[e.key] = (e.type === 'keydown'); if (['ArrowUp','ArrowDown','w','s','W','S'].includes(e.key)) e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    // touch controls
    function handleTouch(e) {
        const r = canvas.getBoundingClientRect();
        Array.from(e.touches).forEach(t => {
            const x = (t.clientX - r.left) * (W / r.width);
            const y = (t.clientY - r.top) * (H / r.height);
            if (x < W / 2) p1y = Math.max(0, Math.min(H - PH, y - PH / 2));
            else p2y = Math.max(0, Math.min(H - PH, y - PH / 2));
        });
        e.preventDefault();
    }
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    draw();

    return () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        if (room) room.close();
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKey);
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', handleTouch);
    };
}
