CREATE TABLE IF NOT EXISTS comment_likes (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    is_liked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);