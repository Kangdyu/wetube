const recordContainer = document.querySelector("#jsRecordContainer");
const recordBtn = document.querySelector("#jsRecordBtn");
const videoPreview = document.querySelector("#jsVideoPreview");

let videoRecorder;

function videoDataHandler(event) {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  // document.body.appendChild(link);
  link.click();
}

function startRecording(stream) {
  videoRecorder = new MediaRecorder(stream);
  videoRecorder.ondataavailable = videoDataHandler;
  videoRecorder.start();
  recordBtn.addEventListener("click", stopRecording);
}

function stopRecording() {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start recording";
}

async function getVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 720, height: 405 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = "Stop recording";
    startRecording(stream);
  } catch (error) {
    recordBtn.innerHTML = "Can't record :(";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
}

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recordContainer) {
  init();
}
