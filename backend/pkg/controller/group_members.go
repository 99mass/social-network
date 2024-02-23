package controller

import (
	"backend/pkg/models"
	"database/sql"
	"fmt"
	"log"
)

// CreateGroupMembers inserts a new models.Group_Members record into the database.
func CreateGroupMembers(db *sql.DB, groupMembers models.Group_Members) error {
	stmt, err := db.Prepare("INSERT INTO group_members(group_id, user_id, is_creator) VALUES(?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(groupMembers.GroupID, groupMembers.UserID, groupMembers.IsCreator)
	return err
}

func GetGroupMembers(db *sql.DB, groupId string) ([]models.User, error) {

	query := `
		SELECT u.*
		FROM users AS u
		JOIN group_members AS gm ON u.id = gm.user_id
		WHERE gm.group_id = ?;	
	`
	rows, err := db.Query(query, groupId)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User

		err := rows.Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.AvatarPath, &user.Nickname, &user.AboutMe, &user.IsPublic, &user.CreatedAt)
		if err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %w", err)
	}

	return users, nil
}

func CountGroupMembers(db *sql.DB, groupID string) (nbr int, err error) {
	// Préparez la requête SQL pour compter les membres du groupe
	query := `
        SELECT COUNT(*)
        FROM group_members
        WHERE group_id = ?
    `
	// Exécutez la requête et récupérez le nombre de membres
	err = db.QueryRow(query, groupID).Scan(&nbr)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, err
		}
		return 0, err
	}
	return nbr, nil
}

