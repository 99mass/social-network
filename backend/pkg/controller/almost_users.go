package controller

import (
	"backend/pkg/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
)

// CreateAlmostUser inserts a new models.Almost_Users record into the database.
func CreateAlmostUser(db *sql.DB, almostUser *models.Almost_Users) error {
	stmt, err := db.Prepare("INSERT INTO almost_users(post_id, user_id, authorize_users) VALUES(?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(almostUser.Post_id, almostUser.User_id, fmt.Sprintf("%v", almostUser.Authorize_User))
	return err
}

// ReadAlmostUser retrieves an models.Almost_Users record from the database by its ID.
func ReadAlmostUser(db *sql.DB, postID string, userID string) (*models.Almost_Users, error) {
	row := db.QueryRow("SELECT post_id, user_id, authorize_users FROM almost_users WHERE post_id = ? AND user_id = ?", postID, userID)

	var authorizeUser string
	almostUser := &models.Almost_Users{}
	err := row.Scan(&almostUser.Post_id, &almostUser.User_id, &authorizeUser)
	if err != nil {
		return nil, err
	}

	// Assuming authorize_user is stored as a JSON array in the database, parse it back into a slice of strings
	err = json.Unmarshal([]byte(authorizeUser), &almostUser.Authorize_User)
	if err != nil {
		log.Printf("Error parsing authorize_users: %v", err)
		return nil, err
	}

	return almostUser, nil
}

// UpdateAlmostUser updates an existing models.Almost_Users record in the database.
func UpdateAlmostUser(db *sql.DB, almostUser *models.Almost_Users) error {
	stmt, err := db.Prepare("UPDATE almost_users SET authorize_users = ? WHERE post_id = ? AND user_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(fmt.Sprintf("%v", almostUser.Authorize_User), almostUser.Post_id, almostUser.User_id)
	return err
}

// DeleteAlmostUser removes an models.Almost_Users record from the database by its ID.
func DeleteAlmostUser(db *sql.DB, postID string, userID string) error {
	stmt, err := db.Prepare("DELETE FROM almost_users WHERE post_id = ? AND user_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(postID, userID)
	return err
}
