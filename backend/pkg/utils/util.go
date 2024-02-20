package utils

import "errors"

// ValidateContent verifie si le contenu respecte certaines regles
func ValidateContent(content string) error {
	if content == "" {
		return errors.New("content cannot be empty")
	}
	return nil
}