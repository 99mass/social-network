package routes

import (
	"database/sql"
	"main/pkg/handler"
	"main/pkg/helper"
	"net/http"
)

func Route(db *sql.DB){
	http.HandleFunc("/register", helper.Middleware(handler.RegisterHandler(db)))
	http.HandleFunc("/login",helper.Middleware(handler.LoginHandler(db)))
}