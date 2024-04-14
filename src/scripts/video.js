
export function download() {

  stopAnimation();
  clearScene();
  startAnimation();

  let video = document.querySelector('video');
  let canvas = document.querySelector('canvas');
  let videoStream = canvas.captureStream();

  let mediaRecorder = new MediaRecorder(videoStream, {mimeType: 'video/webm;codecs=h264'});
  mediaRecorder.start();

  videoStream.getVideoTracks()[0].requestFrame();

  var chunks = [];
  mediaRecorder.ondataavailable = function(e) {
    if (e.data) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = function(e) {
    var blob = new Blob(chunks, { 'type' : 'video/webm;codecs=h264' });
    chunks = [];
      var videoURL = URL.createObjectURL(blob);
      video.src = videoURL;
    };
  
  setTimeout(function () { 
    mediaRecorder.stop(); 
    console.log("Stop")
  }, 5000);
}