package main

import (
	"flag"
	"log/slog"

	"github.com/dredly/wordlestats/internal/server"
)

var devMode bool

func main() {
	flag.BoolFunc("dev", "runs the server in dev mode, using local static files instead of files embedded in the binary", func(_ string) error {
		devMode = true
		return nil
	})
	flag.Parse()
	if err := server.Run(devMode); err != nil {
		slog.Info("Error starting", "error", err)
	}
}