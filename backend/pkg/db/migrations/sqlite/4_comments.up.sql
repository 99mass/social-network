CREATE TABLE IF NOT EXISTS Comments (
    id varchar PRIMARY KEY AUTOINCREMENT,
    post_id varchar,
    user_id varchar,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);