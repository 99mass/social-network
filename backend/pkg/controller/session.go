package controller

import (
	"database/sql"
	"backend/pkg/models"
	"time"

	"github.com/gofrs/uuid"
)

func CreateSession(db *sql.DB, session models.Session) (uuid.UUID, error) {
	query := `
        INSERT INTO sessions (id, user_id, expires_at,created_at)
        VALUES (?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), session.UserID, session.ExpiresAt, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetSessionByID(db *sql.DB, sessionID uuid.UUID) (models.Session, error) {
	var session models.Session
	query := `
        SELECT id, user_id, expires_at
        FROM sessions
        WHERE id = ?;
    `
	err := db.QueryRow(query, sessionID).Scan(&session.ID, &session.UserID, &session.ExpiresAt)
	if err != nil {
		return models.Session{}, err
	}
	return session, nil
}



func UpdateSessionExpiryTime(db *sql.DB, sessionID uuid.UUID) error {
    query := `
        UPDATE sessions
        SET expires_at = ?
        WHERE id = ?;
    `
    _, err := db.Exec(query, time.Now().Add(24 * time.Hour), sessionID)
    return err
}