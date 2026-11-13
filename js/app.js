// js/app.js

const DEFAULT_STATS = {
    snake: { plays: 1248, rating: 4.7 },
    tictactoe: { plays: 3920, rating: 4.5 },
    catcher: { plays: 2105, rating: 4.6 },
    clicker: { plays: 1876, rating: 4.4 },
    colorswitch: { plays: 1542, rating: 4.8 },
    memory: { plays: 2730, rating: 4.9 },
    pong: { plays: 1680, rating: 4.6 },
    twenty48: { plays: 4210, rating: 4.8 },
    mathquiz: { plays: 3100, rating: 4.7 },
    wordscramble: { plays: 2800, rating: 4.6 },
    capitalquiz: { plays: 2600, rating: 4.8 },
    typingspeed: { plays: 3500, rating: 4.9 },
    hangman: { plays: 2900, rating: 4.7 },
    simonsays: { plays: 2400, rating: 4.8 },
    whackamole: { plays: 3300, rating: 4.6 },
    numberguess: { plays: 2100, rating: 4.5 },
    rps: { plays: 3400, rating: 4.6 },
    diceroll: { plays: 2700, rating: 4.5 },
    coinflip: { plays: 2900, rating: 4.4 },
    patternmemory: { plays: 2200, rating: 4.7 },
    trivia: { plays: 3600, rating: 4.8 },
    reaction: { plays: 3100, rating: 4.9 },
    oddoneout: { plays: 2800, rating: 4.6 },
    anagram: { plays: 2500, rating: 4.7 },
    tabletennis: { plays: 1800, rating: 4.6 },
    snakesladders: { plays: 2000, rating: 4.5 },
    carrom: { plays: 1600, rating: 4.7 },
    chess: { plays: 2300, rating: 4.9 }
};

const GAME_META = {
    snake: { name: 'Snake Retro', icon: 'fa-worm', color: '#10b981' },
    tictactoe: { name: 'Tic-Tac-Toe', icon: 'fa-hashtag', color: '#6366f1' },
    catcher: { name: 'Catch the Coin', icon: 'fa-coins', color: '#f59e0b' },
    clicker: { name: 'Energy Tap Rush', icon: 'fa-bolt', color: '#06b6d4' },
    colorswitch: { name: 'Color Switch', icon: 'fa-palette', color: '#a855f7' },
    memory: { name: 'Memory Match', icon: 'fa-brain', color: '#ec4899' },
    pong: { name: 'Pong Duel', icon: 'fa-table-tennis-paddle-ball', color: '#f43f5e' },
    twenty48: { name: '2048 Tiles', icon: 'fa-border-all', color: '#eab308' },
    mathquiz: { name: 'Math Quiz', icon: 'fa-calculator', color: '#3b82f6' },
    wordscramble: { name: 'Word Scramble', icon: 'fa-spell-check', color: '#22c55e' },
    capitalquiz: { name: 'Capital Quiz', icon: 'fa-globe', color: '#a855f7' },
    typingspeed: { name: 'Typing Speed', icon: 'fa-keyboard', color: '#06b6d4' },
    hangman: { name: 'Hangman', icon: 'fa-font', color: '#f43f5e' },
    simonsays: { name: 'Simon Says', icon: 'fa-lightbulb', color: '#f59e0b' },
    whackamole: { name: 'Whack-a-Mole', icon: 'fa-hammer', color: '#fb923c' },
    numberguess: { name: 'Number Guess', icon: 'fa-dice', color: '#14b8a6' },
    rps: { name: 'Rock Paper Scissors', icon: 'fa-hand-scissors', color: '#8b5cf6' },
    diceroll: { name: 'Dice Roll', icon: 'fa-dice-six', color: '#6366f1' },
    coinflip: { name: 'Coin Flip', icon: 'fa-coins', color: '#f59e0b' },
    patternmemory: { name: 'Pattern Memory', icon: 'fa-brain', color: '#ec4899' },
    trivia: { name: 'Trivia Quiz', icon: 'fa-circle-question', color: '#3b82f6' },
    reaction: { name: 'Reaction Time', icon: 'fa-bolt', color: '#22c55e' },
    oddoneout: { name: 'Odd One Out', icon: 'fa-eye', color: '#14b8a6' },
    anagram: { name: 'Anagram Hunt', icon: 'fa-spell-check', color: '#a855f7' },
    tabletennis: { name: 'Table Tennis', icon: 'fa-table-tennis-paddle-ball', color: '#f43f5e' },
    snakesladders: { name: 'Snakes & Ladders', icon: 'fa-dice', color: '#22c55e' },
    carrom: { name: 'Carrom', icon: 'fa-circle', color: '#f59e0b' },
    chess: { name: 'Chess', icon: 'fa-chess', color: '#94a3b8' }
};

const HOW_TO_PLAY = {
    snake: { title: 'Snake Retro', steps: ['Use arrow keys to steer the snake.', 'Eat the red food to grow and score +10.', 'Avoid walls and your own tail.', 'Game speeds up as you grow.'] },
    tictactoe: { title: 'Tic-Tac-Toe', steps: ['Two players take turns (X and O).', 'Click an empty cell to place your mark.', 'Get 3 in a row (horizontal, vertical, or diagonal) to win.', 'Fill the board with no winner = draw.'] },
    catcher: { title: 'Catch the Coin', steps: ['Coins fall from the top.', 'Move the basket left/right with buttons or keyboard.', 'Catch coins to score. You have 30 seconds.', 'Missed coins are lost.'] },
    clicker: { title: 'Energy Tap Rush', steps: ['Press Start, then tap the big button as fast as you can.', 'You have 10 seconds.', 'Each tap = +1 score.', 'Beat your high score and share it!'] },
    colorswitch: { title: 'Color Switch', steps: ['A color word appears in a random ink color.', 'Press YES if ink color matches the word, NO otherwise.', 'Correct = +1 streak, wrong = -1.', 'You have 15 seconds.'] },
    memory: { title: 'Memory Match', steps: ['Flip two cards at a time.', 'Matching pairs stay open.', 'Remember positions to find all 8 pairs.', 'Fewer moves = better score.'] },
    pong: { title: 'Pong Duel', steps: ['Move your paddle with mouse or up/down keys.', 'Hit the ball past the AI paddle to score.', 'First to 7 points wins.', 'Angle the ball by hitting off-center.'] },
    twenty48: { title: '2048 Tiles', steps: ['Use arrow keys or swipe to slide tiles.', 'Matching tiles merge into double value.', 'Reach 2048 to win.', 'Game ends when no moves remain.'] },
    mathquiz: { title: 'Math Quiz', steps: ['A math problem appears.', 'Pick the correct answer from 4 options.', 'You have 30 seconds.', 'Correct = +1 score.'] },
    wordscramble: { title: 'Word Scramble', steps: ['Letters of a word are scrambled.', 'Type the correct word and submit.', 'You have 60 seconds.', 'Each correct word = +1 score.'] },
    capitalquiz: { title: 'Capital Quiz', steps: ['A country name is shown.', 'Pick its capital from 4 options.', 'You have 30 seconds.', 'Correct = +1 score.'] },
    typingspeed: { title: 'Typing Speed', steps: ['A word appears on screen.', 'Type it exactly and press Enter.', 'You have 30 seconds.', 'Each correct word = +1 score. Aim for high WPM.'] },
    hangman: { title: 'Hangman', steps: ['A word is hidden.', 'Guess letters by clicking A-Z.', 'Wrong guesses draw the hangman.', 'Guess the word before 6 wrong guesses.'] },
    simonsays: { title: 'Simon Says', steps: ['Watch the color sequence.', 'Repeat it by clicking colors.', 'Sequence grows each round.', 'One mistake ends the game.'] },
    whackamole: { title: 'Whack-a-Mole', steps: ['Moles pop up randomly.', 'Click/tap them to score.', 'You have 30 seconds.', 'Missed moles disappear.'] },
    numberguess: { title: 'Number Guess', steps: ['A secret number 1-100 is chosen.', 'Guess and get higher/lower hints.', 'Try to find it in fewest guesses.', 'Score = 100 - guesses used.'] },
    rps: { title: 'Rock Paper Scissors', steps: ['Pick Rock, Paper, or Scissors.', 'Beat the CPU over 10 rounds.', 'Rock beats Scissors, Paper beats Rock, Scissors beats Paper.', 'Most wins takes the match.'] },
    diceroll: { title: 'Dice Roll', steps: ['Roll the dice.', 'Guess if result is high (4-6) or low (1-3).', '10 rounds total.', 'Correct guesses score points.'] },
    coinflip: { title: 'Coin Flip', steps: ['Pick heads or tails.', 'Flip the coin.', 'Match wins a point.', '10 rounds total.'] },
    patternmemory: { title: 'Pattern Memory', steps: ['Watch the color sequence.', 'Repeat it by tapping cells.', 'Sequence grows each level.', 'One mistake ends the game.'] },
    trivia: { title: 'Trivia Quiz', steps: ['A trivia question appears.', 'Pick the correct answer.', 'You have 30 seconds.', 'Each correct answer scores.'] },
    reaction: { title: 'Reaction Time', steps: ['Wait for the box to turn green.', 'Click as fast as you can.', 'Too early = penalty.', '5 attempts, best time saved.'] },
    oddoneout: { title: 'Odd One Out', steps: ['Find the different emoji among 16.', 'Click it to score.', 'You have 30 seconds.', 'Speed and accuracy matter.'] },
    anagram: { title: 'Anagram Hunt', steps: ['A word is shown.', 'Type any anagram of it.', 'Each valid anagram scores.', '60 seconds total.'] },
    tabletennis: { title: 'Table Tennis', steps: ['P1 uses W/S, P2 uses Arrow keys.', 'Hit the ball past opponent.', 'First to 7 wins.', 'Angle shots by hitting off-center.'] },
    snakesladders: { title: 'Snakes & Ladders', steps: ['Roll the dice to move.', 'Land on a ladder to climb up.', 'Land on a snake to slide down.', 'First to 100 wins.'] },
    carrom: { title: 'Carrom', steps: ['Drag the striker and release to flick.', 'Pocket your color coins.', 'Pocket the red queen for bonus.', 'Fouls pass the turn.'] },
    chess: { title: 'Chess', steps: ['Tap a piece, then tap a square.', 'Standard chess rules apply.', 'Checkmate the enemy king to win.', 'Promotion auto-queens.'] },
};

