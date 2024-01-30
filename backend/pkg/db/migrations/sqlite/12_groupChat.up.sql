-- Table to store group chat messages
CREATE TABLE IF NOT EXISTS GroupChat (
    id VARCHAR PRIMARY KEY AUTOINCREMENT,
    group_id VARCHAR,
    user_id VARCHAR,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);