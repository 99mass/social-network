package main

import (
	"main/pkg/db/sqlite"
)

func main() {
	sqlite.MigrateUp()
	sqlite.MigrateDown()

}
