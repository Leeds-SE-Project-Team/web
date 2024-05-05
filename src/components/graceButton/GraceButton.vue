<template>
    <button id="button" class="ready" @click="clickButton">
        <div class="message submitMessage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12.2">
                <polyline stroke="currentColor" points="2,7.1 6.5,11.1 11,7.1 "></polyline>
                <line stroke="currentColor" x1="6.5" y1="1.2" x2="6.5" y2="10.3"></line>
            </svg>
            <span class="button-text">
              <span class="char0" style="--d:0ms; --dr:210ms;">P</span>
              <span class="char1" style="--d:30ms; --dr:180ms;">a</span>
              <span class="char2" style="--d:60ms; --dr:150ms;">y</span>
              <span class="char3" style="--d:90ms; --dr:120ms;"> </span>
              <span class="char4" style="--d:120ms; --dr:90ms;">N</span>
              <span class="char5" style="--d:150ms; --dr:60ms;">o</span>
              <span class="char6" style="--d:180ms; --dr:30ms;">w</span>
              <span class="char7" style="--d:210ms; --dr:0ms;">!</span>
            </span>
        </div>
        <div class="message loadingMessage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17">
                <circle class="loadingCircle" cx="2.2" cy="10" r="1.6"></circle>
                <circle class="loadingCircle" cx="9.5" cy="10" r="1.6"></circle>
                <circle class="loadingCircle" cx="16.8" cy="10" r="1.6"></circle>
            </svg>
        </div>
        <div class="message successMessage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11">
                <polyline stroke="currentColor" points="1.4,5.8 5.1,9.5 11.6,2.1 "></polyline>
            </svg>
            <span class="button-text">
              <span class="char0" style="--d:0ms; --dr:180ms;">S</span>
              <span class="char1" style="--d:30ms; --dr:150ms;">u</span>
              <span class="char2" style="--d:60ms; --dr:120ms;">c</span>
              <span class="char3" style="--d:90ms; --dr:90ms;">c</span>
              <span class="char4" style="--d:120ms; --dr:60ms;">e</span>
              <span class="char5" style="--d:150ms; --dr:30ms;">s</span>
              <span class="char6" style="--d:180ms; --dr:0ms;">s</span>
            </span>
        </div>
    </button>
    <canvas id="canvas" width="396" height="823"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
var disabled = false;
let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let ctx:any = null;
let button:any;
const props = defineProps<{
  callback?: ()=>Promise<void>
}>()
const clickButton = () => {
    if (!disabled) {
        disabled = true;
        render();
        // Loading stage
        button.classList.add('loading');
        button.classList.remove('ready');
        if(props.callback){
          props.callback().then(()=>{
              // Completed stage
              button.classList.add('complete');
              button.classList.remove('loading');
              initBurst();
              setTimeout(() => {
                  setTimeout(() => {
                      // Reset button so user can select it again
                      disabled = false;
                      button.classList.add('ready');
                      button.classList.remove('complete');
                  }, 1000);
              }, 1500);
          })
        }else{
          setTimeout(() => {
            // Completed stage
            button.classList.add('complete');
            button.classList.remove('loading');
            initBurst();
            setTimeout(() => {
                setTimeout(() => {
                    // Reset button so user can select it again
                    disabled = false;
                    button.classList.add('ready');
                    button.classList.remove('complete');
                }, 1000);
            }, 1500);
          }, 1800);
        }
        
    }
}
const confettiCount = 20;
const sequinCount = 10;
let confetti:any[] = [];
let sequins:any[] = [];
const colors = [
    { front: '#7b5cff', back: '#6245e0' }, // Purple
    { front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
    { front: '#5c86ff', back: '#345dd1' }  // Darker Blue
];
const randomRange = (min:any, max:any) => Math.random() * (max - min) + min;
class Confetto {
    randomModifier = randomRange(0, 99);
    color = colors[Math.floor(randomRange(0, colors.length))];
    dimensions = {
        x: randomRange(5, 9),
        y: randomRange(8, 15),
    };
    position = {
        x: randomRange(canvas.width / 2 - button.offsetWidth / 4, canvas.width / 2 + button.offsetWidth / 4),
        y: randomRange(canvas.height / 2 + button.offsetHeight / 2 + 8, canvas.height / 2 + (1.5 * button.offsetHeight) - 8),
    };
    rotation = randomRange(0, 2 * Math.PI);
    scale = {
        x: 1,
        y: 1,
    };
    velocity = initConfettoVelocity([-9, 9], [6, 11]);
    update() {
      // apply forces to velocity
      this.velocity.x -= this.velocity.x * dragConfetti;
      this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
      this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

      // set position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // spin confetto by scaling y and set the color, .09 just slows cosine frequency
      this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
  }
}
class Sequin {
    color = colors[Math.floor(randomRange(0, colors.length))].back
    radius = randomRange(1, 2)
    position = {
        x: randomRange(canvas.width / 2 - button.offsetWidth / 3, canvas.width / 2 + button.offsetWidth / 3),
        y: randomRange(canvas.height / 2 + button.offsetHeight / 2 + 8, canvas.height / 2 + (1.5 * button.offsetHeight) - 8),
    }
    velocity = {
        x: randomRange(-6, 6),
        y: randomRange(-8, -12)
    }
    update() {
      // apply forces to velocity
      this.velocity.x -= this.velocity.x * dragSequins;
      this.velocity.y = this.velocity.y + gravitySequins;

      // set position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  }
}
const initBurst = () => {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto());
    }
    for (let i = 0; i < sequinCount; i++) {
        sequins.push(new Sequin());
    }
}
onMounted(()=>{
button  = document.getElementById('button');
canvas = document.getElementById('canvas') as HTMLCanvasElement;
ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
})

