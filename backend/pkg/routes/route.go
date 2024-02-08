package routes

import (
	"backend/pkg/handler"
	"backend/pkg/helper"
	"database/sql"
	"net/http"
)

func Route(db *sql.DB) {
	http.HandleFunc("/register", helper.Middleware(handler.RegisterHandler(db)))
	http.HandleFunc("/login", helper.Middleware(handler.LoginHandler(db)))
	http.HandleFunc("/session", helper.Middleware(handler.CheckSessionHandler(db)))
}
