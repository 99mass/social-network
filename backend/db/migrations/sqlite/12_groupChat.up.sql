CREATE TABLE IF NOT EXISTS group_chat_messages (
    id VARCHAR PRIMARY KEY,
    group_id VARCHAR,
    user_id VARCHAR,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);