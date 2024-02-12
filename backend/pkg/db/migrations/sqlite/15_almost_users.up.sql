CREATE TABLE IF NOT EXISTS almost_users (
    post_id VARCHAR,
    user_id VARCHAR,
    authorize_users VARCHAR
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);