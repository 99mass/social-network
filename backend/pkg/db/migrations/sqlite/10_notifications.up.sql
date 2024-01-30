CREATE TABLE IF NOT EXISTS Notifications (
    id varchar PRIMARY KEY AUTOINCREMENT,
    user_id varchar,
    content TEXT NOT NULL,
    type TEXT CHECK(type IN ('follow_request', 'group_invite', 'group_join_request', 'group_event')),
    is_read BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);