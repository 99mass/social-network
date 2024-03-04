package controller

import (
	"database/sql"
	"errors"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

// CreateGroupEvent crée un nouvel événement de groupe dans la base de données.
func CreateGroupEvent(db *sql.DB, event models.GroupEvent) (uuid.UUID, error) {
	query := `
		INSERT INTO group_events (id, group_id, title, description, day_time, created_by) 
		VALUES (?, ?, ?, ?, ?, ?)
	`
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}

	_, err = db.Exec(query, newUUID.String(), event.GroupID, event.Title, event.Description, event.DayTime, event.CreatedBy)
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

// GetEventsByGroupID récupère tous les événements d'un groupe spécifique.
func GetEventsByGroupID(db *sql.DB, groupID string) ([]models.GroupEvent, error) {
	query := `
		SELECT *
		FROM group_events 
		WHERE group_id = ?
	`
	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.GroupEvent
	for rows.Next() {
		var event models.GroupEvent
		err := rows.Scan(&event.ID, &event.GroupID, &event.Title, &event.Description, &event.DayTime, &event.CreatedBy)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

// GetGroupByEvent récupère le groupe associé à un événement spécifique.
func GetGroupByEvent(db *sql.DB, eventID string) (string, error) {
	query := `
		SELECT group_id 
		FROM group_events
		WHERE id = ?
	`
	var groupID string
	err := db.QueryRow(query, eventID).Scan(&groupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", nil
		}
		return "", err
	}
	return groupID, nil
}

// GetEventByID récupère un événement spécifique par son ID.
func GetEventByID(db *sql.DB, eventID string) (*models.GroupEvent, error) {
	query := `
		SELECT * 
		FROM group_events 
		WHERE id = ?
	`
	var event models.GroupEvent
	err := db.QueryRow(query, eventID).Scan(&event.ID, &event.GroupID, &event.Title, &event.Description, &event.DayTime, &event.CreatedBy)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &event, nil
}

// GetEventsByGroupWithCreatorInfo récupère les événements d'un groupe avec les informations de l'utilisateur qui les a créés.
func GetEventsByGroupWithCreatorInfo(db *sql.DB, groupID string) ([]models.EventRequest, error) {
	query := `
        SELECT group_events.*, users.nickname
        FROM group_events
        JOIN users ON group_events.created_by = users.id
        WHERE group_events.group_id = ?
		ORDER BY day_time ASC
    `
	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.EventRequest
	for rows.Next() {
		var event models.EventRequest
		err := rows.Scan(&event.Event.ID, &event.Event.GroupID, &event.Event.Title, &event.Event.Description, &event.Event.DayTime, &event.Event.CreatedBy, &event.User.Nickname)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}
