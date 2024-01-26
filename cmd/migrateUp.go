package cmd

import (
	"fmt"
	"migration-cli/database"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/file"
)

func MigrateUp() {

	fmt.Println("Running migrate up command")
	db := database.Open()

	dbDriver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		fmt.Printf("instance error: %v \n", err)
	}

	fileSource, err := (&file.File{}).Open("file://migrations")
	if err != nil {
		fmt.Printf("opening file error: %v \n", err)
	}

	m, err := migrate.NewWithInstance("file", fileSource, "myDB", dbDriver)
	if err != nil {
		fmt.Printf("migrate error: %v \n", err)
	}

	if err = m.Up(); err != nil {
		fmt.Printf("migrate up error: %v \n", err)
	}

	fmt.Println("Migrate up done with success")

}
