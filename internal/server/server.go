package server

import (
	"io/fs"
	"log/slog"
	"net/http"

	projectroot "github.com/dredly/wordlestats"
	"github.com/dredly/wordlestats/internal/html"
	gmp "maragu.dev/gomponents"
	ghttp "maragu.dev/gomponents/http"
)

func Run() error {
	slog.Info("Starting server on port 8080")
	return http.ListenAndServe(":8080", setupRoutes())
}

func setupRoutes() http.Handler {
	staticFS, err := fs.Sub(projectroot.EmbeddedFS, "public")
	if err != nil {
		panic(err)
	}
	httpFS := http.FS(staticFS)
	mux := http.NewServeMux()
	home(mux)
	about(mux)
	static(mux, httpFS)
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

func static(mux *http.ServeMux, fs http.FileSystem) {
	mux.Handle("GET /static/",  http.StripPrefix("/static/", http.FileServer(fs)))
}