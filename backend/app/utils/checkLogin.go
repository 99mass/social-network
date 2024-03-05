package utils

import (
	"backend/app/controller"
	"backend/app/helper"
	"database/sql"
	"errors"

	"github.com/gofrs/uuid"
)

func CheckLogin(email, password string, db *sql.DB) (bool, uuid.UUID, error) {
	var userID uuid.UUID
	var err error

	okemail, err := CheckEmail(email)
	if err != nil {
		return false, uuid.UUID{}, err
	}

	if okemail {
		userID, err = controller.GetUserByEmail(db, email)
		if err != nil {
			return false, uuid.UUID{}, err
		}

	}
	//else {
	// 	userID, err = controller.GetUserByNickName(db, email)
	// 	if err != nil {
	// 		return false, uuid.UUID{}, err
	// 	}
	// }
	pass, err := controller.GetPassword(db, userID)
	if err != nil {
		return false, uuid.UUID{}, err
	}
	if !helper.CheckPasswordHash(password, pass) {
		return false, uuid.UUID{}, errors.New("password or login incorrect")
	}

	return true, userID, nil
}
