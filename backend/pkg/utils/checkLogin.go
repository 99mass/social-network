package utils

import (
	"database/sql"
	"main/pkg/controller"

	"github.com/gofrs/uuid"
)

func CheckLogin(email, password string, db *sql.DB) (bool, uuid.UUID, error) {
	var userID uuid.UUID
	var err error

	okemail, _ := CheckEmail(email)

	if okemail {
		userID, err = controller.GetUserByEmail(db, email)
		if err != nil {
			return false, uuid.UUID{}, err
		}
		
	} else {
		userID, err = controller.GetUserByNickName(db, email)
		if err != nil {
			return false, uuid.UUID{}, err
		}
	}

	return true, userID, nil
}
