package models

type UserJoinGroupInfo struct {
	UserID         string `json:"user_id"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	GroupID        string `json:"group_id"`
	UserAvartaPath string `db:"status" json:"image"`
}
