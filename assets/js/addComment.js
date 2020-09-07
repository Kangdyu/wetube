import axios from "axios";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector("#jsCommentList");
const commentNumber = document.querySelector("#jsCommentNumber");

function increaseNumber() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

function addComment(comment) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
}

async function sendComment(comment) {
  const id = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${id}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
}

function submitHandler(event) {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
}

function init() {
  addCommentForm.addEventListener("submit", submitHandler);
}

if (addCommentForm) {
  init();
}
