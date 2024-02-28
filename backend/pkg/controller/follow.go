package controller

import (
	"database/sql"
	"fmt"
	"log"
	"time"
)

type Follow struct {
	FollowerID     string `db:"follower_id" json:"follower_id"`
	FollowingID    string `db:"following_id" json:"following_id"`
	CreatedAt      string `db:"created_at" json:"created_at"`
	UserFirstName  string `db:"firstname" json:"firstname"`
	UserLastName   string `db:"lastname" json:"lastname"`
	UserAvatarPath string `db:"avatarpath" json:"avatarpath"`
}

func FollowUser(db *sql.DB, followerID string, followingID string) error {
	// Vérifier si l'utilisateur suivant est public
	var isPublic bool
	err := db.QueryRow("SELECT ispublic FROM users WHERE id = ?", followingID).Scan(&isPublic)
	if err != nil {
		log.Println("Error checking user's public status:", err)
		return fmt.Errorf("failed to check user's public status: %w", err)
	}

	// Déterminer le statut du suivi en fonction de la valeur de ispublic
	status := "waiting"
	if isPublic {
		status = "accepted"
	}

	// Insérer le suivi avec le statut déterminé
	query := `INSERT INTO followers (follower_id, following_id, status, created_at) VALUES (?, ?, ?, ?)`
	_, err = db.Exec(query, followerID, followingID, status, time.Now())
	if err != nil {
		log.Println("Error inserting follow:", err)
		return fmt.Errorf("failed to follow user: %w", err)
	}
	return nil
}

