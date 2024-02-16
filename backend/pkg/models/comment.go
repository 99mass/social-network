package models

type Comment struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	PostID    string `db:"post_id" json:"post_id"`
	Content   string `db:"content" json:"content"`
	ImagePath string `db:"image_path" json:"image_path"`
	CreatedAt string `db:"created_at" json:"created_at"`
}

type Comment_Request struct {
	Comment       Comment   `json:"comment"`
}