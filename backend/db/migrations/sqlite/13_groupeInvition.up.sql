CREATE TABLE IF NOT EXISTS group_invitations (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    group_id VARCHAR,
    sender_id VARCHAR,
    status VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);