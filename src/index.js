import { items, timeLabels } from './data.js';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

let width = 700;
let height = 700;
let cameraLeftMargin = 1;

const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;
camera.position.x = cameraLeftMargin;

const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);



function init() {
  for (const item of items) {
    var geometry = new BoxGeometry( 1, 1, 1 );
    var material = new MeshBasicMaterial( { color: 0x00ff00 } );
    item.bar = new Mesh(geometry, material);
    scene.add(item.bar);
  }
}

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

init();
animate();