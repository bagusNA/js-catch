import Catch from "./Catch.js";

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const hpEl = document.getElementById('hp');
const progressEl = document.getElementById('progress');
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
});


playFormEl.addEventListener('submit', (ev) => {
    const topEl = document.querySelector('.top');
    const bottomEl = document.querySelector('.bottom');

    // topEl.style.display = 'block';
    // bottomEl.style.display = 'block';
    // document.body.classList.remove('overflow-hidden');

    jsCatch.play({
        name: 'Budi',
        length: 120,
        difficulty: 'hard'
    });
});

// playAction();