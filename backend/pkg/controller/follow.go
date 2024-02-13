package controller

import (
	"database/sql"
	"fmt"
)

func FollowUser(db *sql.DB, followerID string, followingID string) error {
	query := `INSERT INTO followers (follower_id, following_id, status) VALUES (?, ?, ?)`
	_, err := db.Exec(query, followerID, followingID, "waiting")
	if err != nil {
		return fmt.Errorf("failed to follow user: %w", err)
	}
	return nil
}

func AccepRequestFollow(db *sql.DB, followerID string, followingID string) error {
	// Préparez la requête SQL pour mettre à jour la colonne status en 'accepted'
	query := `
		UPDATE followers
		SET status = 'accepted'
		WHERE follower_id = ? AND following_id = ?
	`

	// Exécutez la requête avec le followerID comme paramètre
	_, err := db.Exec(query, followerID, followingID)
	if err != nil {
		return fmt.Errorf("failed to accept follow request: %w", err)
	}

	return nil
}

func Decline(db *sql.DB, followerID string, followingID string) error {
		// Préparez la requête SQL pour supprimer la relation de suivi
		query := `
		DELETE FROM followers
		WHERE follower_id = ? AND following_id = ?;
	`
	// Exécutez la requête avec les IDs de follower et follow comme paramètres
	_, err := db.Exec(query, followerID, followingID)
	if err != nil {
		return fmt.Errorf("failed to unfollow user: %w", err)
	}

	return nil
}
