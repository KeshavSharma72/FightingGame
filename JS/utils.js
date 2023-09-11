function attackDetection({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        ) 
}

function determineWinner({player, enemy, timeId}) {
    clearTimeout(timeId);

    document.querySelector(".winner").style.display = "flex";
    
    if (player.health == enemy.health) {
        document.querySelector(".winner").innerText = "TIE";
    } else if (player.health > enemy.health) {
        document.querySelector(".winner").innerText = "P1 WINS";
    } else if (enemy.health > player.health) {
        document.querySelector(".winner").innerText = "P2 WINS";
    }
}

let timer = 60;
let timeId;
function decreaseTimer() {
    if (timer > -1) {
        timeId = setTimeout(decreaseTimer, 1000);
        document.querySelector(".timer").innerText = timer;
        timer--;
    }

    if (timer == -1) {
        determineWinner({player, enemy, timeId});
    }
}