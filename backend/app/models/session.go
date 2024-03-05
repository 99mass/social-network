package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type Session struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	ExpiresAt time.Time
	CreatedAt time.Time
}

type SessionToSend struct {
	Value      uuid.UUID `json:"value"`
	Expiration time.Time `json:"expiration"`
}
