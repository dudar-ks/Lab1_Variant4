import { Router } from "express";
import * as postController from "../controllers/post.controller";

const router = Router();

router.get("/stats", postController.getPostStats);
router.get("/top-commented", postController.getTopCommentedPostsWithTopUsers);
router.get("/", postController.getPosts);
router.get("/:id/with-author", postController.getPostWithAuthor);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.get("/count", postController.getPostsCount);


export default router;