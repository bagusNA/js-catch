class Catch {
    score = 0;

    hp = {
        max: 100,
        current: 100,
        drain: 5,
        idleDrain: 1,
    };

    fruits = [];
    fruit = {
        asset: new Image(),
        size: 64,
        speed: 10,
    }

    catcher = {
        asset: new Image(),
        posX: null,
        size: 128,
        offsetY: 100,
        dx: 8,
        leftBorder: null,
        rightBorder: null,
    }

    requestFrameId;

    constructor({ canvas, asset, scoreElement, hpElement, progressElement }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = scoreElement;
        this.hpElement = hpElement;
        this.progressElement = progressElement;

        this.fruit.asset.src = asset.fruit;
        this.catcher.asset.src = asset.catcher;

        this.setup();
    }

    setup() {
        this.events();
        this.setSize();
        this.generateFruit();
    }

    main() {
        this.render();
    }

    render() {
        this.requestFrameId = requestAnimationFrame(() => this.render());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFruits();
        this.drawCatcher();
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
                fruit.posX >= this.catcher.leftBorder &&
                fruit.posX <= this.catcher.rightBorder
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
            console.log(this.catcher.posX)

        });
    }

    generateFruit() {
        setInterval(() => {
            this.fruits.push({
                posX: this.canvas.width / 2,
                posY: 0 - this.fruit.size,
            });
        }, 500);
    }

    setSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 4;
        this.catcher.posX = this.canvas.width / 2 - this.catcher.size / 4;
        this.calcCatcherBorder();
    }

    calcCatcherBorder() {
        this.catcher.leftBorder = this.catcher.posX - this.catcher.size / 4;
        this.catcher.rightBorder = this.catcher.posX + this.catcher.size;
    }

    increaseScore() {
        this.hp.current += 5;

        if (this.hp.current >= this.hp.max - this.hp.drain)
            this.hp.current = this.hp.max;

        this.hpElement.style.width = `calc(${this.hp.current / 100} * var(--width)`;
        this.score += 300;
        this.scoreElement.innerHTML = this.score.toString().padStart(8, '0');

    }

    increaseMiss() {
        this.hp.current -= 10;
        if (this.hp.current <= 0)
            this.hp.current = 0;

        this.hpElement.style.width = `calc(${this.hp.current / 100} * var(--width)`
    }
}

export default Catch;