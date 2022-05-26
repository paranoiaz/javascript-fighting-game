class Player extends Sprite {

    constructor({ dimension, position, weapon, keys, image, sprites }) {
        super({ dimension, position, image });
        this.width = dimension.width;
        this.height = dimension.height;

        // offset used for positioning enemy weapon correctly
        this.weapon = {
            x: this.x,
            y: this.y,
            width: weapon.width,
            height: weapon.height,
            isAttacking: false,
            offset: {
                x: weapon.offset.x,
                y: weapon.offset.y
            },
            attack: () => {
                this.changeSprite("attack");
                this.weapon.isAttacking = true;
                setTimeout(() => {
                    this.weapon.isAttacking = false;
                }, 300);
            }
        };
        this.keys = keys;
        this.sprites = sprites;

        // jump counter used for double jumping mechanic
        this.health = 100;
        this.velX = 0;
        this.velY = 0;
        this.jumpCounter = 0;
        this.lastKey = "";

        // load images before drawing
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageUrl;
        }
    }

    update() {
        super.update();
        this.checkBoundaries();

        this.x += this.velX;
        this.y += this.velY;

        this.weapon.x = this.x + this.weapon.offset.x;
        this.weapon.y = this.y + this.weapon.offset.y;
    }

    checkBoundaries() {
        // check top, bottom, left and right boundaries
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velY = 0;
        }

        // once the bottom boundary is hit reset double jump cooldown
        if (this.y + this.height + this.velY > canvas.height) {
            this.velY = 0;
            this.jumpCounter = 0;
        }
        else {
            this.velY += GRAVITY;
            this.changeSprite("jump");
        }
    }

    changeSprite(spriteName) {
        // return if attack animation is in progress
        if (this.image === this.sprites.attack.image && this.framesIndex < this.sprites.attack.framesMax - 1) {
            return;
        }
        switch (spriteName) {
            case this.sprites.idle.name:
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesIndex = 0;
                }
                break;
            case this.sprites.run.name:
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesIndex = 0;
                }
                break;
            case this.sprites.jump.name:
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesIndex = 0;
                }
                break;
            case this.sprites.attack.name:
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.framesMax = this.sprites.attack.framesMax;
                    this.framesIndex = 0;
                }
                break;
        }
    }

    resetPlayer() {
        // once game is done, set all movement to still
        for (const key in this.keys) {
            this.keys[key].pressed = false;
        }
        this.changeSprite("idle");
    }
}