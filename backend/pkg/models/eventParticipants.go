package models

type EventParticipants struct{
	EventID string `db:"event_id" json:"event_id"`
	UserID string `db:"user_id" json:"user_id"`
	Option int `db:"option" json:"option"`
}