import axios from "axios";
import routes from "../../routes";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector("#jsCommentList");
const commentNumber = document.querySelector("#jsCommentNumber");

function increaseNumber() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

function addComment(comment, videoId, { user, commentId }) {
  const li = document.createElement("li");
  const userAvatarAnchor = document.createElement("a");
  const userAvatarImg = document.createElement("img");
  const commentDiv = document.createElement("div");
  const commentAuthorDiv = document.createElement("div");
  const commentAuthor = document.createElement("a");
  const commentDeleteBtn = document.createElement("a");
  const commentText = document.createElement("span");

  userAvatarAnchor.classList.add("comment__user-avatar");
  userAvatarAnchor.href = routes.userDetail(user._id);
  userAvatarImg.classList.add("user-avatar--small");
  userAvatarImg.src = user.avatarUrl;

  userAvatarAnchor.appendChild(userAvatarImg);

  commentDiv.classList.add("comment");
  commentAuthorDiv.classList.add("comment-author__container");
  commentAuthor.classList.add("comment-author");
  commentAuthor.href = routes.userDetail(user._id);
  commentAuthor.innerText = user.name;
  commentDeleteBtn.classList.add("comment-delete-btn");
  commentDeleteBtn.href = routes.deleteComment(videoId, commentId);
  commentDeleteBtn.innerText = "삭제";

  commentAuthorDiv.appendChild(commentAuthor);
  commentAuthorDiv.appendChild(commentDeleteBtn);

  commentText.classList.add("comment-text");
  commentText.innerText = comment;

  commentDiv.appendChild(commentAuthorDiv);
  commentDiv.appendChild(commentText);

  li.appendChild(userAvatarAnchor);
  li.appendChild(commentDiv);

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
    addComment(comment, id, response.data);
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
