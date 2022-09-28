class Catch {
    score = 0;

    hp = {
        max: 100,
        current: 100,
        drain: 5,
        idleDrain: .03,
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

        this.updateHp(-this.hp.idleDrain);
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
            const posX = this.getCenterX(this.canvas.width / 2, this.fruit.size)

            this.fruits.push({
                posX,
                posY: 0 - this.fruit.size,
                centerX: this.getCenterX(posX, this.fruit.size, true),
            });
        }, 250);
    }

    setSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 4;
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
        this.updateHp(-10);
    }

    updateHp(value, isReassign = false) {
        if (isReassign)
            this.hp.current = value;
        else
            this.hp.current += value;

        if (this.hp.current < 0)
            this.hp.current = 0;
        else if (this.hp.current > this.hp.max)
            this.hp.current = this.hp.max;

        this.hpElement.style.transform = `scaleX(${this.hp.current / 100})`;
    }

    // Utilities
    getCenterX(posX, width, fromStart = false) {
        return fromStart ?
            posX + width / 2 :
            posX - width / 2;
    }
}

export default Catch;