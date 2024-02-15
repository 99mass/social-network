package models

type CommentLikes struct{
	ID string `db:"id" json:"id"`
	UserID string `db:"user_id" json:"user_id"`
	CommentID string `db:"comment_id" json:"comment_id"`
	CreatedAt string `db:"created_at" json:"created_at"`
}