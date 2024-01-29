CREATE TABLE IF NOT EXISTS GroupEvents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    day_time DATETIME,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
);