CREATE TABLE IF NOT EXISTS Followers (
    follower_id INTEGER,
    following_id INTEGER,
    status TEXT CHECK(status IN ('pending', 'accepted', 'declined')),
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES Users(id),
    FOREIGN KEY (following_id) REFERENCES Users(id)
);