import { Router } from "express";
import * as postController from "../controllers/post.controller";

const router = Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);

// linked data (JOIN)
router.get("/:id/with-author", postController.getPostWithAuthor);

router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;