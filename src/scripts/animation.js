import "../styles/styles.scss";
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

  data = null;
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

    this.data = data;
    this.scene.background = new Color(0xffffff);
    this.camera.position.z = 2;
    this.camera.position.x = this.cameraLeftMargin;
    this.camera.position.y = this.cameraTopMargin;
    this.renderer.setSize(this.width, this.height);
    document.getElementById(domElementId).appendChild(this.renderer.domElement);

  }

  startAnimation() {

    for (const item of this.data.items) {
      var geometry = new BoxGeometry(1, this.barThickness, 1);
      var material = new MeshBasicMaterial({ color: 0x00ff00 });
      item.bar = new Mesh(geometry, material);
      this.scene.add(item.bar);
    }

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

    for (const item of this.data.items.filter((item) => item.bar != null)) {
      item.bar.position.x = item.positionX;
      item.bar.position.y = item.positionY;
      item.bar.scale.x = item.barScaleX;
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

      if (item.positionY < barsAreaBottom) {
        if (item.bar != null) {
          this.scene.remove(item.bar);
          item.bar = null;
        }
      }
      else if (item.bar === null) {
        var geometry = new BoxGeometry(1, this.barThickness, 1);
        var material = new MeshBasicMaterial({ color: 0x00ff00 });
        item.bar = new Mesh(geometry, material);
        this.scene.add(item.bar);
      }
    }
  }

  getTime() {
    let time = Math.floor(this.frame / this.framesBetweenTimeChange);
    if (time >= this.data.timeLabels.length) {
      this.stopAnimation();
      time = this.data.timeLabels.length - 1;
    }
    return time;
  }

}