import { items, timeLabels, getItemOrder } from './data.js';
import { Scene, OrthographicCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

let width = 700;
let height = 700;
let cameraLeftMargin = 1;
let cameraTopMargin = -1;
let barThickness = 10;
let barMaxWidth = 100;
let barGap = 10;
let maxNrOfBarsToShow = 7;
let framesBetweenTimeChange = 30;

const scene = new Scene();
const camera = new OrthographicCamera(width/-2, width/2, height/2, height/-2, 0.1, 1000);
camera.position.z = 2;
camera.position.x = cameraLeftMargin;
camera.position.y = cameraTopMargin;

const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);



function init() {

  // create bars
  for (const item of items) {
    var geometry = new BoxGeometry(1, barThickness, 1);
    var material = new MeshBasicMaterial( { color: 0x00ff00 } );
    item.bar = new Mesh(geometry, material);
    scene.add(item.bar);
  }
}

let frame = 0;
function animate() {
	requestAnimationFrame(animate);

  setBarsWidth();
  setBarsPosition();

	renderer.render(scene, camera);

  frame++;
}

init();
animate();

function setBarsWidth() {
  let time = getTime();
  var maxValue = items.map(item => item.data[time]).reduce((a, b) => Math.max(a, b));
  for (const item in items) {
    let barWidth = (items[item].data[time] / maxValue) * barMaxWidth;
    items[item].bar.scale.x = barWidth;
  }
}

function setBarsPosition(){
  let time = getTime();
  let barsAreaHeight = (barThickness + barGap) * maxNrOfBarsToShow;
  let barsAreaTop = barsAreaHeight / 2;

  for (const item of items) {
    var sortOrder = getItemOrder(item.name, time);
    if (sortOrder >= maxNrOfBarsToShow) {
      item.bar.visible = false;
      continue;
    }

    item.bar.position.y = barsAreaTop - (barThickness / 2) - sortOrder * (barThickness + barGap);
    item.bar.position.x = item.bar.scale.x / 2 - barMaxWidth / 2;
    item.bar.visible = true;
  }
}

function getTime() {
  let time = Math.floor(frame / framesBetweenTimeChange);
  if (time >= timeLabels.length) {
    time = timeLabels.length - 1;
  }
  return time;
}