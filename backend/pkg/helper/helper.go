package helper

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func SendResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
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

func ReadAndSaveImage(base64img, directory string) (string, error) {
	if base64img != "" {
		mimeType := strings.Split(base64img, ";")[0]
		mimeType = strings.TrimPrefix(mimeType, "data:")
		if mimeType != "image/jpeg" && mimeType != "image/png" {
			return "", errors.New("file format is not valid")
		}
		base64Data := base64img[strings.IndexByte(base64img, ',')+1:]
		img, err := base64.StdEncoding.DecodeString(base64Data)
		if err != nil {
			return "", errors.New("invalid base64 string of image")

		}
		imgSize := (float64(len(img)) / 1024.0) / 1024.0
		if imgSize > 20 {
			return "", errors.New("the size of image is bigger than 20ko")
		}
		name := NewNameForImage()
		if mimeType == "image/jpeg" {
			base64img = name + ".jpeg"
		}
		if mimeType == "image/png" {
			base64img = name + ".png"
		}

		_, err = os.Stat(directory)
		if os.IsNotExist(err) {
			errDir := os.MkdirAll(directory, 0755)
			if errDir != nil {
				return "", errors.New("we got an issue for avatar images")
			}
		} else if err != nil {
			return "", errors.New("we got an issue for avatar images")
		}
		err = os.WriteFile(directory+base64img, img, 0644)
		if err != nil {
			log.Println("error saving image: ", err.Error())
			return "", errors.New("failed to save avatar image")
		}
		return base64img, nil
	}
	return base64img, nil
}
