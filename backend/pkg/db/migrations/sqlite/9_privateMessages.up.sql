CREATE TABLE IF NOT EXISTS PrivateMessages (
    id varchar PRIMARY KEY AUTOINCREMENT,
    sender_id varchar,
    recipient_id varchar,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (recipient_id) REFERENCES Users(id)
);