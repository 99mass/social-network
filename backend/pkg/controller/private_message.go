package controller

import (
	"database/sql"
	"log"
	"sort"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreateMessage(db *sql.DB, message models.PrivateMessages) (uuid.UUID, error) {
	query := `
        INSERT INTO private_messages (id, sender_id, recipient_id, content, created_at)
        VALUES (?, ?, ?, ?, ?);
    `

	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}

	_, err = db.Exec(query, newUUID.String(), message.SenderID, message.RecipientID, message.Content, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}

	return newUUID, nil
}

func GetDiscussion(db *sql.DB, user1 uuid.UUID, user2 uuid.UUID) []models.PrivateMessages {
	var messages []models.PrivateMessages

	// Get all messages sent by user 1
	messages1 := getMessagesForUser(db, user1)
	// Get all messages sent by user 2
	messages2 := getMessagesForUser(db, user2)

	// Find messages sent to both users
	for _, m1 := range messages1 {
		if m1.RecipientID == user2.String() {
			messages = append(messages, m1)
		}
	}

	for _, m2 := range messages2 {
		if m2.RecipientID == user1.String() {
			messages = append(messages, m2)
		}
	}

	err := sortMessagesByCreatedAt(messages)
	if err != nil {
		log.Println("error lors du filtrage:", err.Error())
		return nil
	}

	return messages
}

func parseCreatedAt(createdAt string) (time.Time, error) {
	return time.Parse(time.RFC3339, createdAt)
}

// Trie le tableau de messages par CreatedAt
func sortMessagesByCreatedAt(messages []models.PrivateMessages) error {
	// Convertir et trier
	sort.Slice(messages, func(i, j int) bool {
		createdAtI, err := parseCreatedAt(messages[i].CreatedAt)
		if err != nil {
			return false
		}
		createdAtJ, err := parseCreatedAt(messages[j].CreatedAt)
		if err != nil {
			return false
		}
		return createdAtI.Before(createdAtJ)
	})
	return nil
}

func getMessagesForUser(db *sql.DB, userID uuid.UUID) []models.PrivateMessages {
	query := `
        SELECT id, sender_id, recipient_id, content, created_at
        FROM private_messages
        WHERE recipient_id = ?
        OR sender_id = ?;
    `

	rows, err := db.Query(query, userID.String(), userID.String())
	if err != nil {
		return []models.PrivateMessages{}
	}
	defer rows.Close()

	var messages []models.PrivateMessages
	for rows.Next() {
		var message models.PrivateMessages
		err := rows.Scan(&message.ID, &message.SenderID, &message.RecipientID, &message.Content, &message.CreatedAt)
		if err != nil {
			return []models.PrivateMessages{}
		}
		messages = append(messages, message)
	}

	return messages
}

func getNbrUnreadMessage(db *sql.DB, userID, senderID string) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM private_messages
		WHERE recipient_id = ? AND sender_id = ? AND read = false
	`
	var count int
	err := db.QueryRow(query, userID, senderID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

// GetRecentDiscussions retourne la liste des utilisateurs avec lesquels un utilisateur a discuté récemment,
// ainsi que le dernier message pour chaque discussion.
func GetRecentDiscussions(db *sql.DB, userID string) ([]models.RecentDiscussion, error) {
	query := `
		SELECT 
			CASE 
				WHEN sender_id = ? THEN recipient_id 
				ELSE sender_id 
			END AS other_user_id,
			MAX(created_at) AS last_message_time,
			content AS last_message_content
		FROM private_messages
		WHERE sender_id = ? OR recipient_id = ?
		GROUP BY other_user_id
		ORDER BY last_message_time DESC;
	`

	rows, err := db.Query(query, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var discussions []models.RecentDiscussion
	for rows.Next() {
		var discussion models.RecentDiscussion
		err := rows.Scan(&discussion.OtherUserID, &discussion.LastMessageTime, &discussion.LastMessageContent)
		if err != nil {
			return nil, err
		}

		// Récupérer le surnom de l'utilisateur à partir de la table des utilisateurs
		var otherUserNickname string
		err = db.QueryRow("SELECT nickname FROM users WHERE id = ?", discussion.OtherUserID).Scan(&otherUserNickname)
		if err != nil {
			return nil, err
		}
		discussion.OtherUserNickname = otherUserNickname

		discussions = append(discussions, discussion)
	}

	return discussions, nil
}