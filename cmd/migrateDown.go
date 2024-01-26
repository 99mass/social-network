package cmd

import (
	"log"
	"migration-cli/database"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/file"
)

func MigrateDown() {

	log.Println("Running migrate down command")

	db := database.Open()

	dbDriver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Printf("instance error: %v \n", err)
	}

	fileSource, err := (&file.File{}).Open("file://migrations")
	if err != nil {
		log.Printf("opening file error: %v \n", err)
	}

	m, err := migrate.NewWithInstance("file", fileSource, "myDB", dbDriver)
	if err != nil {
		log.Printf("migrate error: %v \n", err)
	}

	err = m.Down()
	if err != nil && err.Error() != "no change" {
		log.Printf("migrate down error: %v \n", err)
	}

	log.Println("Migrate down done with success")

}
