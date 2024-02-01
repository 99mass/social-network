CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    date_of_birth DATE NOT NULL,
    avatar_path VARCHAR,
    nickname VARCHAR,
    about_me TEXT,
    is_public BOOLEAN DEFAULT false
);