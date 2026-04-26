import { Router } from "express";
import * as postController from "../controllers/post.controller";

const router = Router();

//  специфічні
router.get("/stats", postController.getPostStats);
router.get("/top-commented", postController.getTopCommentedPostsWithTopUsers);
router.get("/count", postController.getPostsCount);

//  базові
router.get("/", postController.getPosts);

//  вкладені
router.get("/:id/with-author", postController.getPostWithAuthor);

//  динамічні 
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;