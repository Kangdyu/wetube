import "../scss/styles.scss";
import "./videoPlayer";
import "./videoRecorder";
import "./addComment";

function handleResize() {
  const videos = document.querySelectorAll(".video-block video");

  for (let video of videos) {
    const width = video.getBoundingClientRect().width;
    console.log(width);
    video.style.height = `${(9 / 16) * width}px`;
  }
}

handleResize();
window.addEventListener("resize", handleResize);
