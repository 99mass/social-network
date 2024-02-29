package models

type Group struct {
	ID          string `db:"id" json:"id"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	CreatorID   string `db:"creator_id" json:"creator_id"`
	AvatarPath  string `db:"avatarpath" json:"avatarpath"`
	CreatedAt   string `db:"created_at" json:"created_at"`
}

type GroupInfos struct {
	ID                string `json:"id"`
	Title             string `json:"title"`
	AvatarPath        string `json:"avatarpath"`
	NbrMembers        int    `db:"nbr_members" json:"nbr_members"`
	Description       string `db:"description" json:"description"`
	IsMembers         bool   `json:"is_member"`
	IsJoinRequestSend bool   `json:"is_join_request"`
	CreatorID         string `db:"creator_id" json:"creator_id"`
}

type UsersNoInGroup struct {
	User                   User `json:"user"`
	IsInvited              bool `json:"isInvited"`
	IsUserSenderInvitation bool `json:"isUserSenderInvitation"`
}
