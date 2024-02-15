package models

type Comment struct {
	ID        string `db:"id" json:"id"`
<<<<<<< HEAD
	UserID    string `db:"user_id" json:"user_id"`
	PostID    string `db:"post_id" json:"post_id"`
	Content   string `db:"content" json:"content"`
=======
	PostID    string `db:"post_id" json:"post_id"`
	UserID    string `db:"user_id" json:"user_id"`
	Content   string `db:"content" json:"content"`
	ImagePath string `db:"image_path" json:"image_path"`
>>>>>>> 4928cd2bf32f3162fe2be9a458c9f1ceed0bfbbb
	CreatedAt string `db:"created_at" json:"created_at"`
}
