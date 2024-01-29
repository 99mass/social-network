package sqlite

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

func Open() *sql.DB {
	db, err := sql.Open("sqlite3", "database.db")

	if err != nil {
		log.Printf("Error Opening DB: %v \n", err)
	}

	err = db.Ping()
	if err != nil {
		log.Printf("Error Pinging DB: %v \n", err)
	}

	log.Println("Connected to db!")

	return db
}

func MigrateUp() {

	log.Println("Running migrate up command")
	db := Open()

	dbDriver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Printf("instance error: %v \n", err)
	}

	fileSource, err := (&file.File{}).Open("file://pkg/db/migrations/sqlite")
	if err != nil {
		log.Printf("opening file error: %v \n", err)
	}

	m, err := migrate.NewWithInstance("file", fileSource, "database.db", dbDriver)
	if err != nil {
		log.Printf("migrate error: %v \n", err)
	}

	if err = m.Up(); err != nil {
		log.Printf("migrate up error: %v \n", err)
	}

	log.Println("Migrate up done with success")

}

func MigrateDown() {

	log.Println("Running migrate down command")

	db := Open()

	dbDriver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Printf("instance error: %v \n", err)
	}

	fileSource, err := (&file.File{}).Open("file://pkg/db/migrations/sqlite")
	if err != nil {
		log.Printf("opening file error: %v \n", err)
	}

	m, err := migrate.NewWithInstance("file", fileSource, "database.db", dbDriver)
	if err != nil {
		log.Printf("migrate error: %v \n", err)
	}

	err = m.Down()
	if err != nil && err.Error() != "no change" {
		log.Printf("migrate down error: %v \n", err)
	}

	log.Println("Migrate down done with success")

}
