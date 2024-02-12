package utils

import (
	"fmt"

	"github.com/gofrs/uuid"
)

func TextToUUID(inputText string) (uuid.UUID, error) {
	// Vérifier si la chaîne de texte est au format UUID
	uuidFromText, err := uuid.FromString(inputText)
	if err != nil {
		return uuid.UUID{}, fmt.Errorf("la chaîne de texte n'est pas au format UUID : %w", err)
	}

	return uuidFromText, nil
}
