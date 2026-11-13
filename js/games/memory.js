// js/games/memory.js

export function render(container) {
    document.getElementById('active-game-title').innerText = 'Memory Match';

    container.innerHTML = `
        <div class="text-center space-y-4 max-w-sm w-full">
            <div class="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                <div>
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Moves</span>
                    <div id="mem-moves" class="text-xl font-black text-pink-400">0</div>
                </div>
                <div id="mem-status" class="text-xs font-bold text-slate-300">Find all pairs!</div>
                <button id="mem-reset-btn" class="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-pink-600/20">Reset</button>
            </div>
            <div id="mem-grid" class="grid grid-cols-4 gap-2.5 bg-slate-950 p-4 rounded-3xl border border-slate-800"></div>
        </div>
    `;

    const emojis = ['🎮', '🚀', '⭐', '🔥', '💎', '🎯', '⚡', '🏆'];
    let deck = [];
    let moves = 0;
    let matched = 0;
    let firstCard = null;
    let lockBoard = false;

    const grid = document.getElementById('mem-grid');
    const movesElem = document.getElementById('mem-moves');
    const statusElem = document.getElementById('mem-status');

    function initGame() {
        deck = emojis.concat(emojis).sort(() => Math.random() - 0.5);
        moves = 0;
        matched = 0;
        firstCard = null;
        lockBoard = false;
        movesElem.innerText = '0';
        statusElem.innerText = 'Find all pairs!';
        grid.innerHTML = '';

        deck.forEach((emoji) => {
            let card = document.createElement('button');
            card.className = 'h-16 bg-slate-900 hover:bg-slate-800 rounded-2xl text-2xl flex items-center justify-center transition cursor-pointer border border-slate-800';
            card.dataset.emoji = emoji;
            card.addEventListener('click', () => flipCard(card, emoji));
            grid.appendChild(card);
        });
    }

    function flipCard(card, emoji) {
        if (lockBoard || card.classList.contains('matched') || card === firstCard) return;
        card.innerText = emoji;
        card.classList.add('bg-indigo-950', 'border-indigo-500/50');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        moves++;
        movesElem.innerText = moves;

        if (firstCard.dataset.emoji === emoji) {
            card.classList.add('matched');
            firstCard.classList.add('matched');
            firstCard = null;
            matched++;

            if (matched === 8) {
                statusElem.innerText = 'You Won! 🎉';
                if (window.app && typeof window.app.reportScore === 'function') window.app.reportScore('memory', Math.max(10, 200 - moves * 5));
            }
        } else {
            lockBoard = true;
            let secondCard = card;
            setTimeout(() => {
                firstCard.innerText = '';
                firstCard.classList.remove('bg-indigo-950', 'border-indigo-500/50');
                secondCard.innerText = '';
                secondCard.classList.remove('bg-indigo-950', 'border-indigo-500/50');
                firstCard = null;
                lockBoard = false;
            }, 700);
        }
    }

    document.getElementById('mem-reset-btn').addEventListener('click', initGame);
    initGame();

    return () => {
        deck = null;
    };
}