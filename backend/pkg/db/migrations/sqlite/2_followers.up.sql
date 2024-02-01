CREATE TABLE IF NOT EXISTS followers (
    follower_id VARCHAR,
    following_id VARCHAR,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);