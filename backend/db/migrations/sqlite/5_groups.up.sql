CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    creator_id VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatarpath VARCHAR,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);