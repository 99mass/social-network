package controller

import (
	"database/sql"
	"errors"
	"main/pkg/models"
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
		return true, errors.New("email already exists")
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
		return true, errors.New("nickname already exists")
	}

	return false, errors.New("")
}