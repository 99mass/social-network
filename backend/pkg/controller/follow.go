package controller

import (
	"backend/pkg/models"
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

func GetRequestFollower(db *sql.DB, user string) ([]models.User, error) {
	var users []models.User

	// Requête SQL pour obtenir les demandes de suivi reçues par l'utilisateur
	query := `
		SELECT u.*
		FROM users u
		JOIN followers f ON u.id = f.follower_id
		WHERE f.following_id = ? AND f.status = 'waiting';
	`

	rows, err := db.Query(query, user)
	if err != nil {
		return nil, fmt.Errorf("failed to query follow requests: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.AvatarPath, &user.Nickname, &user.AboutMe, &user.IsPublic, &user.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row into User model: %w", err)
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during rows iteration: %w", err)
	}

	return users, nil
}

// func GetFollowInfos(db *sql.DB, userid string) models.Follow{

// }