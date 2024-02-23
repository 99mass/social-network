package controller

import (
	"backend/pkg/models"
	"database/sql"
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

