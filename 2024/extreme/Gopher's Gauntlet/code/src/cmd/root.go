package e_cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/spf13/cobra"
)

type config struct {
	ConnectionStr       string `json:"connection_str"`
	MigrationsDir       string `json:"migrations_dir"`
	SeedsDir            string `json:"seeds_dir"`
	ChangelogCollection string `json:"changelog_collection"`
}

var rootCmd = &cobra.Command{
	Use:   "elemental",
	Short: "Your next gen MongoDB ODM",
	Long:  `Elemental is a user database ODM that allows you to interact with your database in a much more user friendly way than standard database drivers`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(`

Welcome to Elemental!.

------------------------------------		

Please run 'elemental --help' to see available commands.

If you encounter any issues, please report them at "https://github.com/go-elemental/elemental/issues"

------------------------------------`)
	},
}

func init() {
	rootCmd.AddCommand(migrateCmd)
	rootCmd.AddCommand(seedCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func readConfigFile() config {
	dir, _ := os.Getwd()
	configFilePath := dir + "/elemental.json"
	var conf config
	if _, err := os.Stat(configFilePath); os.IsNotExist(err) {
		log.Fatal("Config file not found. Please create a file named elemental.json in the root of your project")
	}
	file, _ := os.Open(configFilePath)
	defer file.Close()
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&conf)
	if err != nil {
		log.Fatal("Failed to read config file with error:", err)
	}
	if conf.ConnectionStr == "" {
		log.Fatal("Connection string is required in the config file")
	}
	if conf.MigrationsDir == "" {
		conf.MigrationsDir = "database/migrations"
	}
	if conf.SeedsDir == "" {
		conf.SeedsDir = "database/seeds"
	}
	if conf.ChangelogCollection == "" {
		conf.ChangelogCollection = "changelog"
	}
	return conf
}
