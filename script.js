import Catch from "./Catch.js";

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const hpEl = document.getElementById('hp');
const progressEl = document.getElementById('progress');
const playFormEl = document.getElementById('play-form');

const dialog = {
    container: document.getElementById('dialog'),
    play: document.getElementById('play-dialog'),
    pause: document.getElementById('pause-dialog'),
}

const button = {
    resume: document.getElementById('btn-resume'),
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
});

const togglePause = () => {
    if (!jsCatch.status.started) return;

    dialog.container.style.display = !jsCatch.status.paused ? 'block' : 'none';
    dialog.pause.style.display = !jsCatch.status.paused ? 'block' : 'none';

    if (!jsCatch.status.paused)
        jsCatch.pause();
    else
        jsCatch.resume();
};

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

document.addEventListener('keydown', (ev) => {
    if (ev.repeat || ev.key !== 'Escape') return;

    togglePause();
})