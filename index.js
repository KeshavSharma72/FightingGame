const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
//Black screen on which the game is played 
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);


const horizontalMvt = 3.5; //defines running speed 
const verticalMvt = 15; //defines falling speed
const damage = 10;                              

//gravity
const gravity = 0.5;

//Background
const background = new Sprite({
    position : {
        x : 0,
        y : 0
    },
    imgSrc : "./Images/background.png"
})

//Shop
const shop = new Sprite({
    position : {
        x : 610,
        y : 128
    },
    imgSrc : "./Images/shop.png",
    scale : 2.75,
    framesMax : 6
})

//PLAYER
const player = new Player({
    position : {
        x : 0,
        y : 0
    },
    velocity : {
        x : 0,
        y : 10
    },
    width : 60,
    imgSrc : "./Images/samuraiMack/Idle.png",
    scale : 2.75,
    framesMax : 8,
    offset : {
        x : -250,
        y : -190
    },
    sprites : {
        idle : {
            imgSrc : "./Images/samuraiMack/Idle.png",
            framesMax : 8
        },
        run : {
            imgSrc : "./Images/samuraiMack/Run.png",
            framesMax : 8
        },
        jump : {
            imgSrc : "./Images/samuraiMack/Jump.png",
            framesMax : 2
        },
        fall : {
            imgSrc : "./Images/samuraiMack/Fall.png",
            framesMax : 2
        },
        attack1 : {
            imgSrc : "./Images/samuraiMack/Attack1.png",
            framesMax : 6
        },
        takeHit : {
            imgSrc : "./Images/samuraiMack/Take Hit - white silhouette.png",
            framesMax : 4
        },
        dead : {
            imgSrc : "./Images/samuraiMack/Death.png",
            framesMax : 6
        },
    },
    attackBox : {
        offset : {
            x : 10,
            y : 0
        },
        width : 200,
        height : 50
    }
});

//ENEMY
const enemy = new Player({
    position : {
        x: 800,
        y: 0
    },
    velocity : {
        x : 0,
        y : 10
    },
    width : 30,
    color: 'blue',
    imgSrc : "./Images/kenji/Idle.png",
    scale : 2.75,
    framesMax : 4,
    offset : {
        x : -200,
        y : -210
    },
    sprites : {
        idle : {
            imgSrc : "./Images/kenji/Idle.png",
            framesMax : 4
        },
        run : {
            imgSrc : "./Images/kenji/Run.png",
            framesMax : 8
        },
        jump : {
            imgSrc : "./Images/kenji/Jump.png",
            framesMax : 2
        },
        fall : {
            imgSrc : "./Images/kenji/Fall.png",
            framesMax : 2
        },
        attack1 : {
            imgSrc : "./Images/kenji/Attack1.png",
            framesMax : 4
        },
        takeHit : {
            imgSrc : "./Images/kenji/Take hit.png",
            framesMax : 3
        },
        dead : {
            imgSrc : "./Images/kenji/Death.png",
            framesMax : 7
        },
    },
    attackBox : {
        offset : {
            x : -140,
            y : 0
        },
        width : 150,
        height : 50
    }
});

//Player controls
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },

//Enemy controls
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}


decreaseTimer();

//animate function to be recursively called
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //Player Movement
    player.velocity.x = 0;
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x =  -horizontalMvt;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = horizontalMvt;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    
    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    if (keys.w.pressed) {
        if (player.upCount === 0) {
            player.upCount = 1;
            setTimeout(()=> {
                player.upCount = 0;
            }, 800);
            player.velocity.y = -verticalMvt;
        }
    }

    //Enemy Movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x =  -horizontalMvt;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = horizontalMvt;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    if (keys.ArrowUp.pressed) {
        if (enemy.upCount === 0) {
            enemy.upCount = 1;
            setTimeout(()=> {
                enemy.upCount = 0;
            }, 800);
            enemy.velocity.y = -verticalMvt;
        }
    }

    //Attack detection 
    if (player.isAttacking && attackDetection({rectangle1 : player, rectangle2 : enemy}) && player.framesCurrent === 4) {
        player.isAttacking = false;
        enemy.health -= damage;
        gsap.to(".healthE", {
            width : enemy.health + "%"
        })
        if(enemy.health <= 0) {
            enemy.switchSprite('dead');
        } else enemy.switchSprite('takeHit');
    }
    if (player.isAttacking && player.framesCurrent == 4) {
        player.isAttacking = false;
    }

    if (enemy.isAttacking && attackDetection({rectangle1 : enemy, rectangle2 : player}) && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
        player.health -= damage;
        gsap.to(".healthP", {
            width : player.health + "%"
        })
        if(player.health <= 0) {
            console.log(player.health);
            player.switchSprite('dead');
        } else player.switchSprite('takeHit');
    }
    if (enemy.isAttacking && enemy.framesCurrent == 2) {
        enemy.isAttacking = false;
    }

    if (player.health == 0 || enemy.health == 0) {
        determineWinner({player, enemy, timeId});
    }
    
}
animate();

document.addEventListener('keydown', (event)=> {
    if (!player.dead) {
        switch(event.key) {
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'w':
                keys.w.pressed = true;
                break;
            case ' ':
                player.switchSprite('attack1');
                player.lastKey = 'space';
                player.isAttacking = true;
                break;
        }
    }

    //Enemy Movement
    if (!enemy.dead) {
        switch(event.key) {
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowUp':
                keys.ArrowUp.pressed = true;
                break;
            case 'ArrowDown':
                enemy.switchSprite('attack1');
                enemy.lastKey = 'ArrowDown';
                enemy.isAttacking = true;
                break;
        }
    }
})
document.addEventListener('keyup', (event)=> {
    switch(event.key) {
        //player movement
        case 'a':
            keys.a.pressed = false;
            break;
            case 'd':
                keys.d.pressed = false;
        break;
        case 'w':
                keys.w.pressed = false;
        break;

        //Enemy Movement
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})