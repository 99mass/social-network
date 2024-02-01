CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    dateofbirth DATE NOT NULL,
    avatarpath VARCHAR,
    nickname VARCHAR,
    aboutme TEXT,
    ispublic BOOLEAN DEFAULT false,
    created_at TIMESTAMP
);