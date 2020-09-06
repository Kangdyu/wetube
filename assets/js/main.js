import "../scss/styles.scss";
import "./videoPlayer";

window.addEventListener("load", () => {
  const videos = document.querySelectorAll(".video-block video");

  for (let video of videos) {
    const width = video.getBoundingClientRect().width;
    video.style.height = `${(9 / 16) * width}px`;
  }
});
