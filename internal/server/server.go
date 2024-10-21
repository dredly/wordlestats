package server

import (
	"log/slog"
	"net/http"

	"github.com/dredly/wordlestats/internal/html"
	gmp "maragu.dev/gomponents"
	ghttp "maragu.dev/gomponents/http"
)

func Run() error {
	slog.Info("Starting server on port 8080")
	return http.ListenAndServe(":8080", setupRoutes())
}

func setupRoutes() http.Handler {
	mux := http.NewServeMux()
	home(mux)
	about(mux)
	static(mux)
	return mux
}

func home(mux *http.ServeMux) {
	mux.Handle("GET /", ghttp.Adapt(func(w http.ResponseWriter, r *http.Request) (gmp.Node, error) {
		return html.Home(), nil
	}))
}

func about(mux *http.ServeMux) {
	mux.Handle("GET /about", ghttp.Adapt(func(w http.ResponseWriter, r *http.Request) (gmp.Node, error) {
		return html.About(), nil
	}))
}

func static(mux *http.ServeMux) {
	mux.Handle("GET /static/",  http.StripPrefix("/static/", http.FileServer(http.Dir("./public"))))
}