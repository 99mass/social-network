CREATE TABLE IF NOT EXISTS group_events (
    id VARCHAR PRIMARY KEY,
    group_id VARCHAR,
    title VARCHAR NOT NULL,
    description TEXT,
    day_time DATETIME NOT NULL,
    option1_count INTEGER DEFAULT 0,
    option2_count INTEGER DEFAULT 0,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);