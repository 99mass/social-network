package models

import "time"

type GroupEvent struct {
	ID          string    `db:"id" json:"id"`
	GroupID     string    `db:"group_id" json:"group_id"`
	Title       string    `db:"title" json:"title"`
	Description string    `db:"description" json:"description"`
	DayTime     time.Time `db:"day_time" json:"day_time"`
}
