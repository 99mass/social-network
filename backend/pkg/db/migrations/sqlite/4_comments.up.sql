CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR PRIMARY KEY ,
    post_id VARCHAR,
    user_id VARCHAR,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);