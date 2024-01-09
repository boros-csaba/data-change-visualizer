import { items, timeLabels } from './data.js';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

let width = 700;
let height = 700;
let cameraLeftMargin = 1;
let cameraTopMargin = -1;
let barThickness = 1;
let barMaxWidth = 10;
let barGap = 0.5;

const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;
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

  console.log(items)
}

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

init();
animate();