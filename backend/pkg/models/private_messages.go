package models

// PrivateMessage represente un message privé entre utilisateurs
type PrivateMessages struct {
	ID          string `db:"id" json:"id"`
	SenderID    string `db:"sender_id" json:"sender_id"`
	RecipientID string `db:"recipient_id" json:"recipient_id"`
	Content     string `db:"content" json:"content"`
	CreatedAt   string `db:"created_at" json:"created_at"`
}

type RecentDiscussion struct {
	OtherUserID        string `json:"other_user_id"`
	OtherUserNickname string    `json:"other_user_nickname"`
	LastMessageTime    string `json:"last_message_time"`
	LastMessageContent string `json:"last_message_content"`
}
