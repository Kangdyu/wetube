const videoContainer = document.querySelector("#jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playButton = document.querySelector("#jsPlayButton");
const volumeButton = document.querySelector("#jsVolumeButton");
const fullScreenButton = document.querySelector("#jsFullScreenButton");
const currentTime = document.querySelector("#jsCurrentTime");
const totalTime = document.querySelector("#jsTotalTime");
const volumeRange = document.querySelector("#jsVolumeBar");

const registerView = () => {
  const id = window.location.href.split("/videos/")[1];
  fetch(`/api/${id}/view`, { method: "POST" });
};

function playHandler() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playButton.innerHTML = "<i class='fas fa-pause'></i>";
  } else {
    videoPlayer.pause();
    playButton.innerHTML = "<i class='fas fa-play'></i>";
  }
}

function muteHandler() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeButton.innerHTML = "<i class='fas fa-volume-up'></i>";
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeButton.innerHTML = "<i class='fas fa-volume-mute'></i>";
  }
}

function volumeHandler(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;

  if (value >= 0.7) {
    volumeButton.innerHTML = "<i class='fas fa-volume-up'></i>";
  } else if (value >= 0.4) {
    volumeButton.innerHTML = "<i class='fas fa-volume-down'></i>";
  } else if (value > 0) {
    volumeButton.innerHTML = "<i class='fas fa-volume-off'></i>";
  } else if (value == 0) {
    volumeButton.innerHTML = "<i class='fas fa-volume-mute'></i>";
  }
}

function doFullScreen() {
  videoContainer.requestFullscreen();
  fullScreenButton.innerHTML = "<i class='fas fa-compress'></i>";
  fullScreenButton.removeEventListener("click", doFullScreen);
  fullScreenButton.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
  document.exitFullscreen();
  fullScreenButton.innerHTML = "<i class='fas fa-expand'></i>";
  fullScreenButton.removeEventListener("click", exitFullScreen);
  fullScreenButton.addEventListener("click", doFullScreen);
}

function pad2(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

function formatDate(seconds) {
  const secondsNumber = parseInt(seconds, 10);
  const hours = Math.floor(secondsNumber / 3600);
  const minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  const totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours > 0) {
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(totalSeconds)}`;
  } else {
    return `${pad2(minutes)}:${pad2(totalSeconds)}`;
  }
}

function setCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
}

function videoEndHandler() {
  videoPlayer.currentTime = 0;
  playButton.innerHTML = "<i class='fas fa-play'></i>";
  registerView();
}

function init() {
  videoPlayer.volume = 0.5;

  playButton.addEventListener("click", playHandler);
  volumeButton.addEventListener("click", muteHandler);
  fullScreenButton.addEventListener("click", doFullScreen);
  videoPlayer.addEventListener("durationchange", setTotalTime);
  videoPlayer.addEventListener("timeupdate", setCurrentTime);
  videoPlayer.addEventListener("ended", videoEndHandler);
  volumeRange.addEventListener("input", volumeHandler);
}

if (videoContainer) {
  init();
}
