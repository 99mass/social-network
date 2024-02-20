package helper

import (
	"encoding/base64"
	"errors"
	"io/ioutil"
)

func EncodeImageToBase64(imagePath string) (string, error) {
	data, err := ioutil.ReadFile(imagePath)
	if err != nil {
		return "", errors.New("enable to encode image" + err.Error())
	}

	encodedData := base64.StdEncoding.EncodeToString(data)
	return encodedData, nil
}
