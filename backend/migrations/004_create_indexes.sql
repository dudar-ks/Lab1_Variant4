CREATE INDEX IF NOT EXISTS idx_posts_userId_createdAt
ON Posts(userId, createdAt);

CREATE INDEX IF NOT EXISTS idx_comments_postId
ON Comments(postId);