const GAME_TAGS = {
    snake: { difficulty: 'Medium', duration: '5 min', isNew: false },
    tictactoe: { difficulty: 'Easy', duration: '3 min', isNew: false },
    catcher: { difficulty: 'Medium', duration: '1 min', isNew: false },
    clicker: { difficulty: 'Easy', duration: '1 min', isNew: false },
    colorswitch: { difficulty: 'Hard', duration: '1 min', isNew: false },
    memory: { difficulty: 'Medium', duration: '3 min', isNew: false },
    pong: { difficulty: 'Medium', duration: '5 min', isNew: true },
    twenty48: { difficulty: 'Hard', duration: '10 min', isNew: true },
    mathquiz: { difficulty: 'Easy', duration: '1 min', isNew: true },
    wordscramble: { difficulty: 'Medium', duration: '2 min', isNew: true },
    capitalquiz: { difficulty: 'Medium', duration: '1 min', isNew: true },
    typingspeed: { difficulty: 'Medium', duration: '1 min', isNew: true },
    hangman: { difficulty: 'Medium', duration: '3 min', isNew: true },
    simonsays: { difficulty: 'Hard', duration: '3 min', isNew: true },
    whackamole: { difficulty: 'Easy', duration: '1 min', isNew: true },
    numberguess: { difficulty: 'Easy', duration: '2 min', isNew: true },
    rps: { difficulty: 'Easy', duration: '2 min', isNew: true },
    diceroll: { difficulty: 'Easy', duration: '2 min', isNew: true },
    coinflip: { difficulty: 'Easy', duration: '2 min', isNew: true },
    patternmemory: { difficulty: 'Hard', duration: '3 min', isNew: true },
    trivia: { difficulty: 'Medium', duration: '1 min', isNew: true },
    reaction: { difficulty: 'Medium', duration: '1 min', isNew: true },
    oddoneout: { difficulty: 'Easy', duration: '1 min', isNew: true },
    anagram: { difficulty: 'Hard', duration: '2 min', isNew: true },
    tabletennis: { difficulty: 'Medium', duration: '5 min', isNew: true },
    snakesladders: { difficulty: 'Easy', duration: '10 min', isNew: true },
    carrom: { difficulty: 'Hard', duration: '10 min', isNew: true },
    chess: { difficulty: 'Hard', duration: '15 min', isNew: true }
};

const ACHIEVEMENTS = [
    { id: 'first_play', name: 'First Steps', desc: 'Play your first game', icon: 'fa-shoe-prints', reward: 25 },
    { id: 'five_plays', name: 'Regular', desc: 'Play 5 games', icon: 'fa-gamepad', reward: 50 },
    { id: 'ten_plays', name: 'Dedicated', desc: 'Play 10 games', icon: 'fa-fire', reward: 100 },
    { id: 'snake_50', name: 'Snake Master', desc: 'Score 50+ in Snake', icon: 'fa-worm', reward: 75, skin: 'forest' },
    { id: 'memory_win', name: 'Sharp Mind', desc: 'Win Memory Match', icon: 'fa-brain', reward: 60 },
    { id: 'clicker_30', name: 'Speed Demon', desc: 'Get 30+ taps', icon: 'fa-bolt', reward: 60 },
    { id: 'color_10', name: 'Color Genius', desc: 'Reach 10 streak in Color Switch', icon: 'fa-palette', reward: 60 },
    { id: 'catcher_20', name: 'Coin Catcher', desc: 'Catch 20 coins in a run', icon: 'fa-coins', reward: 60 },
    { id: 'ttt_win', name: 'Strategist', desc: 'Win Tic-Tac-Toe', icon: 'fa-hashtag', reward: 40 },
    { id: 'streak_3', name: '3-Day Streak', desc: 'Log in 3 days in a row', icon: 'fa-calendar-check', reward: 80, skin: 'sunset' },
    { id: 'streak_7', name: 'Weekly Warrior', desc: 'Log in 7 days in a row', icon: 'fa-trophy', reward: 200, skin: 'gold' },
    { id: 'referred', name: 'Welcome Aboard', desc: 'Joined via a referral', icon: 'fa-user-plus', reward: 50 }
];

const SKINS = [
    { id: 'default', name: 'Indigo', desc: 'Default theme', colors: ['#6366f1', '#06b6d4'], unlocked: true },
    { id: 'sunset', name: 'Sunset', desc: 'Warm orange & pink', colors: ['#f97316', '#ec4899'], unlocked: false },
    { id: 'forest', name: 'Forest', desc: 'Green & emerald', colors: ['#10b981', '#22c55e'], unlocked: false },
    { id: 'midnight', name: 'Midnight', desc: 'Deep purple', colors: ['#8b5cf6', '#6366f1'], unlocked: false, price: 150 },
    { id: 'gold', name: 'Gold', desc: 'Premium gold', colors: ['#f59e0b', '#eab308'], unlocked: false }
];