// "physics" variables
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
const initConfettoVelocity = (xRange:any, yRange:any) => {
    const x = randomRange(xRange[0], xRange[1]);
    const range = yRange[1] - yRange[0] + 1;
    let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
    if (y >= yRange[1] - 1) {
        // Occasional confetto goes higher than the max
        y += (Math.random() < .25) ? randomRange(1, 3) : 0;
    }
    return { x: x, y: -y };
}

// draws the elements on the canvas
const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!disabled){
      return;
    }
    confetti.forEach((confetto) => {
        let width = (confetto.dimensions.x * confetto.scale.x);
        let height = (confetto.dimensions.y * confetto.scale.y);

        // move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        // update confetto "physics" values
        confetto.update();

        // get front or back fill color
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // draw confetto
        ctx.fillRect(-width / 2, -height / 2, width, height);

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // clear rectangle where button cuts off
        if (confetto.velocity.y < 0) {
            ctx.clearRect(canvas.width / 2 - button.offsetWidth / 2, canvas.height / 2 + button.offsetHeight / 2, button.offsetWidth, button.offsetHeight);
        }
    })

    sequins.forEach((sequin) => {
        // move canvas to position
        ctx.translate(sequin.position.x, sequin.position.y);

        // update sequin "physics" values
        sequin.update();

        // set the color
        ctx.fillStyle = sequin.color;

        // draw sequin
        ctx.beginPath();
        ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
        ctx.fill();

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // clear rectangle where button cuts off
        if (sequin.velocity.y < 0) {
            ctx.clearRect(canvas.width / 2 - button.offsetWidth / 2, canvas.height / 2 + button.offsetHeight / 2, button.offsetWidth, button.offsetHeight);
        }
    })

    // remove confetti and sequins that fall off the screen
    // must be done in seperate loops to avoid noticeable flickering
    confetti.forEach((confetto, index) => {
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
    });
    sequins.forEach((sequin, index) => {
        if (sequin.position.y >= canvas.height) sequins.splice(index, 1);
    });

    console.log('rendering')
    window.requestAnimationFrame(render);
}

// re-init canvas if the window size changes
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// resize listenter
window.addEventListener('resize', () => {
    resizeCanvas();
});
</script>

<style scoped>
@import "./style.css";
canvas {
  height: 100vh;
  pointer-events: none;
  position: fixed;
  left: 0;
  transform: translate(0, -50%);
  width: 100%;
  z-index: 2;
}

button {
  background: none;
  border: none;
  color: #f4f7ff;
  cursor: pointer;
  font-family: 'Roboto', Arial;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  /* left: 50%; */
  outline: none;
  overflow: hidden;
  padding: 0 10px;
  /* position: fixed; */
  position: relative;
  /* transform: translate(-50%, -50%); */
  width: 190px;
  z-index: 1;
}
button::before {
  background: #1f2335;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) inset;
  content: '';
  display: block;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transition: width 0.2s cubic-bezier(0.39, 1.86, 0.64, 1) 0.3s;
  width: 100%;
}

button.ready .submitMessage svg {
  opacity: 1;
  top: 1px;
  transition: top .4s ease 600ms, opacity .3s linear 600ms;
}
button.ready .submitMessage .button-text span {
  top: 0;
  opacity: 1;
  transition: all 0.2s ease calc(var(--dr) + 600ms);
}

button.loading::before {
  transition: width .3s ease;
  width: 80%;
}
button.loading .loadingMessage {
  opacity: 1;
}
button.loading .loadingCircle {
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-name: loading;
  cy: 10;
}

button.complete .submitMessage svg {
  top: -30px;
  transition: none;
}
button.complete .submitMessage .button-text span {
  top: -8px;
  transition: none;
}
button.complete .loadingMessage {
  top: 80px;
}
button.complete .successMessage .button-text span {
  left: 0;
  opacity: 1;
  transition: all 0.2s ease calc(var(--d) + 1000ms);
}
button.complete .successMessage svg {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset .3s ease-in-out 1.4s;
}

.button-text span {
  opacity: 0;
  position: relative;
}

.message {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.message svg {
  display: inline-block;
  fill: none;
  margin-right: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.submitMessage .button-text span {
  top: 8px;
  transition: all 0.2s ease var(--d);
}
.submitMessage svg {
  color: #5c86ff;
  margin-left: -1px;
  opacity: 0;
  position: relative;
  top: 30px;
  transition: top .4s ease, opacity .3s linear;
  width: 14px;
}

.loadingMessage {
  opacity: 0;
  transition: opacity 0.3s linear 0.3s, top 0.4s cubic-bezier(0.22, 0, 0.41, -0.57);
}
.loadingMessage svg {
  fill: #5c86ff;
  margin: 0;
  width: 22px;
}

.successMessage .button-text span {
  left: 5px;
  transition: all 0.2s ease var(--dr);
}
.successMessage svg {
  color: #5cffa1;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset .3s ease-in-out;
  width: 14px;
}

.loadingCircle:nth-child(2) {
  animation-delay: 0.1s;
}

.loadingCircle:nth-child(3) {
  animation-delay: 0.2s;
}
</style>