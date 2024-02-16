package models

type Group_Invitations struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id"`
	GroupID   string `db:"group_id" json:"group_id"`
	SenderID  string `db:"sender_id" json:"sender_id"`
	Status    string `db:"status" json:"status"`
	CreatedAt string `db:"created_at" json:"created_at"`
	UpdatedAt string `db:"updated_at" json:"updated_at"`
}
