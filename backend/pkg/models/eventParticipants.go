package models

type EventParticipants struct {
	EventID string `db:"event_id" json:"event_id"`
	UserID  string `db:"user_id" json:"user_id"`
	Option  int    `db:"choosen_option" json:"choosen_option"`
}

type ParticipantRequest struct {
	EvenID string `json:"event_id"`
	UserID string `json:"user_id"`
	Option int    `json:"choosen_option"`
}
