class Sprite {

    constructor({ dimension, position, image }) {
        this.width = dimension.width;
        this.height = dimension.height;
        this.x = position.x;
        this.y = position.y;

        // scale and position image correctly
        this.image = new Image();
        this.image.src = image.url;
        this.scale = image.scale;
        this.framesMax = image.framesMax;
        this.framesThreshold = image.framesThreshold;
        this.offset = image.offset;

        // keep index to current position in spritesheet
        this.framesIndex = 0;
        this.framesCounter = 0;
    }

    update() {
        // only switch sprite once every x amount of frames
        this.framesCounter++;
        if (this.framesCounter % this.framesThreshold !== 0) {
            return;
        }

        this.framesCounter = 0;
        if (this.framesIndex < this.framesMax - 1) {
            this.framesIndex++;
        }
        else {
            this.framesIndex = 0;
        }
    }

    draw() {
        const x = this.framesIndex * (this.image.width / this.framesMax);
        const y = 0;
        const width = this.image.width / this.framesMax;
        const height = this.image.height;
        const offsetX = this.x + this.offset.x;
        const offsetY = this.y + this.offset.y;
        const cropX = (this.image.width / this.framesMax) * this.scale;
        const cropY = this.image.height * this.scale;
        context.drawImage(this.image, x, y, width, height, offsetX, offsetY, cropX, cropY);
    }
}