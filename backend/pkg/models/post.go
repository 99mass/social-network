package models

type Post struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	GroupID   string `db:"group_id" json:"group_id"`
	Content   string `db:"content" json:"content"`
	ImagePath string `db:"image_path" json:"image_path"`
	Privacy   string `db:"privacy" json:"privacy"`
	CreatedAt string `db:"created_at" json:"created_at"`
}

