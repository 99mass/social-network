CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    content TEXT NOT NULL,
    image_path VARCHAR,
    privacy VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);