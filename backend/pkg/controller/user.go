package controller

import (
	"database/sql"
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
	_, err = db.Exec(query, newUUID.String(), user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, user.AvatarPath, user.Nickname, user.AboutMe, false, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}
