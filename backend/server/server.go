package main

import (
	"backend/app/routes"
	"backend/db/sqlite"
	"net/http"
)

var PORT = ":8080"

func main() {
	sqlite.MigrateUp()
	sqlite.MigrateDown()

	db := sqlite.Open()

	routes.Route(db)
	// fmt.Println("Listening in http://localhost" + PORT)

	http.ListenAndServe(PORT, nil)
}
