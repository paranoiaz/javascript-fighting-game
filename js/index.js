const GRAVITY = 0.7;
const SPEED = 6;
const JUMP = -20;
const DAMAGE = 10;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const background = new Sprite({
    dimension: {
        width: 1280,
        height: 720
    },
    position: {
        x: 0,
        y: 0
    },
    image: {
        url: "./assets/background.png",
        scale: 1,
        framesMax: 1,
        framesThreshold: 1,
        offset: {
            x: 0,
            y: 0
        }
    }
});
const player = new Player({
    dimension: {
        width: 50,
        height: 200
    },
    position: {
        x: 200,
        y: 100
    },
    weapon: {
        width: 350,
        height: 200,
        offset: {
            x: 0,
            y: 0
        }
    },
    keys: {
        a: {
            name: "a",
            pressed: false
        },
        d: {
            name: "d",
            pressed: false
        },
        w: {
            name: "w"
        },
        s: {
            name: "s"
        }
    },
    image: {
        url: "./assets/player_idle.png",
        scale: 5,
        framesMax: 10,
        framesThreshold: 10,
        offset: {
            x: -250,
            y: -200
        }
    },
    sprites: {
        idle: {
            name: "idle",
            imageUrl: "./assets/player_idle.png",
            framesMax: 10
        },
        run: {
            name: "run",
            imageUrl: "./assets/player_run.png",
            framesMax: 10
        },
        jump: {
            name: "jump",
            imageUrl: "./assets/player_jump.png",
            framesMax: 3
        },
        attack: {
            name: "attack",
            imageUrl: "./assets/player_attack.png",
            framesMax: 4
        }
    }
});
const enemy = new Player({
    dimension: {
        width: 50,
        height: 200
    },
    position: {
        x: 1000,
        y: 100
    },
    weapon: {
        width: 350,
        height: 200,
        offset: {
            x: -300,
            y: 0
        }
    },
    keys: {
        arrowleft: {
            name: "arrowleft",
            pressed: false
        },
        arrowright: {
            name: "arrowright",
            pressed: false
        },
        arrowup: {
            name: "arrowup"
        },
        arrowdown: {
            name: "arrowdown"
        }
    },
    image: {
        url: "./assets/enemy_idle.png",
        scale: 5,
        framesMax: 10,
        framesThreshold: 10,
        offset: {
            x: -300,
            y: -200
        }
    },
    sprites: {
        idle: {
            name: "idle",
            imageUrl: "./assets/enemy_idle.png",
            framesMax: 10
        },
        run: {
            name: "run",
            imageUrl: "./assets/enemy_run.png",
            framesMax: 10
        },
        jump: {
            name: "jump",
            imageUrl: "./assets/enemy_jump.png",
            framesMax: 3
        },
        attack: {
            name: "attack",
            imageUrl: "./assets/enemy_attack.png",
            framesMax: 4
        }
    }
});

let gameState = true;
let timer = 90;
let timerReference;

function addPlayerControls() {
    window.addEventListener("keydown", (event) => {
        if (!gameState) {
            player.resetPlayer();
            return;
        }
        switch (event.key.toLowerCase()) {
            case player.keys.a.name:
                player.keys.a.pressed = true;
                player.lastKey = event.key.toLowerCase();
                break;
            case player.keys.d.name:
                player.keys.d.pressed = true;
                player.lastKey = event.key.toLowerCase();
                break;
            case player.keys.w.name:
                if (player.jumpCounter < 2) {
                    player.velY = JUMP;
                    player.jumpCounter++;
                }
                break;
            case player.keys.s.name:
                player.weapon.attack();
                break;
        }
    });
    window.addEventListener("keyup", (event) => {
        switch (event.key.toLowerCase()) {
            case player.keys.a.name:
                player.keys.a.pressed = false;
                break;
            case player.keys.d.name:
                player.keys.d.pressed = false;
                break;
        }
    });
}

