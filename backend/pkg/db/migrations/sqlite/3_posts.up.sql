CREATE TABLE IF NOT EXISTS Posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT NOT NULL,
    image_path TEXT,
    privacy TEXT CHECK(privacy IN ('public', 'private', 'almost_private')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);