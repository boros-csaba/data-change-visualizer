import "../styles/styles.scss";
import { addFileUploadEventListeners } from "./file-upload.js";
import { items, timeLabels, getItemOrder, getMaxValue } from "./data.js";
import {
  Color,
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

let width = 540;
let height = 960;
let cameraLeftMargin = 1;
let cameraTopMargin = -1;
let barThickness = 20;
let barMaxWidth = 200;
let barGap = 10;
let maxNrOfBarsToShow = 7;
let framesBetweenTimeChange = 30;

const scene = new Scene();
scene.background = new Color(0xffffff);
const camera = new OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  0.1,
  1000
);
camera.position.z = 2;
camera.position.x = cameraLeftMargin;
camera.position.y = cameraTopMargin;

const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.getElementById("render").appendChild(renderer.domElement);

let isAnimationRunning = false;
let frame = 0;
export function startAnimation() {
  addFileUploadEventListeners();

  // create bars
  for (const item of items) {
    var geometry = new BoxGeometry(1, barThickness, 1);
    var material = new MeshBasicMaterial({ color: 0x00ff00 });
    item.bar = new Mesh(geometry, material);
    scene.add(item.bar);
  }

  isAnimationRunning = true;
  frame = 0;
  animate();
}

export function stopAnimation() {
  isAnimationRunning = false;
}

export function clearScene() {
  for (const item of items) {
    scene.remove(item.bar);
  }
}

export function animate() {
  if (!isAnimationRunning) 
    return;

  requestAnimationFrame(animate);

  setBarsWidth();
  setBarsPosition();

  renderer.render(scene, camera);

  frame++;
}

function setBarsWidth() {
  let time = getTime();
  var maxValue = getMaxValue(time);

  for (const item in items) {
    let barWidth = (items[item].data[time] / maxValue) * barMaxWidth;

    if (time < timeLabels.length - 1) {
      let nextMaxValue = getMaxValue(time + 1);
      let nextBarWidth =
        (items[item].data[time + 1] / nextMaxValue) * barMaxWidth;
      var timeFrame = frame % framesBetweenTimeChange;
      barWidth =
        (timeFrame / framesBetweenTimeChange) * (nextBarWidth - barWidth) +
        barWidth;
    }

    items[item].bar.scale.x = barWidth;
  }
}

function setBarsPosition() {
  let time = getTime();
  let barsAreaHeight = (barThickness + barGap) * maxNrOfBarsToShow;
  let barsAreaTop = barsAreaHeight / 2;

  for (const item of items) {
    var sortOrder = getItemOrder(item.name, time);

    item.bar.position.y =
      barsAreaTop - barThickness / 2 - sortOrder * (barThickness + barGap);
    item.bar.position.x = item.bar.scale.x / 2 - barMaxWidth / 2;

    if (time < timeLabels.length - 1) {
      var nextSortOrder = getItemOrder(item.name, time + 1);
      var timeFrame = frame % framesBetweenTimeChange;

      item.bar.position.y -=
        (timeFrame / framesBetweenTimeChange) *
        (nextSortOrder - sortOrder) *
        (barThickness + barGap);
    }
  }
}

function getTime() {
  let time = Math.floor(frame / framesBetweenTimeChange);
  if (time >= timeLabels.length) {
    time = timeLabels.length - 1;
  }
  return time;
}
