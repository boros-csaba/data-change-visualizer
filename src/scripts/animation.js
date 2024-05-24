import "../styles/styles.scss";
import fontUrl from "../assets/helvetiker_regular.typeface.json";
import {
  Color,
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export class Animation {

  options = null;
  data = null;
  camera = null;

  cameraLeftMargin = 1;
  cameraTopMargin = -1;
  barThickness = 30;
  barMaxWidth = 300;
  barGap = 15;
  barAndLabelGap = 10;
  maxNrOfBarsToShow = 15;
  framesBetweenTimeChange = 20;

  scene = new Scene();
  renderer = new WebGLRenderer();
  loader = new FontLoader();
  font = null;

  isAnimationRunning = false;
  frame = 0;

  constructor(domElementId, data, options) {

    this.options = options;
    this.data = data;
    this.scene.background = new Color(0xffffff);
    this.camera = new OrthographicCamera(
      this.options.width / -2,
      this.options.width / 2,
      this.options.height / 2,
      this.options.height / -2,
      0.1,
      1000
    );
    this.camera.position.z = 2;
    this.camera.position.x = this.cameraLeftMargin;
    this.camera.position.y = this.cameraTopMargin;
    this.renderer.setSize(this.options.width, this.options.height);
    document.getElementById(domElementId).appendChild(this.renderer.domElement);
  }

  async startAnimation() {

    for (const item of this.data.items) {
      item.colorIndex = this.data.items.indexOf(item) % this.barColors.length;
    }
    
    await this.loader.loadAsync(fontUrl).then(font => this.font = font);

    this.isAnimationRunning = true;
    this.frame = 0;
    this.animate();

  }

  download(onDownloadComplete, downloadButtonId) {

    let canvas = document.querySelector('canvas');
    let videoStream = canvas.captureStream();
    let mediaRecorder = new MediaRecorder(videoStream, {mimeType: 'video/webm;codecs=h264'});
    mediaRecorder.start();
    this.startAnimation();

    videoStream.getVideoTracks()[0].requestFrame();
    var chunks = [];
    mediaRecorder.ondataavailable = function(e) {
      if (e.data) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function() {
      var blob = new Blob(chunks, { 'type' : 'video/webm;codecs=h264' });
      chunks = [];
        var videoURL = URL.createObjectURL(blob);
        const link = document.getElementById(downloadButtonId);
        link.href = videoURL;
        link.download = 'video.webm';
        link.dispatchEvent(new MouseEvent('click'), {
          bubbles: true,
          cancelable: true,
          view: window
        });
      };

    setTimeout(function () { 
      mediaRecorder.stop(); 
      onDownloadComplete();
    }, 5000); // todo calculate duration
  }

  stopAnimation() {
    this.isAnimationRunning = false;
  }

  clearScene() {
    for (const item of this.data.items) {
      this.scene.remove(item.bar);
    }
  }

  animate() {

    if (!this.isAnimationRunning) 
      return;

    requestAnimationFrame(() => this.animate());

    this.setBarsPosition();
    this.setBarsWidth();

    for (const item of this.data.items) {

      if (item.isVisible) {

        if (item.bar == null) {
          var geometry = new BoxGeometry(1, this.barThickness, 1);
          var material = new MeshBasicMaterial({ color: this.barColors[item.colorIndex] });
          item.bar = new Mesh(geometry, material);
          this.scene.add(item.bar);
        }

        if (item.label == null) {
          let textGeometry = new TextGeometry(item.name, {
            font: this.font,
            size: 12,
            height: 1,
          });
          let textMaterial = new MeshBasicMaterial({ color: 0x000000 });
          item.label = new Mesh(textGeometry, textMaterial);
          textGeometry.computeBoundingBox();
          console.log(textGeometry);
          item.label.position.x = -textGeometry.boundingBox.max.x - this.barMaxWidth / 2 - this.barAndLabelGap;
          item.labelYOffset = (this.barThickness - textGeometry.boundingBox.max.y) / 2 - 5;
          this.scene.add(item.label);
        }

        item.bar.position.x = item.positionX;
        item.bar.position.y = item.positionY;
        item.bar.scale.x = item.barScaleX;

        item.label.position.y = item.positionY - item.labelYOffset;

      }
      else {
        if (item.bar != null) {
          this.scene.remove(item.bar);
          item.bar = null;
        }
        if (item.label != null) {
          this.scene.remove(item.label);
          item.label = null;
        }
      }
      
    }

    this.renderer.render(this.scene, this.camera);
    this.frame++;
  }

  setBarsWidth() {
    let time = this.getTime();
    var maxValue = this.data.getMaxValue(time);

    for (const item in this.data.items) {
      let barWidth = (this.data.items[item].data[time] / maxValue) * this.barMaxWidth;

      if (time < this.data.timeLabels.length - 1) {
        let nextMaxValue = this.data.getMaxValue(time + 1);
        let nextBarWidth =
          (this.data.items[item].data[time + 1] / nextMaxValue) * this.barMaxWidth;
        var timeFrame = this.frame % this.framesBetweenTimeChange;
        barWidth =
          (timeFrame / this.framesBetweenTimeChange) * (nextBarWidth - barWidth) +
          barWidth;
      }

      this.data.items[item].barScaleX = barWidth;
    }
  }

  setBarsPosition() {
    let time = this.getTime();
    let barsAreaHeight = (this.barThickness + this.barGap) * this.maxNrOfBarsToShow;
    let barsAreaTop = barsAreaHeight / 2;
    let barsAreaBottom = -barsAreaHeight / 2;

    for (const item of this.data.items) {
      var sortOrder = this.data.getItemOrder(item.name, time);

      item.positionY =
        barsAreaTop - this.barThickness / 2 - sortOrder * (this.barThickness + this.barGap);
      item.positionX = item.barScaleX / 2 - this.barMaxWidth / 2;

      if (time < this.data.timeLabels.length - 1) {
        var nextSortOrder = this.data.getItemOrder(item.name, time + 1);
        var timeFrame = this.frame % this.framesBetweenTimeChange;

        item.positionY -=
          (timeFrame / this.framesBetweenTimeChange) *
          (nextSortOrder - sortOrder) *
          (this.barThickness + this.barGap);
      }

      item.isVisible = item.positionY >= barsAreaBottom;
    }
  }

  setNumberLabel() {

  }

  getTime() {
    let time = Math.floor(this.frame / this.framesBetweenTimeChange);
    if (time >= this.data.timeLabels.length) {
      this.stopAnimation();
      time = this.data.timeLabels.length - 1;
    }
    return time;
  }

  barColors = ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6", "#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0", "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"];

}