CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
