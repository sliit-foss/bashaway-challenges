package e_cmd

import (
	e_connection "elemental/connection"
	e_utils "elemental/utils"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/samber/lo"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)


func run(rollback bool) {
	cfg := readConfigFile()
	e_connection.ConnectURI(cfg.ConnectionStr)
	defer e_connection.Disconnect()
	files, err := ioutil.ReadDir(cfg.MigrationsDir)
	if err != nil {
		log.Fatalf("Failed to read migrations: %v", err)
	}
	for _, file := range files {
		if !file.IsDir() {
			fmt.Println(file.Name())
			cwd := lo.Must(os.Getwd())
			pluginDir := e_utils.GeneratePluginFromFile(cwd + "/" + cfg.MigrationsDir + "/" + file.Name())
			functionName := "Up"
			if rollback {
				functionName = "Down"
			}
			myFunction := e_utils.ExtractFunctionFromPlugin(pluginDir, functionName)
			myFunction()
		}
	}
	fmt.Println("Running database migrations", cfg)
}

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Run database migrations",
}

var createMigrationCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a new migration",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			log.Fatal("Please provide a name for the migration")
		}
		cfg := readConfigFile()
		os.MkdirAll(cfg.MigrationsDir, os.ModePerm)
		var template = `package migrations

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
)

func Up(ctx context.Context, db *mongo.Database, client *mongo.Client) {
	// Write your migration here
}

func Down(ctx context.Context, db *mongo.Database, client *mongo.Client) {
	// Write your rollback here
}`
		outputFile := cfg.MigrationsDir + "/" + "_" + args[0] + "_" + cast.ToString(time.Now().UnixMilli()) + ".go"
		f, err := os.Create(outputFile)
		if err != nil {
			log.Fatal("Error creating migration file", err)
		}
		defer f.Close()
		f.WriteString(template)
		log.Println("Migration file created at", outputFile)
	},
}

var runMigrationCmd = &cobra.Command{
	Use:   "up",
	Short: "Run database migrations",
	Run: func(cmd *cobra.Command, args []string) {
		run(false)
	},
}

var rollbackMigrationCmd = &cobra.Command{
	Use:   "down",
	Short: "Rollback database migrations",
	Run: func(cmd *cobra.Command, args []string) {
		run(true)
	},
}

func init() {
	migrateCmd.AddCommand(createMigrationCmd)
	migrateCmd.AddCommand(runMigrationCmd)
	migrateCmd.AddCommand(rollbackMigrationCmd)
}