func AccepRequestFollow(db *sql.DB, followerID string, followingID string) error {
	// Préparez la requête SQL pour mettre à jour la colonne status en 'accepted'
	query := `
		UPDATE followers
		SET status = 'accepted', created_at = ?
		WHERE follower_id = ? AND following_id = ? AND status = "waiting"
	`

	// Exécutez la requête avec le followerID comme paramètre
	_, err := db.Exec(query, time.Now(), followerID, followingID)
	if err != nil {
		log.Println("Error accepting")
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
	log.Println(followerID, "ing", followingID)
	_, err := db.Exec(query, followerID, followingID)
	if err != nil {
		log.Println("Error Declining follower request", err.Error())
		return fmt.Errorf("failed to unfollow user: %w", err)
	}

	return nil
}

// Get all follow requests that are on waiting state
// datas are follower_id, following_id, created_at, first_name, last_name, useravatar
func GetFollowRequestInfos(db *sql.DB, user string) ([]Follow, error) {
	query := `
		SELECT 
			f.follower_id,
			f.following_id,
			f.created_at,
			u.firstname,
			u.lastname,
			u.avatarpath
		FROM 
			followers f
		INNER JOIN 
			users u ON f.follower_id = u.id
		WHERE 
			f.following_id = $1
			AND f.status = 'waiting'
	`

	rows, err := db.Query(query, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followerList []Follow
	for rows.Next() {
		var follower Follow
		err := rows.Scan(
			&follower.FollowerID,
			&follower.FollowingID,
			&follower.CreatedAt,
			&follower.UserFirstName,
			&follower.UserLastName,
			&follower.UserAvatarPath,
		)
		if err != nil {
			return nil, err
		}
		followerList = append(followerList, follower)
	}

	return followerList, nil
}

// Get the informations of the followers you alrady accept
// Information include the following information like created_at, follower_id and following_id
func GetFollowerInfos(db *sql.DB, user string) ([]Follow, error) {
	query := `
		SELECT 
			f.follower_id,
			f.following_id,
			f.created_at,
			u.firstname,
			u.lastname,
			u.avatarpath
		FROM 
			followers f
		INNER JOIN 
			users u ON f.follower_id = u.id
		WHERE 
			f.following_id = $1
			AND f.status = 'accepted'
	`

	rows, err := db.Query(query, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followerList []Follow
	for rows.Next() {
		var follower Follow
		err := rows.Scan(
			&follower.FollowerID,
			&follower.FollowingID,
			&follower.CreatedAt,
			&follower.UserFirstName,
			&follower.UserLastName,
			&follower.UserAvatarPath,
		)
		if err != nil {
			return nil, err
		}
		followerList = append(followerList, follower)
	}

	return followerList, nil
}

// Get the informations of the users you are following
// Information include the following information like created_at, follower_id and following_id
func GetFollowingInfos(db *sql.DB, user string) ([]Follow, error) {
	query := `
		SELECT 
			f.follower_id,
			f.following_id,
			f.created_at,
			u.firstname,
			u.lastname,
			u.avatarpath
		FROM 
			followers f
		INNER JOIN 
			users u ON f.following_id = u.id
		WHERE 
			f.follower_id = $1
			AND f.status = 'accepted'
	`

	rows, err := db.Query(query, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followerList []Follow
	for rows.Next() {
		var follower Follow
		err := rows.Scan(
			&follower.FollowerID,
			&follower.FollowingID,
			&follower.CreatedAt,
			&follower.UserFirstName,
			&follower.UserLastName,
			&follower.UserAvatarPath,
		)
		if err != nil {
			return nil, err
		}
		followerList = append(followerList, follower)
	}

	return followerList, nil
}

// Get the oldest follow request that is on waiting status
// datas are follower_id, following_id, created_at, first_name, last_name, useravatar
func GetOldestFollowRequest(db *sql.DB, user string) (Follow, error) {
	query := `
		SELECT 
			f.follower_id,
			f.following_id,
			f.created_at,
			u.firstname,
			u.lastname,
			u.avatarpath
		FROM 
			followers f
		INNER JOIN 
			users u ON f.follower_id = u.id
		WHERE 
			f.following_id = $1
			AND f.status = 'waiting'
		ORDER BY 
			f.created_at ASC
		LIMIT 1
	`

	var follower Follow
	err := db.QueryRow(query, user).Scan(
		&follower.FollowerID,
		&follower.FollowingID,
		&follower.CreatedAt,
		&follower.UserFirstName,
		&follower.UserLastName,
		&follower.UserAvatarPath,
	)

	if err != nil {
		return Follow{}, err
	}

	return follower, nil
}

func IsFollowed(db *sql.DB, followerid, followingid string) (string, error) {
	if followerid == followingid {
		return "", nil
	}
	query := `
        SELECT status
        FROM followers
        WHERE follower_id = ? AND following_id = ?
    `
	var status string
	err := db.QueryRow(query, followerid, followingid).Scan(&status)
	if err != nil {
		if err == sql.ErrNoRows {
			return "Follow", nil
		}
		return "", err
	}
	if status == "accepted" {
		status = "Unfollow"
	} else {
		status = "Delete"
	}
	return status, nil
}

func AreUsersFriends(db *sql.DB, userID1 string, userID2 string) (bool, error) {
	// Check if userID1 is following userID2
	var status1 string
	err := db.QueryRow("SELECT status FROM followers WHERE follower_id = ? AND following_id = ?", userID1, userID2).Scan(&status1)
	if err != nil && err != sql.ErrNoRows {
		return false, fmt.Errorf("failed to check if user1 is following user2: %w", err)
	}

	// Check if userID2 is following userID1
	var status2 string
	err = db.QueryRow("SELECT status FROM followers WHERE follower_id = ? AND following_id = ?", userID2, userID1).Scan(&status2)
	if err != nil && err != sql.ErrNoRows {
		return false, fmt.Errorf("failed to check if user2 is following user1: %w", err)
	}

	// If both users are following each other and the status is "accepted", they are friends
	return status1 == "accepted" || status2 == "accepted", nil
}

// CountFollower compte le nombre de followers pour un utilisateur donné.
func CountFollowerReq(db *sql.DB, userID string) (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM followers WHERE following_id = $1 AND status = 'accepted'", userID).Scan(&count)
	if err != nil {
		log.Println("Error counting followers:", err)
		return 0, err
	}
	return count, nil
}
