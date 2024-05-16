import "../styles/styles.scss";
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

export class Animation {

  width = 540;
  height = 960;
  cameraLeftMargin = 1;
  cameraTopMargin = -1;
  barThickness = 20;
  barMaxWidth = 200;
  barGap = 10;
  maxNrOfBarsToShow = 7;
  framesBetweenTimeChange = 30;

  scene = new Scene();
  renderer = new WebGLRenderer();

  isAnimationRunning = false;
  frame = 0;
  camera = new OrthographicCamera(
    this.width / -2,
    this.width / 2,
    this.height / 2,
    this.height / -2,
    0.1,
    1000
  );

  constructor(domElementId, data) {
    this.scene.background = new Color(0xffffff);
    this.camera.position.z = 2;
    this.camera.position.x = this.cameraLeftMargin;
    this.camera.position.y = this.cameraTopMargin;
    this.renderer.setSize(this.width, this.height);
    document.getElementById(domElementId).appendChild(this.renderer.domElement);
  }

  startAnimation() {

    for (const item of items) {
      var geometry = new BoxGeometry(1, this.barThickness, 1);
      var material = new MeshBasicMaterial({ color: 0x00ff00 });
      item.bar = new Mesh(geometry, material);
      this.scene.add(item.bar);
    }

    this.isAnimationRunning = true;
    this.frame = 0;
    this.animate();
  }

  stopAnimation() {
    this.isAnimationRunning = false;
  }

  clearScene() {
    for (const item of items) {
      this.scene.remove(item.bar);
    }
  }

  animate() {

    if (!this.isAnimationRunning) 
      return;

    requestAnimationFrame(() => this.animate());

    this.setBarsWidth();
    this.setBarsPosition();

    this.renderer.render(this.scene, this.camera);

    this.frame++;
  }

  setBarsWidth() {
    let time = this.getTime();
    var maxValue = getMaxValue(time);

    for (const item in items) {
      let barWidth = (items[item].data[time] / maxValue) * this.barMaxWidth;

      if (time < timeLabels.length - 1) {
        let nextMaxValue = getMaxValue(time + 1);
        let nextBarWidth =
          (items[item].data[time + 1] / nextMaxValue) * this.barMaxWidth;
        var timeFrame = this.frame % this.framesBetweenTimeChange;
        barWidth =
          (timeFrame / this.framesBetweenTimeChange) * (nextBarWidth - barWidth) +
          barWidth;
      }

      items[item].bar.scale.x = barWidth;
    }
  }

  setBarsPosition() {
    let time = this.getTime();
    let barsAreaHeight = (this.barThickness + this.barGap) * this.maxNrOfBarsToShow;
    let barsAreaTop = barsAreaHeight / 2;

    for (const item of items) {
      var sortOrder = getItemOrder(item.name, time);

      item.bar.position.y =
        barsAreaTop - this.barThickness / 2 - sortOrder * (this.barThickness + this.barGap);
      item.bar.position.x = item.bar.scale.x / 2 - this.barMaxWidth / 2;

      if (time < timeLabels.length - 1) {
        var nextSortOrder = getItemOrder(item.name, time + 1);
        var timeFrame = this.frame % this.framesBetweenTimeChange;

        item.bar.position.y -=
          (timeFrame / this.framesBetweenTimeChange) *
          (nextSortOrder - sortOrder) *
          (this.barThickness + this.barGap);
      }
    }
  }

  getTime() {
    let time = Math.floor(this.frame / this.framesBetweenTimeChange);
    if (time >= timeLabels.length) {
      time = timeLabels.length - 1;
    }
    return time;
  }

}