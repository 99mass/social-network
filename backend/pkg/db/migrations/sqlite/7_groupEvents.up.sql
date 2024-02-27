CREATE TABLE IF NOT EXISTS group_events (
    id VARCHAR PRIMARY KEY,
    group_id VARCHAR,
    title VARCHAR NOT NULL,
    description TEXT,
    day_time VARCHAR NOT NULL,
    created_by VARCHAR NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id)
    FOREIGN KEY (user_id) REFERENCES users(id)
);