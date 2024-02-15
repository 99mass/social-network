package models

type Group struct {
	ID          string `db:"id" json:"id"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	CreatorID   string `db:"creator_id" json:"creator_id"`
	CreatedAt   string `db:"created_at" json:"created_at"`
}
