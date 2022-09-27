class Catch {
    score = 0;

    hp = {
        max: 100,
        current: 100,
        drain: 5
    };

    fruits = [];
    fruit = {
        asset: new Image(),
        size: 32,
    }

    catcher = {
        asset: new Image(),
        posX: null,
        size: 96,
        offsetY: 100,
        dx: 8,
        rightBorder: null,
    }

    constructor({ canvas, asset, scoreElement, hpElement, progressElement }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = scoreElement;
        this.hpElement = hpElement;
        this.progressElement = progressElement;

        this.catcher.posX = this.canvas.width / 2;

        this.fruit.asset.src = asset.fruit;
        this.catcher.asset.src = asset.catcher;

        this.catcher.rightBorder = this.catcher.posX + this.catcher.size;

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
        requestAnimationFrame(() => this.render());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFruits();
        this.drawCatcher();
    }

    drawFruits() {
        this.fruits.forEach((fruit, index) => {
            this.ctx.fillStyle = 'red'
            this.ctx.drawImage(
                this.fruit.asset,
                fruit.posX,
                fruit.posY,
                this.fruit.size,
                this.fruit.size,
            );

            if (
                fruit.posY >= this.canvas.height - this.catcher.offsetY &&
                fruit.posX >= this.catcher.posX &&
                fruit.posX <= this.catcher.rightBorder
            ) {
                this.increaseScore();
                this.fruits.shift();
            }
            else if (fruit.posY >= this.canvas.height)
               this.fruits.shift();

            this.fruits[index].posY += 10;
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
                this.catcher.rightBorder = this.catcher.posX + this.catcher.size;
            }
            else if (ev.key === 'ArrowLeft' && this.catcher.posX > 0) {
                this.catcher.posX -= localDx;
                this.catcher.rightBorder = this.catcher.posX + this.catcher.size;
            }
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
        this.canvas.height = window.innerHeight;
        this.catcher.posX = this.canvas.width / 2 - this.catcher.size / 2;
    }

    increaseScore() {
        if (this.hp.current <= this.hp.max - this.hp.drain)
            this.hp = this.hp.max;

        this.score += 300;
        this.scoreElement.innerHTML = this.score.toString().padStart(8, '0');
    }

    increaseMiss() {
        this.hp -= 10;
    }
}

export default Catch;