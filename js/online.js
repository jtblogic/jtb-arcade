// js/online.js - PeerJS-based 1v1 online helper

export class OnlineRoom {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.roomCode = null;
        this.isHost = false;
        this.onMessage = null;
        this.onConnect = null;
        this.onDisconnect = null;
        this.onError = null;
    }

    // Create a room; resolves with room code (peer id)
    create() {
        return new Promise((resolve, reject) => {
            if (!window.Peer) { reject(new Error('PeerJS not loaded')); return; }
            const peer = new Peer();
            peer.on('open', (id) => {
                this.peer = peer;
                this.roomCode = id;
                this.isHost = true;
                peer.on('connection', (conn) => this._attach(conn));
                resolve(id);
            });
            peer.on('error', (e) => { if (this.onError) this.onError(e); reject(e); });
        });
    }

    // Join an existing room by code
    join(code) {
        return new Promise((resolve, reject) => {
            if (!window.Peer) { reject(new Error('PeerJS not loaded')); return; }
            const peer = new Peer();
            peer.on('open', () => {
                this.peer = peer;
                this.isHost = false;
                const conn = peer.connect(code, { reliable: true });
                this._attach(conn);
                conn.on('open', () => resolve(code));
            });
            peer.on('error', (e) => { if (this.onError) this.onError(e); reject(e); });
        });
    }

    _attach(conn) {
        this.conn = conn;
        conn.on('data', (data) => { if (this.onMessage) this.onMessage(data); });
        conn.on('open', () => { if (this.onConnect) this.onConnect(); });
        conn.on('close', () => { if (this.onDisconnect) this.onDisconnect(); });
        conn.on('error', (e) => { if (this.onError) this.onError(e); });
    }

    send(data) {
        if (this.conn && this.conn.open) {
            try { this.conn.send(data); } catch (e) {}
        }
    }

    close() {
        try { if (this.conn) this.conn.close(); } catch (e) {}
        try { if (this.peer) this.peer.destroy(); } catch (e) {}
        this.conn = null; this.peer = null; this.roomCode = null;
    }
}

// Helper to show a room code modal
export function showRoomCode(code, onJoin) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML = `
        <div class="glass panel max-w-sm w-full p-6 space-y-4 fade-in text-center">
            <h3 class="text-lg font-bold text-slate-100">Online Room</h3>
            <p class="text-xs text-slate-400">Share this code with a friend:</p>
            <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-lg text-indigo-300">${code}</div>
            <button id="copy-code" class="btn-primary px-4 py-2 rounded-xl text-xs font-bold">Copy Code</button>
            <p class="text-xs text-slate-500">Waiting for opponent...</p>
            <button id="cancel-room" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#copy-code').addEventListener('click', () => { navigator.clipboard?.writeText(code); });
    overlay.querySelector('#cancel-room').addEventListener('click', () => { overlay.remove(); if (onJoin) onJoin(false); });
    return overlay;
}

export function promptJoinCode() {
    return prompt('Enter room code to join:');
}
