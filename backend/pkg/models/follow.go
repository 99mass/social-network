package models

type Follow struct {
	FollowerID string `db:"follower_id" json:"follower_id"`
	FollowingID string `db:"following_id" json:"following_id"`
	Status string `db:"status" json:"status"`
	
}

// CREATE TABLE IF NOT EXISTS followers (
//     follower_id VARCHAR,
//     following_id VARCHAR,
//     status VARCHAR,
//     PRIMARY KEY (follower_id, following_id),
//     FOREIGN KEY (follower_id) REFERENCES users(id),
//     FOREIGN KEY (following_id) REFERENCES users(id)
// );