class JTBPortal {
    constructor() {
        this.activeCleanup = null;
        this.stats = this.loadStats();
        this.ratings = this.loadRatings();
        this.progress = this.loadProgress();
        this.muted = localStorage.getItem('jtb_muted') === '1';
        this.highContrast = localStorage.getItem('jtb_hc') === '1';
        this.init();
        this.renderStats();
        this.pageSize = 8;
        this.loadedCount = this.pageSize;
        this.applyPagination();
        this.updateLoadMoreButton();
        this.renderTopBar();
        this.registerSW();
        this.setupInstallPrompt();
        this.initPlayerName();
        this.handleReferral();
        this.dailyLogin();
        this.checkAchievements();
        this.applySkin(this.progress.activeSkin || 'default');
        if (this.highContrast) document.body.classList.add('high-contrast');
        this.enhanceAccessibility();
        this.renderTagsOnCards();
        this.updateCategoryCounts();
        this.updateGamesCount(this.loadedCount);
        this.renderGameOfWeek();
        this.renderRecommended();
        this.updateMuteButton();
        this.handleDeepLink();
        this.renderDailyChallenge();
        this.renderRecentlyPlayed();
    }

    init() { window.app = this; }
    // mute button init moved to constructor tail

    loadStats() {
        try {
            const raw = localStorage.getItem('jtb_stats');
            if (raw) {
                const parsed = JSON.parse(raw);
                for (const k in DEFAULT_STATS) if (!parsed[k]) parsed[k] = { ...DEFAULT_STATS[k] };
                return parsed;
            }
        } catch (e) {}
        return JSON.parse(JSON.stringify(DEFAULT_STATS));
    }
    saveStats() { try { localStorage.setItem('jtb_stats', JSON.stringify(this.stats)); } catch (e) {} }
    loadRatings() {
        try { return JSON.parse(localStorage.getItem('jtb_ratings') || '{}'); } catch (e) { return {}; }
    }
    saveRatings() { try { localStorage.setItem('jtb_ratings', JSON.stringify(this.ratings)); } catch (e) {} }
    getAverageRating(gameId) {
        const r = this.ratings[gameId];
        if (!r || !r.length) return this.stats[gameId]?.rating || 0;
        return r.reduce((a,b)=>a+b,0) / r.length;
    }
    rateGame(gameId, rating) {
        this.ratings[gameId] = this.ratings[gameId] || [];
        // one rating per player: replace last? We'll push (allow multiple) but track user rating separately
        const userRatings = this.ratings[gameId + '_user'] || {};
        const player = this.getPlayerName() || 'Guest';
        // store user's rating
        if (!this.ratings[gameId + '_user']) this.ratings[gameId + '_user'] = {};
        const prev = this.ratings[gameId + '_user'][player];
        // adjust aggregate: remove prev if exists
        if (prev !== undefined) {
            const arr = this.ratings[gameId];
            const i = arr.indexOf(prev);
            if (i >= 0) arr.splice(i, 1);
        }
        this.ratings[gameId].push(rating);
        this.ratings[gameId + '_user'][player] = rating;
        this.saveRatings();
        this.renderRatingWidget(gameId);
        this.renderStats();
        this.playSound('click');
        this.toast(`Rated ${rating} star${rating>1?'s':''}`, 'fa-star', 'amber');
    }
    renderRatingWidget(gameId) {
        const widget = document.getElementById('rating-widget');
        if (!widget) return;
        const avg = this.getAverageRating(gameId);
        const count = (this.ratings[gameId] || []).length;
        const player = this.getPlayerName() || 'Guest';
        const userRating = (this.ratings[gameId + '_user'] || {})[player] || 0;
        widget.classList.remove('hidden');
        document.getElementById('rating-avg').innerText = avg.toFixed(1);
        document.getElementById('rating-count').innerText = count;
        const stars = document.getElementById('rating-stars');
        stars.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.className = 'text-lg transition hover:scale-125 touch-manipulation ' + (i <= userRating ? 'text-amber-400' : 'text-slate-600');
            btn.innerHTML = '<i class="fa-solid fa-star"></i>';
            btn.addEventListener('click', () => this.rateGame(gameId, i));
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.rateGame(gameId, i); }, { passive: false });
            stars.appendChild(btn);
        }
    }

    formatPlays(n) { if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; return String(n); }
    renderStats() {
        document.querySelectorAll('#games-grid > div[data-game]').forEach(card => {
            const gameId = card.getAttribute('data-game');
            const s = this.stats[gameId] || { plays: 0, rating: 0 };
            const avgRating = this.getAverageRating(gameId);
            if (!card.querySelector('.rating-badge')) {
                const badge = document.createElement('div');
                badge.className = 'rating-badge absolute top-3 right-12 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-bold text-amber-400 backdrop-blur-sm';
                badge.innerHTML = '<i class="fa-solid fa-star text-[10px]"></i> <span class="rating-value">' + avgRating.toFixed(1) + '</span>';
                card.appendChild(badge);
            } else card.querySelector('.rating-value').innerText = avgRating.toFixed(1);
            let playsEl = card.querySelector('.plays-count');
            if (!playsEl) {
                const footer = card.querySelector('.mt-auto');
                if (footer) { playsEl = document.createElement('span'); playsEl.className = 'plays-count text-[10px] text-slate-500 font-medium'; footer.insertBefore(playsEl, footer.firstChild); }
            }
            if (playsEl) playsEl.innerText = this.formatPlays(s.plays) + ' plays';
        });
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('jtb_progress');
            if (raw) {
                const p = JSON.parse(raw);
                p.xp = p.xp || 0;
                p.level = p.level || 1;
                p.recentlyPlayed = p.recentlyPlayed || [];
                p.dailyChallenge = p.dailyChallenge || { date: null, gameId: null, completed: false };
                p.streakFreeze = p.streakFreeze || { count: 1, lastWeek: null };
                p.badges = p.badges || [];
                p.favorites = p.favorites || [];
                return p;
            }
        } catch (e) {}
        return { coins: 0, streak: 0, lastLogin: null, gamesPlayed: 0, totalScore: 0, achievements: [], unlockedSkins: ['default'], activeSkin: 'default', referralCode: null, referredBy: null, referredCount: 0, xp: 0, level: 1, recentlyPlayed: [], dailyChallenge: { date: null, gameId: null, completed: false }, streakFreeze: { count: 1, lastWeek: null }, badges: [], favorites: [] };
    }
    saveProgress() { try { localStorage.setItem('jtb_progress', JSON.stringify(this.progress)); } catch (e) {} }
    renderTopBar() {
        const el = document.getElementById('stats-pill');
        if (el) el.innerHTML = `<span class="flex items-center gap-1"><i class="fa-solid fa-star text-indigo-400"></i>Lv ${this.progress.level || 1}</span><span class="w-px h-3 bg-slate-700"></span><span class="flex items-center gap-1"><i class="fa-solid fa-fire text-orange-400"></i>${this.progress.streak}</span><span class="w-px h-3 bg-slate-700"></span><span class="flex items-center gap-1"><i class="fa-solid fa-coins text-amber-400"></i>${this.progress.coins}</span>`;
    }
    toast(msg, icon = 'fa-check-circle', color = 'indigo') {
        const t = document.createElement('div');
        t.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[70] glass panel px-5 py-3 flex items-center gap-3 shadow-2xl fade-in';
        t.innerHTML = `<i class="fa-solid ${icon} text-${color}-400"></i><span class="text-xs font-semibold text-slate-200">${msg}</span>`;
        document.body.appendChild(t);
        setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 2600);
    }

    dailyLogin() {
        const today = new Date().toISOString().slice(0, 10);
        if (this.progress.lastLogin === today) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (this.progress.lastLogin === yesterday) {
            this.progress.streak += 1;
        } else if (this.progress.lastLogin) {
            // missed a day: try streak freeze
            const week = this.getWeekKey();
            if (this.progress.streakFreeze.count > 0 && this.progress.streakFreeze.lastWeek !== week) {
                this.progress.streakFreeze.count -= 1;
                this.progress.streakFreeze.lastWeek = week;
                this.progress.streak += 1;
                this.toast('Streak freeze used! Streak preserved.', 'fa-snowflake', 'cyan');
            } else {
                this.progress.streak = 1;
            }
        } else {
            this.progress.streak = 1;
        }
        this.progress.lastLogin = today;
        const reward = Math.min(10 + (this.progress.streak - 1) * 5, 60);
        this.progress.coins += reward;
        this.progress.xp = (this.progress.xp || 0) + 5;
        this.saveProgress();
        this.renderTopBar();
        this.toast(`Daily reward: +${reward} coins (streak ${this.progress.streak})`, 'fa-gift', 'amber');
        this.checkAchievements();
    }
    getWeekKey() {
        const d = new Date();
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return d.getFullYear() + '-W' + week;
    }


    checkAchievements() {
        const p = this.progress;
        const unlock = (id) => {
            if (p.achievements.includes(id)) return;
            const a = ACHIEVEMENTS.find(x => x.id === id);
            if (!a) return;
            p.achievements.push(id);
            p.coins += a.reward;
            if (a.skin && !p.unlockedSkins.includes(a.skin)) p.unlockedSkins.push(a.skin);
            this.saveProgress();
            this.renderTopBar();
            this.toast(`Achievement unlocked: ${a.name} (+${a.reward} coins)`, 'fa-trophy', 'amber');
        };
        if (p.gamesPlayed >= 1) unlock('first_play');
        if (p.gamesPlayed >= 5) unlock('five_plays');
        if (p.gamesPlayed >= 10) unlock('ten_plays');
        if (p.streak >= 3) unlock('streak_3');
        if (p.streak >= 7) unlock('streak_7');
        if (p.referredBy) unlock('referred');
    }

    applySkin(id) {
        const skin = SKINS.find(s => s.id === id);
        if (!skin) return;
        if (!this.progress.unlockedSkins.includes(id)) { this.toast('Skin locked', 'fa-lock', 'rose'); return; }
        this.progress.activeSkin = id;
        this.saveProgress();
        const [c1, c2] = skin.colors;
        document.documentElement.style.setProperty('--accent', c1);
        let style = document.getElementById('skin-style');
        if (!style) { style = document.createElement('style'); style.id = 'skin-style'; document.head.appendChild(style); }
        style.textContent = `
            .btn-primary { background: linear-gradient(135deg, ${c1}, ${c2}) !important; }
            .btn-primary:hover { background: linear-gradient(135deg, ${c2}, ${c1}) !important; box-shadow: 0 0 20px ${c1}59 !important; }
            .chip.active { background: linear-gradient(135deg, ${c1}, ${c2}) !important; box-shadow: 0 0 15px ${c1}59 !important; }
            .glow-text { background: linear-gradient(to right, ${c1}, ${c2}, #a5f3fc); -webkit-background-clip: text; background-clip: text; }
        `;
        this.toast(`Theme: ${skin.name}`, 'fa-palette', 'indigo');
    }

    initPlayerName() {
        const name = localStorage.getItem('jtb_player') || '';
        this.updateNameDisplay(name || 'Guest');
    }
    getPlayerName() { return localStorage.getItem('jtb_player') || ''; }
    setPlayerName(name) {
        name = (name || '').trim().slice(0, 20);
        if (!name) return false;
        localStorage.setItem('jtb_player', name);
        this.updateNameDisplay(name);
        if (!this.progress.referralCode) { this.progress.referralCode = this.generateReferralCode(name); this.saveProgress(); }
        return true;
    }
    updateNameDisplay(name) { const el = document.getElementById('player-name-display'); if (el) el.innerText = name; }
    promptName() { this.showNameModal(true); }
    showNameModal(force) {
        if (document.getElementById('name-modal')) return;
        const overlay = document.createElement('div');
        overlay.id = 'name-modal';
        overlay.className = 'fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4';
        const current = this.getPlayerName();
        overlay.innerHTML = `
            <div class="glass panel max-w-sm w-full p-6 space-y-4 fade-in">
                <div class="text-center">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg shadow-indigo-500/30"><i class="fa-solid fa-user"></i></div>
                    <h3 class="text-lg font-bold text-slate-100">Welcome, Player!</h3>
                    <p class="text-xs text-slate-400 mt-1">Enter your name to personalize your experience.</p>
                </div>
                <input id="name-input" type="text" maxlength="20" placeholder="Your name" value="${current}" class="search-input" style="padding-left:1rem;">
                <div class="flex gap-2">
                    ${force ? '' : '<button id="name-skip" class="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition">Skip</button>'}
                    <button id="name-save" class="flex-1 btn-primary px-4 py-2.5 rounded-xl text-xs font-bold">Save & Play</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const input = document.getElementById('name-input');
        input.focus(); input.select();
        const save = () => {
            const val = input.value.trim();
            if (val) this.setPlayerName(val);
            overlay.remove();
            if (!this.getPlayerName()) this.toast('Playing as Guest', 'fa-user', 'slate');
        };
        document.getElementById('name-save').addEventListener('click', save);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); });
        const skip = document.getElementById('name-skip');
        if (skip) skip.addEventListener('click', () => overlay.remove());
        if (!force) overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    ensurePlayerName() { if (!this.getPlayerName()) this.showNameModal(false); }

    generateReferralCode(name) {
        const slug = (name || 'player').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'player';
        const rand = Math.random().toString(36).slice(2, 6);
        return slug + '-' + rand;
    }
    handleReferral() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && ref !== this.progress.referralCode && !this.progress.referredBy) {
            this.progress.referredBy = ref;
            this.saveProgress();
            this.checkAchievements();
            this.toast('Welcome! You joined via a referral', 'fa-user-plus', 'emerald');
            if (window.history.replaceState) {
                const url = new URL(window.location.href); url.searchParams.delete('ref');
                window.history.replaceState({}, '', url.toString());
            }
        }
        if (!this.progress.referralCode) {
            const name = this.getPlayerName() || 'player';
            this.progress.referralCode = this.generateReferralCode(name);
            this.saveProgress();
        }
    }
    showReferral() {
        const code = this.progress.referralCode;
        const link = `${window.location.origin}${window.location.pathname}?ref=${code}`;
        this.showModal('Referral Program', `
            <div class="space-y-4">
                <p class="text-xs text-slate-400">Share your code. When a friend joins, you both get a badge and bonus coins.</p>
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <span class="font-mono text-sm text-indigo-300">${code}</span>
                    <button onclick="navigator.clipboard.writeText('${code}'); window.app.toast('Code copied','fa-copy','indigo')" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Copy</button>
                </div>
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                    <span class="text-xs text-slate-400 truncate">${link}</span>
                    <button onclick="navigator.clipboard.writeText('${link}'); window.app.toast('Link copied','fa-link','indigo')" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0">Copy</button>
                </div>
                <div class="text-xs text-slate-500">Referred friends: <span class="text-slate-200 font-bold">${this.progress.referredCount}</span></div>
                <div class="flex gap-2">
                    <a target="_blank" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Play free browser games on JTB Arcade! Use my code ' + code)}&url=${encodeURIComponent(link)}" class="flex-1 text-center px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold">Share on X</a>
                    <a target="_blank" href="https://wa.me/?text=${encodeURIComponent('Play free browser games on JTB Arcade! ' + link)}" class="flex-1 text-center px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">WhatsApp</a>
                </div>
            </div>`);
    }

    getLeaderboard(gameId) {
        try { return JSON.parse(localStorage.getItem('jtb_lb_' + gameId) || '[]'); } catch (e) { return []; }
    }
    addScore(gameId, score) {
        const lb = this.getLeaderboard(gameId);
        const name = this.getPlayerName() || 'Guest';
        const _d = new Date();
        const _dd = String(_d.getDate()).padStart(2, '0');
        const _mm = String(_d.getMonth() + 1).padStart(2, '0');
        const _yyyy = _d.getFullYear();
        lb.push({ name, score, date: `${_dd}-${_mm}-${_yyyy}` });
        lb.sort((a, b) => b.score - a.score);
        const top = lb.slice(0, 10);
        localStorage.setItem('jtb_lb_' + gameId, JSON.stringify(top));
        return top;
    }
    showLeaderboard(gameId) {
        const meta = GAME_META[gameId] || { name: gameId };
        const lb = this.getLeaderboard(gameId);
        const rows = lb.length ? lb.map((e, i) => `
            <div class="flex items-center justify-between py-2 border-b border-slate-800/50">
                <div class="flex items-center gap-3">
                    <span class="w-6 text-xs font-bold ${i < 3 ? 'text-amber-400' : 'text-slate-500'}">#${i + 1}</span>
                    <span class="text-sm text-slate-200">${e.name}</span>
                </div>
                <div class="text-right">
                    <span class="text-sm font-bold text-indigo-300">${e.score}</span>
                    <span class="block text-[10px] text-slate-500">${e.date}</span>
                </div>
            </div>`).join('') : '<p class="text-xs text-slate-500 text-center py-6">No scores yet. Be the first!</p>';
        const selector = Object.keys(GAME_META).map(g => `<button onclick="window.app.showLeaderboard('${g}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold ${g === gameId ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">${GAME_META[g].name}</button>`).join('');
        this.showModal('Leaderboards', `
            <div class="space-y-3">
                <div class="flex flex-wrap gap-2">${selector}</div>
                <h4 class="text-sm font-bold text-slate-200">${meta.name}</h4>
                <div class="max-h-64 overflow-y-auto">${rows}</div>
            </div>`);
    }

    reportScore(gameId, score) {
        const meta = GAME_META[gameId] || { name: gameId };
        this.progress.totalScore += score;
        const lb = this.addScore(gameId, score);
        this.checkAchievementsByGame(gameId, score);
        this.playSound('success'); this.vibrate(20);
        this.addXP(Math.max(1, Math.floor(score / 5)));
        this.showShareCard(gameId, score, meta, lb);
    }
    checkAchievementsByGame(gameId, score) {
        const p = this.progress;
        const grant = (id, reward, skin) => {
            if (p.achievements.includes(id)) return;
            p.achievements.push(id);
            p.coins += reward;
            if (skin && !p.unlockedSkins.includes(skin)) p.unlockedSkins.push(skin);
            this.saveProgress();
            this.renderTopBar();
            const a = ACHIEVEMENTS.find(x => x.id === id);
            this.toast(`Achievement: ${a ? a.name : id} (+${reward})`, 'fa-trophy', 'amber');
        };
        if (gameId === 'snake' && score >= 50) grant('snake_50', 75, 'forest');
        if (gameId === 'clicker' && score >= 30) grant('clicker_30', 60);
        if (gameId === 'colorswitch' && score >= 10) grant('color_10', 60);
        if (gameId === 'catcher' && score >= 20) grant('catcher_20', 60);
        if (gameId === 'tictactoe' && score >= 1) grant('ttt_win', 40);
        if (gameId === 'memory' && score >= 1) {
            if (!p.achievements.includes('memory_win')) grant('memory_win', 60);
        }
        this.checkAchievements();
    }
    showShareCard(gameId, score, meta, lb) {
        const player = this.getPlayerName() || 'Guest';
        const rank = lb.findIndex(e => e.name === player && e.score === score) + 1;
        const link = `${window.location.origin}${window.location.pathname}?game=${gameId}&score=${score}&player=${encodeURIComponent(player)}`;
        const canvas = document.createElement('canvas');
        canvas.width = 1200; canvas.height = 630;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 1200, 630);
        grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 630);
        ctx.fillStyle = 'rgba(99,102,241,0.18)'; ctx.beginPath(); ctx.arc(950, 180, 320, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 44px system-ui'; ctx.fillText('JTB ARCADE', 80, 95);
        ctx.fillStyle = '#94a3b8'; ctx.font = '26px system-ui'; ctx.fillText('Beat my score!', 80, 135);
        ctx.fillStyle = meta.color; ctx.font = 'bold 68px system-ui'; ctx.fillText(meta.name, 80, 240);
        ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 132px system-ui'; ctx.fillText(String(score), 80, 380);
        ctx.fillStyle = '#94a3b8'; ctx.font = '30px system-ui'; ctx.fillText('by ' + player + (rank > 0 ? '   �   Rank #' + rank : ''), 80, 430);
        ctx.fillStyle = '#6366f1'; ctx.font = '22px system-ui'; ctx.fillText(link, 80, 565);
        const dataUrl = canvas.toDataURL('image/png');
        this.showModal('Share Your Score', `
            <div class="space-y-4">
                <img src="${dataUrl}" alt="score card" class="w-full rounded-xl border border-slate-800">
                <div class="flex flex-wrap gap-2">
                    <a target="_blank" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I scored ' + score + ' in ' + meta.name + ' on JTB Arcade! Beat my score: ' + link)}" class="flex-1 text-center px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold">Share on X</a>
                    <a target="_blank" href="https://wa.me/?text=${encodeURIComponent('I scored ' + score + ' in ' + meta.name + '! Beat my score: ' + link)}" class="flex-1 text-center px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">WhatsApp</a>
                    <button onclick="navigator.clipboard.writeText('${link}'); window.app.toast('Link copied','fa-link','indigo')" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Copy Link</button>
                    <button onclick="const a=document.createElement('a');a.href='${dataUrl}';a.download='jtb-score.png';a.click()" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Download</button>
                </div>
                ${navigator.share ? '<button id="native-share" class="w-full btn-primary px-4 py-2.5 rounded-xl text-xs font-bold">Share�</button>' : ''}
            </div>`);
        const ns = document.getElementById('native-share');
        if (ns) ns.addEventListener('click', async () => {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'jtb-score.png', { type: 'image/png' });
                await navigator.share({ title: meta.name + ' score', text: 'I scored ' + score, url: link, files: [file] });
            } catch (e) {}
        });
    }

    showModal(title, bodyHtml) {
        const existing = document.getElementById('app-modal');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'app-modal';
        overlay.className = 'fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div class="glass panel max-w-lg w-full p-6 space-y-4 fade-in max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-slate-100">${title}</h3>
                    <button onclick="document.getElementById('app-modal').remove()" class="text-slate-400 hover:text-slate-200 text-xl leading-none">&times;</button>
                </div>
                ${bodyHtml}
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    showProfile() {
        const p = this.progress;
        const achHtml = ACHIEVEMENTS.map(a => {
            const done = p.achievements.includes(a.id);
            return `<div class="flex items-center gap-3 py-2 border-b border-slate-800/50 ${done ? '' : 'opacity-40'}">
                <div class="w-9 h-9 rounded-xl ${done ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'} flex items-center justify-center"><i class="fa-solid ${a.icon}"></i></div>
                <div class="flex-1"><div class="text-sm font-semibold text-slate-200">${a.name}</div><div class="text-[10px] text-slate-500">${a.desc}</div></div>
                <span class="text-xs font-bold ${done ? 'text-emerald-400' : 'text-slate-600'}">${done ? '<i class="fa-solid fa-check"></i>' : '+' + a.reward}</span>
            </div>`;
        }).join('');
        const skinHtml = SKINS.map(s => {
            const unlocked = p.unlockedSkins.includes(s.id);
            const active = p.activeSkin === s.id;
            return `<button onclick="${unlocked ? `window.app.applySkin('${s.id}')` : ''}" class="p-3 rounded-xl border ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50'} ${unlocked ? 'hover:border-slate-600' : 'opacity-50 cursor-not-allowed'} text-left">
                <div class="flex gap-2 mb-2">${s.colors.map(c => `<span class="w-6 h-6 rounded-full" style="background:${c}"></span>`).join('')}</div>
                <div class="text-xs font-bold text-slate-200">${s.name}</div>
                <div class="text-[10px] text-slate-500">${unlocked ? (active ? 'Active' : 'Unlocked') : (s.price ? s.price + ' coins' : 'Locked')}</div>
            </button>`;
        }).join('');
        this.showModal('Player Profile', `
            <div class="grid grid-cols-4 gap-2 text-center mb-2">
                <div class="bg-slate-950 rounded-xl p-3"><div class="text-xs text-slate-500">Level</div><div class="text-xl font-black text-indigo-400">${p.level || 1}</div></div>
                <div class="bg-slate-950 rounded-xl p-3"><div class="text-xs text-slate-500">Streak</div><div class="text-xl font-black text-orange-400">${p.streak}<i class="fa-solid fa-fire text-base"></i></div></div>
                <div class="bg-slate-950 rounded-xl p-3"><div class="text-xs text-slate-500">Coins</div><div class="text-xl font-black text-amber-400">${p.coins}<i class="fa-solid fa-coins text-base"></i></div></div>
                <div class="bg-slate-950 rounded-xl p-3"><div class="text-xs text-slate-500">Games</div><div class="text-xl font-black text-slate-200">${p.gamesPlayed}</div></div>
            </div>
            <div class="text-xs text-slate-400 mb-2">XP: ${p.xp || 0} / ${((p.level||1)*100)} to next level. Streak freezes: ${p.streakFreeze?.count || 0}</div>
            <div class="text-xs text-slate-500 mb-3">Badges: ${(p.badges||[]).length ? (p.badges||[]).join(', ') : 'None yet'}</div>
            <div class="flex gap-2 mb-3">
                <button onclick="window.app.showLeaderboard('snake')" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Leaderboards</button>
                <button onclick="window.app.showReferral()" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Referral</button>
            </div>
            <h4 class="text-sm font-bold text-slate-200 mt-2">Achievements</h4>
            <div class="max-h-48 overflow-y-auto">${achHtml}</div>
            <h4 class="text-sm font-bold text-slate-200 mt-3">Themes</h4>
            <div class="grid grid-cols-2 gap-2">${skinHtml}</div>
            <div class="flex gap-2 mt-3">
                <button onclick="window.app.enableNotifications()" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Enable Reminders</button>
            </div>
            <div class="flex gap-2 mt-2">
                <button onclick="window.app.exportProgress()" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Export Save</button>
                <button onclick="window.app.importProgress()" class="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Import Save</button>
            </div>
        `);
    }


    handleDeepLink() {
        const params = new URLSearchParams(window.location.search);
        const g = params.get('game');
        if (g && GAME_META[g]) {
            setTimeout(() => { window.app.openGame(g); }, 300);
        }
    }

    showHowToPlay(gameId) {
        const g = gameId || this.currentGame;
        const info = HOW_TO_PLAY[g];
        if (!info) { this.toast('No instructions available', 'fa-info-circle', 'slate'); return; }
        const steps = info.steps.map(function(st, i) {
            return '<li class="flex gap-3 py-1.5"><span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">' + (i + 1) + '</span><span class="text-sm text-slate-300">' + st + '</span></li>';
        }).join('');
        this.showModal('How to Play: ' + info.title, '<ul class="space-y-1">' + steps + '</ul>');
    }

    applyPagination() {
        const cards = Array.from(document.querySelectorAll('#games-grid > div'));
        cards.forEach((card, idx) => {
            if (card.dataset.hiddenByFilter === '1') { card.style.display = 'none'; return; }
            card.style.display = (idx < this.loadedCount) ? 'flex' : 'none';
        });
    }
    updateLoadMoreButton() {
        const wrap = document.getElementById('load-more-wrap');
        const btn = document.getElementById('load-more-btn');
        if (!wrap || !btn) return;
        const total = document.querySelectorAll('#games-grid > div').length;
        if (this.loadedCount >= total) wrap.classList.add('hidden'); else wrap.classList.remove('hidden');
    }
    loadMoreGames() {
        this.loadedCount += this.pageSize;
        this.applyPagination();
        this.updateLoadMoreButton();
        this.enhanceAccessibility();
        this.renderTagsOnCards();
        this.updateGamesCount(this.loadedCount);
        // re-apply current filter/search context
        const q = (document.getElementById('game-search')?.value || '').trim();
        if (q) this.searchGames();
    }


    ensureAudio() {
        if (this.audioCtx) return this.audioCtx;
        try { this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.audioCtx = null; }
        return this.audioCtx;
    }
    playSound(type) {
        if (this.muted) return;
        const ctx = this.ensureAudio();
        if (!ctx) return;
        const now = ctx.currentTime;
        const tones = {
            click: [[880, 0.05]],
            success: [[660, 0.08], [990, 0.12]],
            fail: [[220, 0.15]],
            start: [[523, 0.08], [659, 0.08], [784, 0.12]],
            end: [[784, 0.1], [659, 0.1], [523, 0.15]]
        };
        const seq = tones[type] || tones.click;
        let t = now;
        seq.forEach(([freq, dur]) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t); osc.stop(t + dur);
            t += dur;
        });
    }
    vibrate(ms) {
        if (this.muted) return;
        if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {}
    }
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('jtb_muted', this.muted ? '1' : '0');
        this.updateMuteButton();
        this.playSound('click');
    }
    updateMuteButton() {
        const btn = document.getElementById('mute-btn');
        if (btn) btn.innerHTML = this.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    }
    toggleHighContrast() {
        this.highContrast = !this.highContrast;
        localStorage.setItem('jtb_hc', this.highContrast ? '1' : '0');
        document.body.classList.toggle('high-contrast', this.highContrast);
        this.playSound('click');
    }
    enhanceAccessibility() {
        // make game cards keyboard accessible
        document.querySelectorAll('#games-grid > div[data-game]').forEach(card => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            const name = card.getAttribute('data-name') || 'game';
            card.setAttribute('aria-label', 'Play ' + name);
            if (!card.dataset.a11yBound) {
                card.dataset.a11yBound = '1';
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
                });
            }
        });
    }
    exportProgress() {
        const data = { stats: this.stats, progress: this.progress, player: localStorage.getItem('jtb_player') };
        const str = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        navigator.clipboard?.writeText(str).then(() => this.toast('Progress copied to clipboard', 'fa-copy', 'indigo')).catch(() => this.toast('Copy failed', 'fa-triangle-exclamation', 'rose'));
        return str;
    }
    importProgress() {
        const code = prompt('Paste your progress code:');
        if (!code) return;
        try {
            const data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
            if (data.stats) { this.stats = data.stats; this.saveStats(); this.renderStats(); }
            if (data.progress) { this.progress = data.progress; this.saveProgress(); this.renderTopBar(); this.applySkin(this.progress.activeSkin || 'default'); }
            if (data.player) { localStorage.setItem('jtb_player', data.player); this.initPlayerName(); }
            this.toast('Progress imported!', 'fa-check', 'emerald');
        } catch (e) { this.toast('Invalid code', 'fa-triangle-exclamation', 'rose'); }
    }


    addXP(amount) {
        this.progress.xp = (this.progress.xp || 0) + amount;
        const newLevel = Math.floor(this.progress.xp / 100) + 1;
        if (newLevel > (this.progress.level || 1)) {
            this.progress.level = newLevel;
            this.toast(`Level up! You are now level ${newLevel}`, 'fa-arrow-up', 'emerald');
            this.playSound('success');
        }
        this.saveProgress();
        this.renderTopBar();
    }
    getLevel() { return this.progress.level || 1; }
    getXP() { return this.progress.xp || 0; }


    getGameIds() { return Object.keys(GAME_META); }
    getDailyChallengeGame() {
        const ids = this.getGameIds();
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - start) / 86400000);
        return ids[dayOfYear % ids.length];
    }
    ensureDailyChallenge() {
        const today = new Date().toISOString().slice(0, 10);
        const dc = this.progress.dailyChallenge || { date: null, gameId: null, completed: false };
        if (dc.date !== today) {
            dc.date = today;
            dc.gameId = this.getDailyChallengeGame();
            dc.completed = false;
            this.progress.dailyChallenge = dc;
            this.saveProgress();
        }
        return dc;
    }
    renderDailyChallenge() {
        const el = document.getElementById('daily-challenge');
        if (!el) return;
        const dc = this.ensureDailyChallenge();
        const meta = GAME_META[dc.gameId] || { name: dc.gameId, color: '#6366f1' };
        const done = dc.completed;
        el.className = 'fade-in';
        el.innerHTML = `
            <div class="glass panel p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-indigo-500/30">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style="background:${meta.color}22;color:${meta.color}"><i class="fa-solid ${meta.icon}"></i></div>
                    <div>
                        <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Daily Challenge</div>
                        <div class="text-base font-bold text-slate-100">${meta.name} ${done ? '- Completed! ??' : ''}</div>
                        <div class="text-xs text-slate-400">${done ? 'Come back tomorrow for a new challenge.' : 'Play today to earn +50 coins & a badge.'}</div>
                    </div>
                </div>
                ${done ? '' : `<button onclick="window.app.openGame('${dc.gameId}')" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">Play Challenge</button>`}
            </div>
        `;
        el.classList.remove('hidden');
    }
    renderRecentlyPlayed() {
        const el = document.getElementById('recently-played');
        if (!el) return;
        const rp = this.progress.recentlyPlayed || [];
        if (rp.length === 0) { el.classList.add('hidden'); return; }
        const items = rp.map(g => {
            const m = GAME_META[g]; if (!m) return '';
            return `<button onclick="window.app.openGame('${g}')" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-indigo-500/50 transition"><i class="fa-solid ${m.icon}" style="color:${m.color}"></i>${m.name}</button>`;
        }).join('');
        el.innerHTML = `<div class="flex items-center gap-2 flex-wrap"><span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Recently Played:</span>${items}</div>`;
        el.classList.remove('hidden');
    }
    onGamePlayed(gameId) {
        // recently played
        const rp = this.progress.recentlyPlayed || [];
        const filtered = rp.filter(g => g !== gameId);
        filtered.unshift(gameId);
        this.progress.recentlyPlayed = filtered.slice(0, 5);
        // daily challenge
        const dc = this.ensureDailyChallenge();
        if (dc.gameId === gameId && !dc.completed) {
            dc.completed = true;
            this.progress.dailyChallenge = dc;
            this.progress.coins += 50;
            this.progress.xp = (this.progress.xp || 0) + 50;
            if (!this.progress.badges.includes('daily_challenge')) this.progress.badges.push('daily_challenge');
            this.saveProgress();
            this.renderTopBar();
            this.toast('Daily Challenge complete! +50 coins', 'fa-star', 'amber');
            this.renderDailyChallenge();
        }
        this.saveProgress();
        this.renderRecentlyPlayed();
    }


    async enableNotifications() {
        if (!('Notification' in window)) { this.toast('Notifications not supported', 'fa-triangle-exclamation', 'rose'); return; }
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
            localStorage.setItem('jtb_notif', '1');
            this.toast('Daily reminders enabled', 'fa-bell', 'emerald');
            new Notification('JTB Arcade', { body: 'Daily challenge awaits! Come back and play.' });
        } else {
            this.toast('Permission denied', 'fa-triangle-exclamation', 'rose');
        }
    }


    isFavorite(gameId) { return (this.progress.favorites || []).includes(gameId); }
    toggleFavorite(gameId, e) {
        if (e) e.stopPropagation();
        this.progress.favorites = this.progress.favorites || [];
        const idx = this.progress.favorites.indexOf(gameId);
        if (idx >= 0) this.progress.favorites.splice(idx, 1);
        else this.progress.favorites.push(gameId);
        this.saveProgress();
        this.renderTagsOnCards();
        this.playSound('click');
    }
    renderTagsOnCards() {
        document.querySelectorAll('#games-grid > div[data-game]').forEach(card => {
            const gameId = card.getAttribute('data-game');
            const tags = GAME_TAGS[gameId] || {};
            // remove old tag/fav containers
            card.querySelectorAll('.tag-row, .fav-btn, .new-badge').forEach(n => n.remove());
            // NEW badge
            if (tags.isNew) {
                const nb = document.createElement('div');
                nb.className = 'new-badge absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider';
                nb.innerText = 'NEW';
                card.appendChild(nb);
            }
            // fav button
            const fav = document.createElement('button');
            fav.className = 'fav-btn absolute top-3 right-3 w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center text-xs transition hover:scale-110 touch-manipulation';
            fav.innerHTML = this.isFavorite(gameId) ? '<i class="fa-solid fa-star text-amber-400"></i>' : '<i class="fa-regular fa-star text-slate-400"></i>';
            fav.setAttribute('aria-label', 'Toggle favorite');
            fav.addEventListener('click', (e) => this.toggleFavorite(gameId, e));
            fav.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); this.toggleFavorite(gameId, e); }, { passive: false });
            card.appendChild(fav);
            // adjust rating badge position to not overlap? rating badge at right-3; fav at right-12 (48px). Fine.
            // tag row in footer? add difficulty/duration to footer
            const footer = card.querySelector('.mt-auto');
            if (footer && !footer.querySelector('.tag-row')) {
                const tr = document.createElement('div');
                tr.className = 'tag-row flex gap-1.5 mt-2';
                tr.innerHTML = `<span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-semibold">${tags.difficulty || ''}</span><span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-semibold">${tags.duration || ''}</span>`;
                footer.appendChild(tr);
            }
        });
    }
    renderGameOfWeek() {
        const el = document.getElementById('game-of-week');
        if (!el) return;
        const ids = this.getGameIds();
        const now = new Date();
        const week = Math.floor((now - new Date(now.getFullYear(),0,1)) / (7*86400000));
        const gameId = ids[week % ids.length];
        const meta = GAME_META[gameId];
        if (!meta) { el.classList.add('hidden'); return; }
        el.innerHTML = `
            <div class="glass panel p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-amber-500/30">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style="background:${meta.color}22;color:${meta.color}"><i class="fa-solid ${meta.icon}"></i></div>
                    <div>
                        <div class="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Game of the Week</div>
                        <div class="text-base font-bold text-slate-100">${meta.name}</div>
                        <div class="text-xs text-slate-400">Try this week's featured game.</div>
                    </div>
                </div>
                <button onclick="window.app.openGame('${gameId}')" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">Play Now</button>
            </div>
        `;
        el.classList.remove('hidden');
    }
    renderRecommended() {
        const el = document.getElementById('recommended');
        if (!el) return;
        const rp = this.progress.recentlyPlayed || [];
        // recommend games in same category as most played? fallback: games not recently played
        const all = this.getGameIds();
        const notRecent = all.filter(g => !rp.includes(g));
        const picks = (notRecent.length ? notRecent : all).slice(0, 4);
        if (picks.length === 0) { el.classList.add('hidden'); return; }
        const items = picks.map(g => {
            const m = GAME_META[g];
            return `<button onclick="window.app.openGame('${g}')" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-indigo-500/50 transition"><i class="fa-solid ${m.icon}" style="color:${m.color}"></i>${m.name}</button>`;
        }).join('');
        el.innerHTML = `<div class="flex items-center gap-2 flex-wrap"><span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Recommended for you:</span>${items}</div>`;
        el.classList.remove('hidden');
    }
    sortGames(mode) {
        const grid = document.getElementById('games-grid');
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll('div[data-game]'));
        cards.sort((a, b) => {
            const ga = a.getAttribute('data-game'), gb = b.getAttribute('data-game');
            if (mode === 'name') return (a.getAttribute('data-name')||'').localeCompare(b.getAttribute('data-name')||'');
            if (mode === 'plays') return (this.stats[gb]?.plays||0) - (this.stats[ga]?.plays||0);
            if (mode === 'rating') return (this.stats[gb]?.rating||0) - (this.stats[ga]?.rating||0);
            return 0;
        });
        // default: original order by index? We'll just re-append sorted
        cards.forEach(c => grid.appendChild(c));
        this.applyPagination();
        this.renderTagsOnCards();
    }
    showEmbed(gameId) {
        const g = gameId || this.currentGame;
        const meta = GAME_META[g] || { name: g };
        const url = `${window.location.origin}${window.location.pathname}?game=${g}`;
        const code = `<iframe src="${url}" width="400" height="500" frameborder="0" allowfullscreen></iframe>`;
        this.showModal('Embed ' + meta.name, `
            <p class="text-xs text-slate-400 mb-2">Copy this code to embed the game on your site.</p>
            <textarea readonly class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono h-24">${code}</textarea>
            <button onclick="navigator.clipboard.writeText(this.previousElementSibling.value); window.app.toast('Copied','fa-copy','indigo')" class="w-full btn-primary px-4 py-2.5 rounded-xl text-xs font-bold mt-2">Copy Code</button>
        `);
    }


    updateCategoryCounts() {
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            const onclick = chip.getAttribute('onclick') || '';
            const m = onclick.match(/filterCategory\('([^']+)'\s*,/);
            if (!m) return;
            const cat = m[1];
            const cards = Array.from(document.querySelectorAll('#games-grid > div'));
            let count = 0;
            cards.forEach(c => {
                if (cat === 'all') count++;
                else if (cat === 'favorites') { if (this.isFavorite(c.getAttribute('data-game'))) count++; }
                else if (c.getAttribute('data-category') === cat) count++;
            });
            // append count to label if not already
            const base = chip.textContent.replace(/\s*\(\d+\)$/, '');
            chip.textContent = base + ' (' + count + ')';
        });
    }
    updateGamesCount(visible) {
        const el = document.getElementById('games-count');
        if (!el) return;
        const total = document.querySelectorAll('#games-grid > div').length;
        el.innerText = (visible !== undefined ? visible : total) + ' / ' + total + ' games';
    }

    showHome() {
        if (typeof this.activeCleanup === 'function') { this.activeCleanup(); this.activeCleanup = null; }
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('game-view').classList.add('hidden');
        const rw = document.getElementById('rating-widget'); if (rw) rw.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    async openGame(gameId) {
        this.currentGame = gameId;
        this.playSound('start'); this.vibrate(10);
        this.ensurePlayerName();
        document.getElementById('home-view').classList.add('hidden');
        document.getElementById('game-view').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const container = document.getElementById('game-container');
        container.innerHTML = '<div class="text-slate-400 text-sm animate-pulse">Loading Game Module...</div>';
        if (this.stats[gameId]) { this.stats[gameId].plays += 1; this.saveStats(); this.renderStats(); }
        this.progress.gamesPlayed += 1;
        this.saveProgress();
        this.addXP(10);
        this.onGamePlayed(gameId);
        this.renderTopBar();
        this.checkAchievements();
        try {
            const gameModule = await import(`./games/${gameId}.js`);
            if (gameModule && typeof gameModule.render === 'function') {
                const cleanupFn = gameModule.render(container);
                if (typeof cleanupFn === 'function') this.activeCleanup = cleanupFn;
                this.renderRatingWidget(gameId);
                const seen = JSON.parse(localStorage.getItem('jtb_seen_htp') || '[]');
                if (!seen.includes(gameId)) { seen.push(gameId); localStorage.setItem('jtb_seen_htp', JSON.stringify(seen)); setTimeout(() => this.showHowToPlay(gameId), 400); }
            } else container.innerHTML = '<p class="text-rose-400 text-xs">Error: Game module failed to load.</p>';
        } catch (error) {
            console.error('Failed to load game module:', error);
            container.innerHTML = '<p class="text-rose-400 text-xs">Error loading game. Please try again.</p>';
        }
    }
    filterCategory(cat, btn) {
        document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        const cards = document.querySelectorAll('#games-grid > div');
        let visible = 0;
        cards.forEach(card => {
            const gameId = card.getAttribute('data-game');
            let match = false;
            if (cat === 'all') match = true;
            else if (cat === 'favorites') match = this.isFavorite(gameId);
            else match = card.getAttribute('data-category') === cat;
            card.dataset.hiddenByFilter = match ? '0' : '1';
            if (match) visible++;
        });
        if (cat === 'all') {
            this.loadedCount = this.pageSize;
            this.applyPagination();
            this.updateLoadMoreButton();
        } else {
            cards.forEach(card => {
                if (card.dataset.hiddenByFilter === '0') card.style.display = 'flex';
                else card.style.display = 'none';
            });
            const wrap = document.getElementById('load-more-wrap');
            if (wrap) wrap.classList.add('hidden');
        }
        const empty = document.getElementById('empty-state');
        if (empty) empty.classList.toggle('hidden', visible !== 0);
    }
    searchGames() {
        let query = document.getElementById('game-search').value.toLowerCase().trim();
        const cards = document.querySelectorAll('#games-grid > div');
        let visible = 0;
        if (!query) {
            this.applyPagination();
            this.updateLoadMoreButton();
            return;
        }
        cards.forEach(card => {
            let name = (card.getAttribute('data-name') || '').toLowerCase();
            const match = name.includes(query) && card.dataset.hiddenByFilter !== '1';
            card.style.display = match ? 'flex' : 'none';
            if (match) visible++;
        });
        const wrap = document.getElementById('load-more-wrap');
        if (wrap) wrap.classList.add('hidden');
        const empty = document.getElementById('empty-state');
        if (empty) empty.classList.toggle('hidden', visible !== 0);
        this.updateGamesCount(visible);
    }

    registerSW() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('SW registration failed:', err)); });
        }
    }
    setupInstallPrompt() {
        this.deferredPrompt = null;
        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); this.deferredPrompt = e; this.showInstallBanner(); });
        window.addEventListener('appinstalled', () => { this.deferredPrompt = null; const b = document.getElementById('install-banner'); if (b) b.remove(); });
    }
    showInstallBanner() {
        if (document.getElementById('install-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'install-banner';
        banner.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass panel px-5 py-3 flex items-center gap-3 shadow-2xl';
        banner.innerHTML = '<i class="fa-solid fa-download text-indigo-400"></i><span class="text-xs font-semibold text-slate-200">Install JTB Arcade for offline play</span><button id="install-btn" class="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold">Install</button><button id="dismiss-install" class="text-slate-400 hover:text-slate-200 text-xs px-2">?</button>';
        document.body.appendChild(banner);
        document.getElementById('install-btn').addEventListener('click', async () => {
            if (!this.deferredPrompt) return;
            this.deferredPrompt.prompt();
            await this.deferredPrompt.userChoice;
            this.deferredPrompt = null; banner.remove();
        });
        document.getElementById('dismiss-install').addEventListener('click', () => banner.remove());
    }
}

new JTBPortal();
