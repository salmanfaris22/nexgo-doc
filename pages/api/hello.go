package api

import (
	"net/http"

	info "github.com/salmanfaris22/nexgo-website/config"
	"github.com/salmanfaris22/nexgo/v2/pkg/api"
	"github.com/salmanfaris22/nexgo/v2/pkg/router"
)

func init() {
	router.RegisterAPI("/api/hello", Hello)
}

// Hello — GET /api/hello
func Hello(w http.ResponseWriter, r *http.Request) {
	api.Route(w, r, api.Methods{
		"GET": func(w http.ResponseWriter, r *http.Request) {
			api.JSON(w, map[string]interface{}{
				"message": "Welcome to NexGo!",
				"version": info.Version,
				"docs":    "https://salmanfaris.dev/nexgo/docs",
			})
		},
	})
}
