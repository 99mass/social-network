CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    dateofbirth VARCHAR NOT NULL,
    avatarpath VARCHAR,
    nickname VARCHAR,
    aboutme TEXT,
    ispublic BOOLEAN DEFAULT true,
    created_at TIMESTAMP
);