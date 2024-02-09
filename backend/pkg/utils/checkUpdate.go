package utils

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"database/sql"
	"errors"

	"github.com/gofrs/uuid"
)

func CheckUpdateFormat(firstName, lastName, username, email, dateofbirth string, userID uuid.UUID, db *sql.DB) (bool, error) {
	ok := true

	okUserName, errUN := CheckUserName(username)
	if !okUserName {
		return false, errUN
	}

	okEmail, errE := CheckEmail(email)
	//fmt.Println("checkemail:",okEmail)
	if !okEmail {
		return false, errE
	} else {
		//fmt.Println("checking dupli")
		email, errdup := controller.IsDuplicateEmail(db, email)

		if email {
			return false, errdup
		}
		username, err := controller.IsDuplicateNickname(db, username)
		if username {
			return false, err
		}
	}
	okfirstName, err := CheckFLName(firstName)
	if !okfirstName {
		return false, err
	}
	oklastName, err := CheckFLName(firstName)
	if !oklastName {
		return false, err
	}

	okDateOfBirth, err := CheckDateOfBirth(dateofbirth)
	if !okDateOfBirth {
		return false, err
	}

	return ok, nil
}

func CheckUpdatePassword(password, newPassword string,userID uuid.UUID,db *sql.DB) (string,error) {
	if password != "" && newPassword != "" {
		pass, err := controller.GetPassword(db, userID)
		if err != nil {
			return "", err
		}
		if !helper.CheckPasswordHash(password, pass) {
			return "", errors.New("password incorrect")
		}
		okPassWord, errP := CheckPassword(newPassword)
		if !okPassWord {
			return "", errP
		}
		newPass,err := HashPassword(newPassword)
		if err != nil {
			return "",err
		}
		return newPass,nil
	}
	return "",nil
}
