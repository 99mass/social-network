package main

import (
	"fmt"
	"log"
	"migration-cli/cmd"
	"os"
)

func main() {
	fmt.Println("migration-cli")
	arg := os.Args[1:]
	if len(arg) > 2 {
		fmt.Println("length de arg est superieur à 2")
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
	fmt.Println(arg)

}
