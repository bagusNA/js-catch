import Catch from "./Catch.js";

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const hpEl = document.getElementById('hp');
const progressEl = document.getElementById('progress');

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

jsCatch.main();