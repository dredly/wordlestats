package main

import (
	"log/slog"

	"github.com/dredly/wordlestats/internal/server"
)

func main() {
	if err := server.Run(); err != nil {
		slog.Info("Error starting", "error", err)
	}
}