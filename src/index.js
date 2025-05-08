import { Ryu } from "./entities/fighters/Ryu.js"; 
import { Stage } from "./entities/Stage.js";
import { Dha } from "./entities/fighters/dha.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection, FighterState } from "./constants/fighter.js";

function populateMoveDropdown() {
    const dropdown = document.getElementById('state-dropdown');

    Object.entries(FighterState).forEach(([, value]) => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.innerText = value;
        dropdown.appendChild(option);
    }
);
}

function handleFormSubmit(event, fighters) {
    event.preventDefault();

    const selectedCheckboxes = Array
    .from(event.target.querySelectorAll('input:checked'))
    .map(checkbox => checkbox.value);

    const options = event.target.querySelector('select');

    fighters.forEach(fighter => {
        if (selectedCheckboxes.includes(fighter.name)) {
            fighter.changeState(options.value);
        }
    });
}

window.addEventListener('load', function() {
    populateMoveDropdown();
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;

    const fighters = [
        new Ryu(104, STAGE_FLOOR, FighterDirection.LEFT),
        new Dha(280,STAGE_FLOOR, FighterDirection.RIGHT),
    ];

    const entities = [
      new Stage(),
      ...fighters,
      new FpsCounter(),
    ]
    let frametime = {
        previous: 0,
        secondsPassed: 0,
    };
    function frame(time) { 
        window.requestAnimationFrame(frame);
        frametime = {
        secondsPassed: (time - frametime.previous) / 1000, 
        previous: time,
        }
       for (const entitity of entities) {
        entitity.update(frametime,context);
       }
       
       for (const entitity of entities) {
        entitity.draw(context); 
       }

        console.log(time);
    }

    this.document.addEventListener('submit',(event) => handleFormSubmit(event, fighters));

    window.requestAnimationFrame(frame);
});