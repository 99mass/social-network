-- Table to store user sessions
CREATE TABLE IF NOT EXISTS Sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);