import express from "express";
import routes from "../routes";
<<<<<<< HEAD
import {
  postRegisterView,
  postAddComment,
} from "../controllers/videoController";
=======
import { postRegisterView } from "../controllers/videoController";
>>>>>>> 4b291f08dd8aa3e4ef93bb44952a335b2a26bd27

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
<<<<<<< HEAD
apiRouter.post(routes.addComment, postAddComment);

=======
>>>>>>> 4b291f08dd8aa3e4ef93bb44952a335b2a26bd27
export default apiRouter;
