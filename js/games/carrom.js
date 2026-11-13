// js/games/carrom.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Carrom (2-4P)';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 flex-wrap gap-2">
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">White Team</span><div id="cr-white" class="text-xl font-black text-slate-200">0</div></div>
                <div id="cr-status" class="text-xs font-bold text-slate-300">Drag striker to flick</div>
                <div><span class="text-[10px] text-slate-400 uppercase font-semibold">Black Team</span><div id="cr-black" class="text-xl font-black text-slate-800 bg-slate-300 px-2 rounded">0</div></div>
            </div>
            <div class="flex gap-2 justify-center">
                <button data-n="2" class="cr-nplayers bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">2 Players</button>
                <button data-n="4" class="cr-nplayers bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">4 Players</button>
            </div>
            <div class="relative bg-amber-900/40 border border-amber-700 rounded-2xl overflow-hidden mx-auto w-[300px] h-[300px]">
                <canvas id="cr-canvas" width="300" height="300" class="block touch-none"></canvas>
            </div>
            <p id="cr-turn" class="text-[10px] text-slate-500">P1 turn (White)</p>
        </div>
    `;

    const canvas = document.getElementById('cr-canvas'), ctx = canvas.getContext('2d');
    const whiteElem = document.getElementById('cr-white'), blackElem = document.getElementById('cr-black');
    const statusElem = document.getElementById('cr-status'), turnElem = document.getElementById('cr-turn');
    const W = 300, H = 300, R = 8, PK = 14;
    const pockets = [{x:PK,y:PK},{x:W-PK,y:PK},{x:PK,y:H-PK},{x:W-PK,y:H-PK}];
    let pieces = [], striker = null, turn = 0, scores = [0,0], running = true, raf = null;
    let dragging = false, dragStart = null, dragCur = null, moving = false;
    let numPlayers = 2;

    function teamOf(p) { return p % 2 === 0 ? 0 : 1; } // even players -> white team, odd -> black

    function initPieces() {
        pieces = [];
        pieces.push({x:W/2,y:H/2,r:R,color:'red',pocketed:false,vx:0,vy:0});
        for (let i=0;i<6;i++){
            const ang = i*Math.PI/3, rad = 26;
            pieces.push({x:W/2+Math.cos(ang)*rad, y:H/2+Math.sin(ang)*rad, r:R, color: i%2===0?'white':'black', pocketed:false, vx:0, vy:0});
        }
        for (let i=0;i<12;i++){
            const ang = i*Math.PI/6, rad = 52;
            pieces.push({x:W/2+Math.cos(ang)*rad, y:H/2+Math.sin(ang)*rad, r:R, color: i%2===0?'black':'white', pocketed:false, vx:0, vy:0});
        }
        striker = {x:W/2, y:H-30, r:R+2, color:'striker', vx:0, vy:0, pocketed:false};
    }

    function resetStriker() { striker.x = W/2; striker.y = H-30; striker.vx=0; striker.vy=0; striker.pocketed=false; }

    function checkPocket(obj) {
        for (const pk of pockets) if (Math.hypot(obj.x-pk.x, obj.y-pk.y) < PK) return true;
        return false;
    }

    function endTurn(pocketed, foul) {
        if (foul) statusElem.innerText = 'Foul! Turn passes';
        else if (pocketed) { statusElem.innerText = 'Pocketed! Go again'; return; }
        else statusElem.innerText = 'Miss. Turn passes';
        turn = (turn + 1) % numPlayers;
        statusElem.innerText += ' - P' + (turn+1) + ' (' + (teamOf(turn)===0?'White':'Black') + ')';
        turnElem.innerText = 'P' + (turn+1) + ' turn (' + (teamOf(turn)===0?'White':'Black') + ')';
    }

    function update() {
        if (striker && !striker.pocketed) {
            striker.x += striker.vx; striker.y += striker.vy;
            striker.vx *= 0.985; striker.vy *= 0.985;
            if (Math.abs(striker.vx)<0.02) striker.vx=0;
            if (Math.abs(striker.vy)<0.02) striker.vy=0;
            if (striker.x - striker.r < 0) { striker.x = striker.r; striker.vx = -striker.vx*0.8; }
            if (striker.x + striker.r > W) { striker.x = W - striker.r; striker.vx = -striker.vx*0.8; }
            if (striker.y - striker.r < 0) { striker.y = striker.r; striker.vy = -striker.vy*0.8; }
            if (striker.y + striker.r > H) { striker.y = H - striker.r; striker.vy = -striker.vy*0.8; }
        }
        pieces.forEach(p => {
            if (p.pocketed) return;
            if (p.vx||p.vy) {
                p.x += p.vx; p.y += p.vy;
                p.vx *= 0.985; p.vy *= 0.985;
                if (Math.abs(p.vx)<0.02) p.vx=0;
                if (Math.abs(p.vy)<0.02) p.vy=0;
                if (p.x - p.r < 0) { p.x = p.r; p.vx = -p.vx*0.8; }
                if (p.x + p.r > W) { p.x = W - p.r; p.vx = -p.vx*0.8; }
                if (p.y - p.r < 0) { p.y = p.r; p.vy = -p.vy*0.8; }
                if (p.y + p.r > H) { p.y = H - p.r; p.vy = -p.vy*0.8; }
            }
        });
        if (striker && !striker.pocketed) {
            pieces.forEach(p => {
                if (p.pocketed) return;
                const dx = p.x - striker.x, dy = p.y - striker.y;
                const dist = Math.hypot(dx,dy);
                if (dist < p.r + striker.r && dist>0) {
                    const nx = dx/dist, ny = dy/dist;
                    const overlap = p.r + striker.r - dist;
                    striker.x -= nx*overlap/2; striker.y -= ny*overlap/2;
                    p.x += nx*overlap/2; p.y += ny*overlap/2;
                    const rvx = striker.vx - p.vx, rvy = striker.vy - p.vy;
                    const vel = rvx*nx + rvy*ny;
                    if (vel > 0) {
                        const imp = vel*0.9;
                        striker.vx -= imp*nx; striker.vy -= imp*ny;
                        p.vx += imp*nx*0.9; p.vy += imp*ny*0.9;
                    }
                }
            });
        }
        for (let i=0;i<pieces.length;i++){
            for (let j=i+1;j<pieces.length;j++){
                const a=pieces[i],b=pieces[j];
                if (a.pocketed||b.pocketed) continue;
                const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy);
                if (dist < a.r+b.r && dist>0){
                    const nx=dx/dist,ny=dy/dist,overlap=a.r+b.r-dist;
                    a.x-=nx*overlap/2;a.y-=ny*overlap/2;b.x+=nx*overlap/2;b.y+=ny*overlap/2;
                    const rvx=a.vx-b.vx,rvy=a.vy-b.vy;
                    const vel=rvx*nx+rvy*ny;
                    if(vel>0){const imp=vel*0.9;a.vx-=imp*nx;a.vy-=imp*ny;b.vx+=imp*nx;b.vy+=imp*ny;}
                }
            }
        }
        let pocketedThisTurn = false;
        if (striker && !striker.pocketed && checkPocket(striker)) {
            striker.pocketed = true;
            endTurn(false, true);
            moving = false;
            return;
        }
        pieces.forEach(p => {
            if (p.pocketed) return;
            if (checkPocket(p)) {
                p.pocketed = true;
                pocketedThisTurn = true;
                const t = teamOf(turn);
                if (p.color === 'red') scores[t] += 3;
                else if ((t===0 && p.color==='white') || (t===1 && p.color==='black')) scores[t] += 1;
                else scores[1-t] += 1;
            }
        });
        whiteElem.innerText = scores[0]; blackElem.innerText = scores[1];

        const movingPieces = pieces.some(p=>!p.pocketed && (Math.abs(p.vx)>0.1||Math.abs(p.vy)>0.1));
        const strikerMoving = striker && !striker.pocketed && (Math.abs(striker.vx)>0.1||Math.abs(striker.vy)>0.1);
        if (!moving && (movingPieces||strikerMoving)) moving = true;
        if (moving && !movingPieces && !strikerMoving) {
            moving = false;
            setTimeout(()=>{ resetStriker(); endTurn(pocketedThisTurn, false); }, 300);
        }
    }

    function draw() {
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(0,0,W,H);
        ctx.strokeStyle = '#8b5a2b'; ctx.lineWidth=8; ctx.strokeRect(4,4,W-8,H-8);
        pockets.forEach(pk => { ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(pk.x,pk.y,PK,0,Math.PI*2); ctx.fill(); });
        ctx.strokeStyle='rgba(139,90,43,0.4)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(W/2,H/2,40,0,Math.PI*2); ctx.stroke();
        pieces.forEach(p => {
            if (p.pocketed) return;
            ctx.fillStyle = p.color==='white'?'#f8fafc': p.color==='black'?'#1f2937': p.color==='red'?'#dc2626':'#f8fafc';
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
        });
        if (striker && !striker.pocketed) {
            ctx.fillStyle='#fbbf24';
            ctx.beginPath(); ctx.arc(striker.x,striker.y,striker.r,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle='#92400e'; ctx.lineWidth=2; ctx.stroke();
        }
        if (dragging && dragStart && dragCur) {
            ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.moveTo(striker.x,striker.y); ctx.lineTo(striker.x + (dragStart.x-dragCur.x)*2, striker.y + (dragStart.y-dragCur.y)*2); ctx.stroke();
        }
    }

    function loop() { if(!running) return; if(!dragging) update(); draw(); raf=requestAnimationFrame(loop); }

    function getPos(e){ const r=canvas.getBoundingClientRect(); const src=e.touches?e.touches[0]:e; return {x:(src.clientX-r.left)*(W/r.width), y:(src.clientY-r.top)*(H/r.height)}; }
    canvas.addEventListener('mousedown',(e)=>{ if(moving) return; dragging=true; dragStart=getPos(e); dragCur=dragStart; });
    canvas.addEventListener('mousemove',(e)=>{ if(dragging) dragCur=getPos(e); });
    canvas.addEventListener('mouseup',()=>{ if(!dragging) return; dragging=false; const dx=dragStart.x-dragCur.x, dy=dragStart.y-dragCur.y; striker.vx=dx*0.15; striker.vy=dy*0.15; moving=true; dragStart=null; dragCur=null; });
    canvas.addEventListener('touchstart',(e)=>{ e.preventDefault(); if(moving) return; dragging=true; dragStart=getPos(e); dragCur=dragStart; },{passive:false});
    canvas.addEventListener('touchmove',(e)=>{ e.preventDefault(); if(dragging) dragCur=getPos(e); },{passive:false});
    canvas.addEventListener('touchend',(e)=>{ e.preventDefault(); if(!dragging) return; dragging=false; const dx=dragStart.x-dragCur.x, dy=dragStart.y-dragCur.y; striker.vx=dx*0.15; striker.vy=dy*0.15; moving=true; dragStart=null; dragCur=null; });

    document.querySelectorAll('.cr-nplayers').forEach(b => {
        b.addEventListener('click', () => { numPlayers=parseInt(b.dataset.n); initPieces(); resetStriker(); turn=0; scores=[0,0]; whiteElem.innerText='0'; blackElem.innerText='0'; statusElem.innerText='P1 turn (White)'; turnElem.innerText='P1 turn (White)'; moving=false; });
        b.addEventListener('touchstart', (e) => { e.preventDefault(); numPlayers=parseInt(b.dataset.n); initPieces(); resetStriker(); turn=0; scores=[0,0]; whiteElem.innerText='0'; blackElem.innerText='0'; statusElem.innerText='P1 turn (White)'; turnElem.innerText='P1 turn (White)'; moving=false; }, {passive:false});
    });

    initPieces(); turnElem.innerText='P1 turn (White)'; loop();
    return ()=>{ running=false; if(raf)cancelAnimationFrame(raf); };
}
