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
	match := (len(title) >= 2 && len(title) <= 50)

	if !match {
		return false, errors.New("invalid title format: inférieur à 2 ou supérieur à 50 caractères")
	}

	return match, nil

}

func checkDescription(description string) (bool, error) {

	match := (len(description) >= 5 && len(description) <= 300)
	if !match {
		return false, errors.New("invalid description format: inférieur à 5 ou supérieur à 300 caractères")
	}
	return match, nil
}
