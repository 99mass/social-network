CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    type VARCHAR NOT NULL,
    -- e.g., 'follow_request', 'group_invitation'
    source_id VARCHAR,
    -- ID of the user/group generating the notification
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sender_id VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users(id) FOREIGN KEY (sender_id) REFERENCES users(id)
);