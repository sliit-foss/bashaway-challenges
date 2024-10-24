package e_utils

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"plugin"
	"strings"

	"github.com/samber/lo"
)

func GeneratePluginFromFile(path string) string {
	cwd := lo.Must(os.Getwd())
	pluginDir := cwd + "/.elemental/plugins"
	os.MkdirAll(pluginDir, os.ModePerm)
	filename := filepath.Base(path)
	outputPath := pluginDir + "/" + strings.Replace(filename, ".go", ".so", -1)
	cmd := exec.Command(fmt.Sprintf("go build -buildmode=plugin -o %s %s", outputPath, path))
	cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error building plugin: %v\n", err)
	}
	return outputPath
}

func ExtractFunctionFromPlugin(path string, function string) func() {
	p, err := plugin.Open(path)
	if err != nil {
		log.Fatalf("Error opening plugin: %v\n", err)
	}
	sym, err := p.Lookup(function)
	if err != nil {
		log.Fatalf("Error looking up MyFunction: %v\n", err)
	}
	myFunction, ok := sym.(func())
	if !ok {
		log.Fatal("Error asserting MyFunction type\n")
	}
	return myFunction
}
