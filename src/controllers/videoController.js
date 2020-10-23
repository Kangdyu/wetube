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
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  console.log(newVideo);
  // TODO: upload and save video
  res.redirect(routes.videoDetail(newVideo.id));
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
    res.redirect(routes.videoDetail(id));
  } catch (error) {
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
  } catch (error) {
    console.log(error);
  } finally {
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
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect(routes.videoDetail(vid));
  }
};
