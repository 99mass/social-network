CREATE TABLE IF NOT EXISTS event_participants (
    event_id VARCHAR,
    user_id VARCHAR,
    chosen_option INTEGER, -- 1 for option1, 2 for option2
    -- availability BOOLEAN DEFAULT FALSE;
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES group_events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);