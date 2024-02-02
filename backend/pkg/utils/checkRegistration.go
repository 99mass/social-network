package utils

import (
	"database/sql"
	"errors"
	"main/pkg/controller"
	"regexp"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func CheckRegisterFormat(firstName, lastName, username, email, password, confirmPassword, dateofbirth string, db *sql.DB) (bool, error) {
	var errs string
	ok := true

	if !ConfirmPasswordsMatch(password, confirmPassword) {
		errs = "passwords does not match"
		return false, errors.New(errs)
	} else {
		okPassWord, errP := CheckPassword(password)
		if !okPassWord {
			return false, errP
		}
	}

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

func CheckEmail(email string) (bool, error) {

	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	match, _ := regexp.MatchString(emailRegex, email)
	if !match {
		return false, errors.New("invalid email format")
	}

	return match, nil
}

func CheckPassword(password string) (bool, error) {

	if len(password) < 8 || len(password) > 25 {

		return false, errors.New("invalid password length: minimum 8, maximum 25")
	}

	// Vérification des autres conditions avec des expressions régulières
	lowercaseRegex := regexp.MustCompile(`[a-z]`)
	uppercaseRegex := regexp.MustCompile(`[A-Z]`)
	digitRegex := regexp.MustCompile(`\d`)
	specialCharRegex := regexp.MustCompile(`[@$!%*?&_\-]`)

	if !lowercaseRegex.MatchString(password) {

		return false, errors.New("the password must contain at least one lower-case letter")
	}
	if !uppercaseRegex.MatchString(password) {

		return false, errors.New("the password must contain at least one capital letter")
	}
	if !digitRegex.MatchString(password) {

		return false, errors.New("the password must contain at least one digit")
	}
	if !specialCharRegex.MatchString(password) {

		return false, errors.New("the password must contain at least one special character")
	}

	return true, nil

}

func CheckUserName(username string) (bool, error) {
	// Cette expression exige que le pseudo ait entre 5 et 20 caractères alphanumériques.
	usernameRegex := `^[a-zA-Z0-9]{3,20}$`

	match, _ := regexp.MatchString(usernameRegex, username)

	if !match {
		return false, errors.New("invalid username format")
	}

	return match, nil

}

func CheckFLName(name string) (bool, error) {
	if len(name) > 20 {
		return false, errors.New("firstn name or last name can't be over than 20 caracter")
	} else if name == "" {
		return false, errors.New("first name or last name can't be empty")
	}
	return true, nil
}

// Cryptage du mot de passe
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// Confirmation du mot de passe lors de l'inscription d'uun nouveau client
func ConfirmPasswordsMatch(password, confirmPassword string) bool {
	return password == confirmPassword
}

func CheckDateOfBirth(dob string) (bool, error) {
	const maxAge = 100

	// Parse the date of birth string into a time.Time value
	layout := "02-01-2006" // Assuming the date is in the format "MM-DD-YYYY"
	parsedDOB, err := time.Parse(layout, dob)
	if err != nil {
		return false, errors.New("invalid date format")
	}

	// Calculate the earliest possible date of birth based on the maximum age
	now := time.Now()
	minDOB := now.AddDate(-10, 0, 0)
	maxDOB := now.AddDate(-maxAge, 0, 0)
	// Check if the parsed date of birth is after the minimum allowed date of birth
	if parsedDOB.After(now) {
		return false, errors.New("are you serious ? how ?? do you live in the future ??")
	}

	if parsedDOB.After(minDOB) {
		return false, errors.New("date of birth is too recent")
	}

	// Check if the parsed date of birth is before the minimum allowed date of birth
	if parsedDOB.Before(maxDOB) {
		return false, errors.New("date of birth is too old")
	}

	// If we reach this point, the date of birth is within the acceptable range
	return true, nil
}
