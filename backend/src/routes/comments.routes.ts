import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";

const router = Router();

router.get("/", commentController.getComments);
router.get("/:id", commentController.getCommentById);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;