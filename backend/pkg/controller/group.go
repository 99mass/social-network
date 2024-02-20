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
        INSERT INTO groups (id, title, description, creator_id, avartarpath, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), group.Title, group.Description, group.CreatorID, group.AvatarPath, time.Now())
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
	err := db.QueryRow(query, group).Scan(&group.ID, &group.Title, &group.Description, &group.CreatorID, &group.AvatarPath, &group.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Group{}, errors.New("no group found with the provided ID")
		}
		return models.Group{}, err
	}
	return group, nil
}

func IsMember(db *sql.DB, userID, groupID string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM group_members
        WHERE user_id = ? AND group_id = ?
    `
	var count int
	err := db.QueryRow(query, userID, groupID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func GetMyGroups(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user is a member of
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        INNER JOIN group_members m ON g.id = m.group_id
        WHERE m.user_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GroupsIManage(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user manages
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id
        WHERE g.creator_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GroupsToDiscover(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups that a user is not a member of
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id AND m.user_id = ?
        WHERE m.user_id IS NULL
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}
