package models

type CommentLikes struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	CommentID string `db:"comment_id" json:"comment_id"`
	IsLiked   bool   `db:"is_liked" json:"is_liked"`
	CreatedAt string `db:"created_at" json:"created_at"`
}
