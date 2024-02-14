package controller

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreateGroup(db *sql.DB, group models.Group) (uuid.UUID, error) {
	query := `
        INSERT INTO groups (id, title, description, creator_id, created_at)
        VALUES (?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), group.Title, group.Description, group.CreatorID, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetGroupByID(db *sql.DB, groupID string) (models.Group, error) {
	var group models.Group
	query := `
        SELECT *
        FROM groups
        WHERE id = ?
    `
	err := db.QueryRow(query, group).Scan(&group.ID, &group.Title, &group.Description, &group.CreatorID, &group.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Group{}, errors.New("no group found with the provided ID")
		}
		return models.Group{}, err
	}
	return group, nil
}
