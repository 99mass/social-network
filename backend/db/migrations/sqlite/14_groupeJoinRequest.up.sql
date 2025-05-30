CREATE TABLE IF NOT EXISTS group_join_requests (
	id VARCHAR PRIMARY KEY,
	user_id VARCHAR,
	group_id VARCHAR,
	message TEXT,
	status VARCHAR NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (group_id) REFERENCES groups(id)
);