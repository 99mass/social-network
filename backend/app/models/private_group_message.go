package models



type PrivateGroupeMessages struct {
	ID          string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	GroupID string `db:"group_id" json:"group_id"`
	Content     string `db:"content" json:"content"`
	CreatedAt   string `db:"created_at" json:"created_at"`
}