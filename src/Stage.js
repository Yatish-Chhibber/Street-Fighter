const background = document.querySelector('img[alt="background"]');

export function drawBackground(context) {
    context.drawImage(background,0,0);
}