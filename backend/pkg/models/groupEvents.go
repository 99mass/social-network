package models

type GroupEvent struct {
	ID          string `db:"id" json:"id"`
	GroupID     string `db:"group_id" json:"group_id"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	DayTime     string `db:"day_time" json:"day_time"`
	CreatedBy string `db:"created_by" json:"created_by"`
}

type EventRequest struct {
	Event               GroupEvent `json:"event"`
	Group               Group      `json:"group"`
	User                User       `json:"user"`
	ParticipationStatus string     `json:"participation_status"`
	GoingCount          int        `json:"going_count"`
}
