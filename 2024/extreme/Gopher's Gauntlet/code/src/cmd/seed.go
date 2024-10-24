package e_cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Run database seeds",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Running seeders")
	},
}