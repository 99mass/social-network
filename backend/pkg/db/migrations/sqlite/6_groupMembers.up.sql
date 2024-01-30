CREATE TABLE IF NOT EXISTS GroupMembers (
    group_id varchar,
    user_id varchar,
    status TEXT CHECK(status IN ('invited', 'joined', 'requested')),
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);