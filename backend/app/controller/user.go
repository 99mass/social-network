package controller

import (
	"backend/app/models"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gofrs/uuid"
)

func CreateUser(db *sql.DB, user models.User) (uuid.UUID, error) {
	query := `
        INSERT INTO users (id, email,password,firstname,lastname,dateofbirth, avatarpath, nickname, aboutme,ispublic,created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, user.AvatarPath, user.Nickname, user.AboutMe, true, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetPassword(db *sql.DB, userID uuid.UUID) (string, error) {
	query := `
		SELECT password
		FROM users
		WHERE id = ?
	`
	var password string
	err := db.QueryRow(query, userID.String()).Scan(&password)
	if err != nil {
		return "", errors.New("unable to get the password for this user" + err.Error())
	}
	return password, nil
}

func GetUserByNickName(db *sql.DB, nickname string) (uuid.UUID, error) {
	query := `
		SELECT id
		FROM users
		WHERE nickname = ?
	`
	var id string
	err := db.QueryRow(query, nickname).Scan(&id)
	if err != nil {
		return uuid.UUID{}, errors.New("there's no user for this nickname")
	}
	userID, err := uuid.FromString(id)
	if err != nil {
		return uuid.UUID{}, errors.New("incorrect uuid from database")
	}
	return userID, nil
}

func GetUserByEmail(db *sql.DB, email string) (uuid.UUID, error) {
	query := `
		SELECT id
		FROM users
		WHERE email = ?
	`
	var id string
	err := db.QueryRow(query, email).Scan(&id)
	if err != nil {
		return uuid.UUID{}, errors.New("there's no user for this email")
	}
	userID, err := uuid.FromString(id)
	if err != nil {
		return uuid.UUID{}, errors.New("incorrect uuid from database")
	}
	return userID, nil
}

func GetUserByID(db *sql.DB, userID uuid.UUID) (models.User, error) {
	var user models.User
	query := `
        SELECT *
        FROM users
        WHERE id = ?
    `
	err := db.QueryRow(query, userID).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.AvatarPath, &user.Nickname, &user.AboutMe, &user.IsPublic, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.User{}, errors.New("no user found with the provided ID")
		}
		return models.User{}, err
	}
	return user, nil
}

func IsDuplicateEmail(db *sql.DB, email string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM users
        WHERE email = ?;
    `

	var count int
	err := db.QueryRow(query, email).Scan(&count)
	if err != nil {
		return false, errors.New("")
	}
	if count > 0 {
		return true, errors.New("this email already exists")
	}

	return false, errors.New("")
}

func IsDuplicateNickname(db *sql.DB, nickname string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM users
        WHERE nickname = ? ;
    `

	var count int
	err := db.QueryRow(query, nickname).Scan(&count)
	if err != nil {
		return false, errors.New("")
	}
	if count > 0 {
		return true, errors.New("this nickname already exists choose another one")
	}

	return false, errors.New("")
}

func UpdateUser(db *sql.DB, user models.User) error {
	if user.Password == "" {
		query := `
        UPDATE users
        SET email = ?, firstname = ?, lastname = ?, dateofbirth = ?, avatarpath = ?, nickname = ?, aboutme = ?, ispublic = ?
        WHERE id = ?;
    `
		_, err := db.Exec(query, user.Email, user.FirstName, user.LastName, user.DateOfBirth, user.AvatarPath, user.Nickname, user.AboutMe, user.IsPublic, user.ID)
		return err
	}

	query := `
        UPDATE users
        SET email = ?, password = ?, firstname = ?, lastname = ?, dateofbirth = ?, avatarpath = ?, nickname = ?, aboutme = ?, ispublic = ?
        WHERE id = ?;
    `
	_, err := db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, user.AvatarPath, user.Nickname, user.AboutMe, user.IsPublic, user.ID)
	return err
}

func GetMyFriends(db *sql.DB, userId uuid.UUID) ([]models.User, error) {
	query := `
	WITH Discussions AS (
		SELECT sender_id, recipient_id
		FROM private_messages
		WHERE sender_id = $1 OR recipient_id = $1
	),
	DiscussionUsers AS (
		SELECT DISTINCT CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END AS user_id
		FROM Discussions
	)
	SELECT u.*, MAX(u.created_at) as last_message_timestamp
	FROM users u
	JOIN followers f1 ON (u.id = f1.following_id AND f1.follower_id = $1)
					   OR (u.id = f1.follower_id AND f1.following_id = $1)
	LEFT JOIN Discussions pm ON u.id = pm.sender_id OR u.id = pm.recipient_id
	GROUP BY u.id
	HAVING u.id IN (SELECT user_id FROM DiscussionUsers)
	
	UNION
	
	SELECT u.*, NULL as last_message_timestamp
	FROM users u
	JOIN followers f1 ON (u.id = f1.following_id AND f1.follower_id = $1 AND status="accepted")
					   OR (u.id = f1.follower_id AND f1.following_id = $1 AND status="accepted")
	LEFT JOIN Discussions pm ON u.id = pm.sender_id OR u.id = pm.recipient_id
	WHERE u.id NOT IN (SELECT user_id FROM DiscussionUsers)
	
	ORDER BY last_message_timestamp DESC, u.nickname ASC;	
	`
	rows, err := db.Query(query, userId.String())
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		var lastMessageTimestamp sql.NullString
		err := rows.Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.AvatarPath, &user.Nickname, &user.AboutMe, &user.IsPublic, &user.CreatedAt, &lastMessageTimestamp)
		if err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %w", err)
	}

	return users, nil
}


func GetUserNameByID(db *sql.DB, userID string) (string, error) {
	// Prepare the SQL query to get the user's name for a specific user ID.
	query := `
		SELECT firstname, lastname
		FROM users
		WHERE id = ?;
	`

	// Execute the query and retrieve the result.
	var firstName, lastName string
	err := db.QueryRow(query, userID).Scan(&firstName, &lastName)
	if err != nil {
		return "", fmt.Errorf("failed to query user name: %w", err)
	}

	// Combine the first name and last name to form the full name.
	fullName := fmt.Sprintf("%s %s", firstName, lastName)

	return fullName, nil
}