package utils

import "errors"

// ValidateContent verifie si le contenu respecte certaines regles
func ValidateContent(content string) error {
	if content == "" {
		return errors.New("content cannot be empty")
	}
	return nil
}

// TruncateCommentContent limite la taille du contenu du commentaire à  150 caractères.
func TruncateCommentContent(content string) string {
	const maxLength =  150
	if len(content) > maxLength {
		return content[:maxLength]
	}
	return content
}