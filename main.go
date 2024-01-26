package main

import (
	"log"
	"migration-cli/cmd"
	"os"
)

func main() {
	arg := os.Args[1:]
	if len(arg) > 2 || len(arg) == 1 {
		log.Println("length of arg not correct")
		return
	}
	if len(arg) == 2 {
		if arg[1] == "up" {
			cmd.MigrateUp()
		} else if arg[1] == "down" {
			cmd.MigrateDown()
		} else {
			log.Println("Error : this command is not available")
		}
		return
	}

}
