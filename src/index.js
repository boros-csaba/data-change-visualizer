import { items } from './data.js';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

console.log('x');
console.log(items);

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( 700, 700 );
document.body.appendChild( renderer.domElement );

const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var canvas = document.querySelector('canvas');
var video = document.querySelector('video');
var videoStream = canvas.captureStream();
var mediaRecorder = new MediaRecorder(videoStream);
mediaRecorder.start();

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
    videoStream.getVideoTracks()[0].requestFrame();
}

animate();



var chunks = [];
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
  console.log("Data available")
};

mediaRecorder.onstop = function(e) {
  var blob = new Blob(chunks, { 'type' : 'video/mp4' });
  chunks = [];
    var videoURL = URL.createObjectURL(blob);
    video.src = videoURL;
  };
  

setTimeout(function () { 
  mediaRecorder.stop(); 
  console.log("Stop")
}, 5000);