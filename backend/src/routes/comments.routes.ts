import { Router } from "express";
import * as commentController from "../controllers/comment.controller";

const router = Router();

router.get("/", commentController.getComments);
router.get("/:id", commentController.getCommentById);

// linked data
router.get("/post/:postId/users", commentController.getCommentsWithUsers);

router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;