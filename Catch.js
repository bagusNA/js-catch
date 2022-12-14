class Catch {
    status = {
        started: false,
        running: false,
        paused: false,
        ended: false,
    }

    time = {
        start: null,
        current: null,
    };

    playerName;
    length = 60;
    score = 0;

    hp = {
        max: 100,
        current: 100,
        drain: 5,
        idleDrain: .025,
    };

    fruits = [];
    fruit = {
        asset: new Image(),
        size: 64,
        speed: 10,
        interval: 1000,
    }

    catcher = {
        asset: new Image(),
        posX: null,
        size: 128,
        offsetY: 100,
        dx: 12,
        leftBorder: null,
        rightBorder: null,
    }

    requestFrameId;

    constructor({ canvas, width, height = 'full', asset, scoreElement, hpElement, progressElement, timeElement, onGameOver }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.scoreElement = scoreElement;
        this.hpElement = hpElement;
        this.progressElement = progressElement;
        this.timeElement = timeElement;
        this.onGameOver = onGameOver;

        this.fruit.asset.src = asset.fruit;
        this.catcher.asset.src = asset.catcher;
    }

    play({name, length, difficulty = 'easy'}) {
        switch (difficulty) {
            case "easy": this.setEasyDiff();
                break;
            case "normal": this.setNormalDiff();
                break;
            case "hard": this.setHardDiff();
                break;
        }

        this.playerName = name;
        this.length = length;
        this.status = {
            ...this.status,
            started: true,
            running: true,
        };

        this.setup();
        this.main();
    }

    pause() {
        this.status = {
            ...this.status,
            running: false,
            paused: true,
        };
    }

    resume() {
        this.status = {
            ...this.status,
            running: true,
            paused: false,
        }
    }

    gameOver() {
        this.status = {
            ...this.status,
            running: false,
            ended: true,
        };

        cancelAnimationFrame(this.requestFrameId);
        this.saveToLeaderboard();

        // Game over hook
        this.onGameOver();
    }

    setup() {
        this.events();
        this.setSize();
        this.generateFruit();
    }

    main() {
        this.render(0);
    }

    render(timestamp) {
        this.requestFrameId = requestAnimationFrame((frameTimestamp) => this.render(frameTimestamp));

        if (!this.status.running) return;
        if (this.hp.current === 0)
            this.gameOver();

        this.time.current = timestamp;
        if (!this.time.start)
            this.time.start = Date.now();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFruits();
        this.drawCatcher();

        this.updateHp(-this.hp.idleDrain);
        this.updateTime();
    }

    drawFruits() {
        this.fruits.forEach((fruit) => {
            this.ctx.fillStyle = 'red'
            this.ctx.drawImage(
                this.fruit.asset,
                fruit.posX,
                fruit.posY,
                this.fruit.size,
                this.fruit.size,
            );

            if (
                fruit.posY >= this.canvas.height - this.catcher.offsetY - this.fruit.size / 2 &&
                fruit.centerX >= this.catcher.posX &&
                fruit.centerX <= this.catcher.rightBorder
            ) {
                this.increaseScore();
                this.fruits.shift();
            }
            else if (fruit.posY >= this.canvas.height) {
                this.increaseMiss();
                this.fruits.shift();
            }

            fruit.posY += this.fruit.speed;
        });
    }

    drawCatcher() {
        this.ctx.drawImage(
            this.catcher.asset,
            this.catcher.posX,
            this.canvas.height - this.catcher.offsetY,
            this.catcher.size,
            this.catcher.size
        );
    }

    events() {
        window.addEventListener('resize', () => {
            this.setSize();
        });

        document.addEventListener('keydown', (ev) => {
            if (!this.status.running) return;

            const localDx = ev.shiftKey ? this.catcher.dx * 2 : this.catcher.dx;

            if (
                ev.key === 'ArrowRight' &&
                this.catcher.posX < this.canvas.width - this.catcher.size
            ) {
                this.catcher.posX += localDx;
            }
            else if (ev.key === 'ArrowLeft' && this.catcher.posX > 0) {
                this.catcher.posX -= localDx;
            }

            this.calcCatcherBorder();
        });
    }

    generateFruit() {
        setInterval(() => {
            if (!this.status.running) return;

            const posX = this.randomInt(this.fruit.size, this.canvas.width - this.fruit.size * 2);

            this.fruits.push({
                posX,
                posY: 0 - this.fruit.size,
                centerX: this.getCenterX(posX, this.fruit.size, true),
            });
        }, this.fruit.interval);
    }

    setSize() {
        this.canvas.height = this.height === 'full'
                                ? window.innerHeight - 4
                                : this.height;

        this.canvas.width = this.width === 'full'
                                ? window.innerWidth
                                : this.width;

        this.catcher.posX = this.getCenterX(this.canvas.width / 2, this.catcher.size);
        this.calcCatcherBorder();
    }

    calcCatcherBorder() {
        this.catcher.rightBorder = this.catcher.posX + this.catcher.size;
    }

    increaseScore() {
        this.updateHp(5);

        this.score += 300;
        this.scoreElement.innerHTML = this.score.toString().padStart(8, '0');
    }

    increaseMiss() {
        this.updateHp(-this.hp.drain);
    }

    updateHp(value, isReassign = false) {
        const hpZone = [
            {
                hp: 25,
                className: 'danger'
            },
            {
                hp: 50,
                className: 'alert'
            },
        ];

        if (isReassign)
            this.hp.current = value;
        else
            this.hp.current += value;

        if (this.hp.current < 0)
            this.hp.current = 0;
        else if (this.hp.current > this.hp.max)
            this.hp.current = this.hp.max;

        hpZone.forEach(zone => {
            if (this.hp.current <= zone.hp && !this.hpElement.classList.contains(zone.className))
                this.hpElement.classList.add(zone.className);
            else if (this.hp.current > zone.hp && this.hpElement.classList.contains(zone.className))
                this.hpElement.classList.remove(zone.className);
        });

        this.hpElement.style.transform = `scaleX(${this.hp.current / 100})`;
    }

    updateTime() {
        const currentTimestamp = Math.floor(Date.now() - this.time.start);
        const offsetTime = new Date(currentTimestamp);
        const time = new Date(currentTimestamp + offsetTime.getTimezoneOffset() * 60000);

        const min = time.getMinutes();
        const sec = time.getSeconds();
        const ms = time.getMilliseconds();

        const formattedTime = {
            min: min.toString().padStart(2, '0'),
            sec: sec.toString().padStart(2, '0'),
            ms: ms.toString().padStart(3, '0'),
        };

        this.timeElement.innerHTML = `${formattedTime.min}:${formattedTime.sec}:${formattedTime.ms}`;
    }

    // Set difficulty
    setEasyDiff() {
        this.hp.drain = 5;
        this.hp.idleDrain = .02;
        this.fruit.interval = 1000;
        this.catcher.dx = 10;
    }

    setNormalDiff() {
        this.hp.drain = 7.5;
        this.hp.idleDrain = .025;
        this.fruit.interval = 750;
        this.catcher.dx = 14;
    }

    setHardDiff() {
        this.hp.drain = 10;
        this.hp.idleDrain = .035;
        this.fruit.interval = 450;
        this.catcher.dx = 18;
    }

    saveToLeaderboard() {
        let leaderboard = this.getLeaderboard() ?? [];

        if (!leaderboard) {
            localStorage.setItem('scores', JSON.stringify([]));
        }

        leaderboard.push({
            playerName: this.playerName,
            score: this.score,
        });

        // Sort descending
        leaderboard.sort((score1, score2) => score2.score - score1.score);

        localStorage.setItem('scores', JSON.stringify(leaderboard));
    }

    getLeaderboard(length = 0) {
        let leaderboard = JSON.parse(localStorage.getItem('scores'))

        if (length)
            leaderboard = leaderboard.slice(0, length);

        return leaderboard;
    }

    // Utilities
    getCenterX(posX, width, fromStart = false) {
        return fromStart ?
            posX + width / 2 :
            posX - width / 2;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * max - min) + min;
    }
}

export default Catch;