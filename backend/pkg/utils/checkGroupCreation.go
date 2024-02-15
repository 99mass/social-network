package utils

import (
	"errors"
)

func CheckGroup(title, description string) (bool, error) {

	ok := true

	okTitle, errT := CheckTitle(title)
	if !okTitle {
		return false, errT
	}

	okDescription, errDes := checkDescription(description)
	if !okDescription {
		return false, errDes
	}

	return ok, nil
}

func CheckTitle(title string) (bool, error) {

	// on exige que le title ait entre 5 et 20 caractères alphanumériques.
	match := (len(title) >= 5 && len(title) <= 20)

	if !match {
		return false, errors.New("invalid title format")
	}

	return match, nil

}

func checkDescription(description string) (bool, error) {

	match := (len(description) >= 5 && len(description) <= 40)
	if !match {
		return false, errors.New("invalid description format")
	}
	return match, nil
}
