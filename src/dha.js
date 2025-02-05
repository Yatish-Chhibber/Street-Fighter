const dha = document.querySelector('img[alt="dha"]');

const position = {
    x: 80,
    y: 110,
};

let velocity = -1;

export function updateDha(context) {
    position.x += velocity;

    if(position.x > context.canvas.width - dha.width || position.x < 0) {
        velocity = -velocity;
    }
}

export function drawDha(context) {
    context.drawImage(dha,position.x, position.y);
}