function addEnemyControls() {
    window.addEventListener("keydown", (event) => {
        if (!gameState) {
            enemy.resetPlayer();
            return;
        }
        switch (event.key.toLowerCase()) {
            case enemy.keys.arrowleft.name:
                enemy.keys.arrowleft.pressed = true;
                enemy.lastKey = event.key.toLowerCase();
                break;
            case enemy.keys.arrowright.name:
                enemy.keys.arrowright.pressed = true;
                enemy.lastKey = event.key.toLowerCase();
                break;
            case enemy.keys.arrowup.name:
                if (enemy.jumpCounter < 2) {
                    enemy.velY = JUMP;
                    enemy.jumpCounter++;
                }
                break;
            case enemy.keys.arrowdown.name:
                enemy.weapon.attack();
                break;
        }
    });
    window.addEventListener("keyup", (event) => {
        switch (event.key.toLowerCase()) {
            case enemy.keys.arrowleft.name:
                enemy.keys.arrowleft.pressed = false;
                break;
            case enemy.keys.arrowright.name:
                enemy.keys.arrowright.pressed = false;
                break;
        }
    });
}

function checkWinner() {
    const gameText = document.querySelector("#gameText");
    if (player.health > enemy.health) {
        gameText.innerHTML = "PLAYER RED WINS";
    }
    else if (player.health < enemy.health) {
        gameText.innerHTML = "PLAYER BLUE WINS";
    }
    else {
        gameText.innerHTML = "TIE";
    }

    gameText.style.display = "flex";
    gameState = false;
    clearTimeout(timerReference);
}

function checkCollision(area, targetArea) {
    return area.weapon.x + area.weapon.width > targetArea.x &&
        area.weapon.x < targetArea.x + targetArea.width &&
        area.weapon.y + area.weapon.height > targetArea.y &&
        area.weapon.y < targetArea.y + targetArea.height;
}

function checkMovement() {
    // change player and enemy sprite to idle if no x-axis velocity
    player.velX = 0;
    if (player.keys.a.pressed && player.lastKey === player.keys.a.name) {
        player.velX = -SPEED;
        player.changeSprite("run");
    }
    else if (player.keys.d.pressed && player.lastKey === player.keys.d.name) {
        player.velX = SPEED;
        player.changeSprite("run");
    }
    else {
        player.changeSprite("idle");
    }

    enemy.velX = 0;
    if (enemy.keys.arrowleft.pressed && enemy.lastKey === enemy.keys.arrowleft.name) {
        enemy.velX = -SPEED;
        enemy.changeSprite("run");
    }
    else if (enemy.keys.arrowright.pressed && enemy.lastKey === enemy.keys.arrowright.name) {
        enemy.velX = SPEED;
        enemy.changeSprite("run");
    }
    else {
        enemy.changeSprite("idle");
    }
}

function checkDamage() {
    if (checkCollision(player, enemy) && player.weapon.isAttacking && enemy.health > 0) {
        player.weapon.isAttacking = false;
        enemy.health -= DAMAGE;
        document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    }
    if (checkCollision(enemy, player) && enemy.weapon.isAttacking && player.health > 0) {
        enemy.weapon.isAttacking = false;
        player.health -= DAMAGE;
        document.querySelector("#playerHealth").style.width = `${player.health}%`;
    }
}

function runTimer() {
    if (timer <= 0) {
        checkWinner();
        return;
    }

    timer--;
    // keep reference to be able to disable timer when game ends
    timerReference = setTimeout(runTimer, 1000);
    document.querySelector("#gameTimer").innerHTML = timer;
}

function runLoop() {
    background.update();
    player.update();
    enemy.update();

    background.draw();
    player.draw();
    enemy.draw();

    checkMovement();
    checkDamage();

    if (player.health <= 0 || enemy.health <= 0) {
        checkWinner();
    }

    window.requestAnimationFrame(runLoop);
}

function main() {
    canvas.width = 1280;
    canvas.height = 720;

    addPlayerControls();
    addEnemyControls();

    runTimer();
    runLoop();
}

window.onload = () => {
    main();
};