CREATE TABLE IF NOT EXISTS group_members (
    group_id VARCHAR,
    user_id VARCHAR,
    is_creator BOOLEAN DEFAULT false,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);