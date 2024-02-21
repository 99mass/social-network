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
