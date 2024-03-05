CREATE TABLE IF NOT EXISTS private_messages (
    id VARCHAR PRIMARY KEY ,
    sender_id VARCHAR,
    recipient_id VARCHAR,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);