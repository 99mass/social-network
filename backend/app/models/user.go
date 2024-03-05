package models

import "github.com/gorilla/websocket"

type User struct {
	ID          string `db:"id" json:"id"`
	Email       string `db:"email" json:"email"`
	Password    string `db:"password" json:"-"`
	FirstName   string `db:"firstname" json:"firstname"`
	LastName    string `db:"lastname" json:"lastname"`
	DateOfBirth string `db:"dateofbirth" json:"dateofbirth"`
	AvatarPath  string `db:"avatarpath" json:"avatarpath"`
	Nickname    string `db:"nickname" json:"nickname"`
	AboutMe     string `db:"aboutme" json:"aboutme"`
	IsPublic    bool   `db:"ispublic" json:"ispublic"`
	CreatedAt   string `db:"createdat" json:"createdat"`
	IsOnline	bool
}

type UserConnected struct {
	Conn *websocket.Conn
	UserID string
}

type UserGroupConnected struct {
	Conn *websocket.Conn
	UserID string
	GroupID string
}
