package helper

import (
	"backend/app/models"
	"encoding/json"
	"net/http"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func SendResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func SendResponseError(w http.ResponseWriter, Status string, Message string, StatusCode int) {
	SendResponse(w, models.ErrorResponse{
		Status:  Status,
		Message: Message,
	}, StatusCode)
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func NewNameForImage() string {
	newUUID, _ := uuid.NewV4()

	return newUUID.String()
}
