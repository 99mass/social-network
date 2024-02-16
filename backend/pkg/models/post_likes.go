package models

type PostLikes struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	PostID    string `db:"post_id" json:"post_id"`
	IsLiked   bool   `db:"is_liked" json:"is_liked"`
	CreatedAt string `db:"created_at" json:"created_at"`
}
