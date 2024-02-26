-- CREATE TABLE IF NOT EXISTS group_events (
--     id VARCHAR PRIMARY KEY,
--     group_id VARCHAR,
--     title VARCHAR NOT NULL,
--     description TEXT,
--     day_time DATETIME NOT NULL,
--     FOREIGN KEY (group_id) REFERENCES groups(id)
-- );

-- Supprimer les colonnes option1_count et option2_count de la table group_events
ALTER TABLE group_events RENAME TO group_events_old;

CREATE TABLE group_events (
    id VARCHAR PRIMARY KEY,
    group_id VARCHAR,
    title VARCHAR NOT NULL,
    description TEXT,
    day_time DATETIME NOT NULL,
     FOREIGN KEY (group_id) REFERENCES groups(id)
    -- Aucune colonne option1_count et option2_count
);

INSERT INTO group_events (id, group_id, title, description, day_time)
SELECT id, group_id, title, description, day_time FROM group_events_old;

DROP TABLE group_events_old;