import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { s3 } from "../middlewares";
import { format, formatDistance, subDays } from "date-fns";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 }).populate("creator");
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    req.flash("error", "비디오를 불러오는 데 문제가 발생했습니다.");
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    }).populate("creator");
  } catch (error) {
    req.flash("error", "검색 결과를 불러오는 데 문제가 발생했습니다.");
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;

  try {
    const newVideo = await Video.create({
      fileUrl: location,
      title,
      description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    req.flash("success", "비디오를 업로드하였습니다.");
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    req.flash("error", "비디오를 업로드하는 데 문제가 발생했습니다.");
    console.log(error);
    res.redirect(routes.home);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({ path: "comments", populate: { path: "creator" } });
    const now = new Date();
    const dateCalc = subDays(now, video.createdAt);
    let createdAt;
    if (dateCalc < 7) {
      createdAt = formatDistance(video.createdAt, new Date());
    } else {
      createdAt = format(video.createdAt, "yyyy. MM. dd.");
    }
    res.render("videoDetail", { pageTitle: video.title, video, createdAt });
  } catch (error) {
    req.flash("error", "비디오를 찾을 수 없습니다.");
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    }
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    req.flash("error", "비디오를 수정할 수 없습니다.");
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    req.flash("success", "비디오 정보가 수정되었습니다.");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    req.flash("error", "비디오를 수정할 수 없습니다.");
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    }
    const videoName = video.fileUrl.split("/videos/")[1];
    s3.deleteObject(
      {
        Bucket: "kangdyu-wetube",
        Key: `videos/${videoName}`,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log("Delete Video from S3", data);
      }
    );
    await Video.findOneAndRemove({ _id: id });
    req.flash("success", "비디오를 삭제했습니다.");
    res.redirect(routes.home);
  } catch (error) {
    req.flash("error", "비디오를 삭제할 수 없습니다.");
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    video.views++;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;

  let newComment;
  try {
    const video = await Video.findById(id);
    newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.json({ user, commentId: newComment.id });
  }
};

export const deleteComment = async (req, res) => {
  const {
    params: { vid, cid },
  } = req;

  try {
    const video = await Video.findById(vid);
    video.comments = video.comments.filter(
      (item) => item._id.toString() !== cid
    );
    video.save();
    req.flash("success", "댓글을 삭제했습니다.");
  } catch (error) {
    req.flash("error", "댓글을 삭제하는 데 문제가 발생했습니다.");
    console.log(error);
  } finally {
    res.redirect(routes.videoDetail(vid));
  }
};
