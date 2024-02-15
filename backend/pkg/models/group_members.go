package models

type Group_Members struct {
	GroupID   string `db:"group_id" json:"group_id"`
	UserID    string `db:"user_id" json:"user_id"`
	IsCreator bool   `db:"is_creator" json:"is_creator"`
}
