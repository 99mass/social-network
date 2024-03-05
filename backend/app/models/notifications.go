package models

type Notification struct {
	ID        string
	UserID    string
	Type      string
	SourceID  string
	SenderID  string
	IsRead    bool
	CreatedAt string
}
