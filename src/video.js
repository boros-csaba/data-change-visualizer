// video recording stuff for later
// var video = document.querySelector('video');
// var videoStream = canvas.captureStream();
// var mediaRecorder = new MediaRecorder(videoStream);
// mediaRecorder.start();

// videoStream.getVideoTracks()[0].requestFrame();
var canvas = document.querySelector('canvas');
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