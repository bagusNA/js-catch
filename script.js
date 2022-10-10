import Catch from "./Catch.js";

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const hpEl = document.getElementById('hp');
const progressEl = document.getElementById('progress');
const playFormEl = document.getElementById('play-form');
const leaderboardEl = document.getElementById('leaderboard');

const dialog = {
    container: document.getElementById('dialog'),
    play: document.getElementById('play-dialog'),
    pause: document.getElementById('pause-dialog'),
    gameOver: document.getElementById('gameover-dialog'),
}

const button = {
    resume: document.getElementById('btn-resume'),
    restart: document.querySelectorAll('.btn-restart'),
}

const jsCatch = new Catch({
    canvas,
    width: 800,
    height: 'full',
    asset: {
        fruit: "./img/fruit.png",
        catcher: "./img/catcher.png"
    },
    scoreElement: scoreEl,
    hpElement: hpEl,
    progressElement: progressEl,
    timeElement: timeEl,
    onGameOver,
});

function onGameOver() {
    dialog.container.style.display = 'block';
    dialog.gameOver.style.display = 'block';

    const leaderboard = jsCatch.getLeaderboard(15);

    leaderboard.forEach((score, index) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        const posTdEl = td.cloneNode(true);
        posTdEl.innerHTML = (index + 1).toString();

        const nameTdEl = td.cloneNode(true);
        nameTdEl.innerHTML = score.playerName;

        const scoreTdEl = td.cloneNode(true);
        scoreTdEl.innerHTML = score.score;

        tr.append(posTdEl, nameTdEl, scoreTdEl);
        leaderboardEl.appendChild(tr);
    });
}

const togglePause = () => {
    if (!jsCatch.status.started) return;

    dialog.container.style.display = !jsCatch.status.paused ? 'block' : 'none';
    dialog.pause.style.display = !jsCatch.status.paused ? 'block' : 'none';

    if (!jsCatch.status.paused)
        jsCatch.pause();
    else
        jsCatch.resume();
};

// Event listeners
playFormEl.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const topEl = document.querySelector('.top');
    const bottomEl = document.querySelector('.bottom');

    topEl.style.display = 'block';
    bottomEl.style.display = 'block';
    dialog.container.style.display = 'none';
    dialog.play.style.display = 'none';
    document.body.classList.remove('overflow-hidden');

    jsCatch.play({
        name: formData.get('player-name'),
        length: 120,
        difficulty: formData.get('difficulty'),
    });
});

button.resume.addEventListener('click', () => {
    togglePause();
});

button.restart.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.reload();
    });
})

document.addEventListener('keydown', (ev) => {
    if (ev.repeat || ev.key !== 'Escape') return;

    togglePause();
});