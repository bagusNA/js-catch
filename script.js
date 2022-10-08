import Catch from "./Catch.js";

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const hpEl = document.getElementById('hp');
const progressEl = document.getElementById('progress');
const dialogEl = document.getElementById('dialog');
const playFormEl = document.getElementById('play-form');

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


playFormEl.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const topEl = document.querySelector('.top');
    const bottomEl = document.querySelector('.bottom');

    topEl.style.display = 'block';
    bottomEl.style.display = 'block';
    dialogEl.style.display = 'none';
    playFormEl.style.display = 'none';
    document.body.classList.remove('overflow-hidden');

    jsCatch.play({
        name: formData.get('player-name'),
        length: 120,
        difficulty: formData.get('difficulty'),
    });
});