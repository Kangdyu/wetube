import "../scss/styles.scss";
import "./videoPlayer";
import "./videoRecorder";
<<<<<<< HEAD
import "./addComment";
=======
>>>>>>> 4b291f08dd8aa3e4ef93bb44952a335b2a26bd27

window.addEventListener("load", () => {
  const videos = document.querySelectorAll(".video-block video");

  for (let video of videos) {
    const width = video.getBoundingClientRect().width;
    video.style.height = `${(9 / 16) * width}px`;
  }
});
