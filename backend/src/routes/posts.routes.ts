import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

// специфічні
router.get("/stats", requireAuth, requireRole("admin"), postController.getPostStats);
router.get("/top-commented", requireAuth, postController.getTopCommentedPostsWithTopUsers);
router.get("/count", requireAuth, requireRole("admin"), postController.getPostsCount);

// базові
router.get("/", requireAuth, postController.getPosts);

// вкладені
router.get("/:id/with-author", requireAuth, postController.getPostWithAuthor);

// динамічні
router.get("/:id", requireAuth, postController.getPostById);
router.post("/", requireAuth, postController.createPost);
router.put("/:id", requireAuth, postController.updatePost);
router.delete("/:id", requireAuth, postController.deletePost);

export default router;