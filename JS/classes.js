class Sprite {
    constructor({position, imgSrc, scale = 1, framesMax = 1, offset = { x : 0, y : 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }
    draw() {
        c.drawImage(
            this.image, //refrence object
            this.framesCurrent *(this.image.width / this.framesMax) , //crop -> x
            0, //crop -> y
            this.image.width / this.framesMax, //crop -> width
            this.image.height, //crop -> height
            this.position.x+this.offset.x, //image coordinate -> x
            this.position.y+this.offset.y, //image coordinate -> y
            (this.image.width / this.framesMax)*this.scale, //image width
            this.image.height*this.scale //image height
        ); 
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold == 0) {
            if (this.framesCurrent < this.framesMax-1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Player extends Sprite {
    constructor({position, width = 50, velocity, color = 'red', imgSrc, scale = 1, framesMax = 1, offset = { x : 0, y : 0}, sprites, attackBox = {offset : {}, width : undefined, height : undefined}}) {
        super({position, imgSrc, scale , framesMax, offset});
        this.velocity = velocity;
        this.width = width;
        this.height = 150;
        this.lastKey;
        this.upCount = 0; //to avoid multiple jumps consecutively
        this.attackBox = {
            position : {
                x : this.position.x,
                y : this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.sprites = sprites;
        for(const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc
        }
        this.dead = false;
    }

    update() {
        //create characters
        this.draw();

        if(!this.dead) this.animateFrames();


        //attackBox positioning
        this.attackBox.position.x = this.position.x+this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y+this.attackBox.offset.y;

        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        //movements 
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Characters falling and jumping 
        if (this.position.y + this.height >= (canvas.height-100)) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.dead.image ) {
            if(this.framesCurrent == this.framesMax-1) this.dead = true;
            return;    
        }
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.framesMax-1) {
            return;
        }
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.framesMax-1) {
            return;
        }
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'dead':
                if (this.image !== this.sprites.dead.image) {
                    this.image = this.sprites.dead.image;
                    this.framesMax = this.sprites.dead.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        
        }
    }
}