CREATE TABLE IF NOT EXISTS GroupEvents (
    id varchar PRIMARY KEY AUTOINCREMENT,
    group_id varchar,
    title TEXT NOT NULL,
    description TEXT,
    day_time DATETIME,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
);