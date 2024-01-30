CREATE TABLE IF NOT EXISTS EventParticipants (
    event_id varchar,
    user_id varchar,
    response TEXT CHECK(response IN ('going', 'not_going')),
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES GroupEvents(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);