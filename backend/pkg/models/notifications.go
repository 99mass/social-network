package models

type Notification struct {
	ID        string
	UserID    string
	Type      string
	SourceID  string
	IsRead    bool
	CreatedAt string
}
