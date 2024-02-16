CREATE TABLE IF NOT EXISTS post_likes (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    is_liked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);