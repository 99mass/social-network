package controller

import (
	"database/sql"
	"fmt"

	"github.com/gofrs/uuid"
)

func FollowUser(db *sql.DB, followerID uuid.UUID, followingID uuid.UUID) error {
	query := `INSERT INTO followers (follower_id, following_id) VALUES (?, ?)`
	_, err := db.Exec(query, followerID.String(), followingID.String())
	if err != nil {
		return fmt.Errorf("failed to follow user: %w", err)
	}
	return nil
}
