package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"main/pkg/controller"
	"main/pkg/models"
	"net/http"
)

type RegisterRequest struct {
	Email       string    `json:"email"`
	Password    string    `json:"-"`
	FirstName   string    `json:"firstname"`
	LastName    string    `json:"lastname"`
	DateOfBirth string `json:"dateofbirth"`
	AvatarPath  string    `json:"avatarpath"`
	Nickname    string    `json:"nickname"`
	AboutMe     string    `json:"aboutme"`
}
func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			var registerReq RegisterRequest
			err := json.NewDecoder(r.Body).Decode(&registerReq)
			if err != nil {
				// TODO : Send error response 
			}
			user := models.User{
				Email: registerReq.Email,
				Password: registerReq.Password,
				FirstName: registerReq.FirstName,
				LastName: registerReq.LastName,
				DateOfBirth: registerReq.DateOfBirth,
				AvatarPath: registerReq.AvatarPath,
				Nickname: registerReq.Nickname,
				AboutMe: registerReq.AboutMe,
			}
			_,err = controller.CreateUser(db,user)
			if err != nil {
				log.Println("enable to create the user: ",err)
			}
			log.Println("user created succesfully")
		default:
			// TODO : send error response
			log.Println("methods not allowed")
		}
	}
}
