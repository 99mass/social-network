package helper

import (
	"database/sql"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/controller"
	"backend/pkg/models"
)

func AddSession(userID uuid.UUID, db *sql.DB) (uuid.UUID, error) {
	expiration := time.Now().Add(24 * time.Hour)
	if userID != uuid.Nil {
		session := models.Session{
			UserID:    userID,
			ExpiresAt: expiration,
			CreatedAt: time.Now(),
		}
		sessionID, err := controller.CreateSession(db, session) // You'll need to implement this function
		if err != nil {

			return uuid.Nil, err
		}
		return sessionID, nil

	}
	return uuid.Nil, nil
}
