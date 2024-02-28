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

type Post_Request struct {
	Post        Post   `json:"post"`
	User        User   `json:"user"`
	IsFollowed  string `json:"is_followed"`
	IsLiked     bool   `json:"is_liked"`
	NbrLikes    int    `json:"nbr_likes"`
	NbrComments int    `json:"nbr_comments"`
	GroupName   string `json:"group_name"`
	GroupID     string `json:"group_id"`
}
