package routes

import (
	"database/sql"
	"backend/pkg/handler"
	"backend/pkg/helper"
	"net/http"
)

func Route(db *sql.DB) {
	http.HandleFunc("/register", helper.Middleware(handler.RegisterHandler(db)))
	http.HandleFunc("/login", helper.Middleware(handler.LoginHandler(db)))
	http.HandleFunc("/session",helper.Middleware(handler.CheckSessionHandler(db)))
}
