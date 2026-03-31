package api

import (
	"net/http"

	"github.com/salmanfaris22/nexgo/pkg/api"
	"github.com/salmanfaris22/nexgo/pkg/router"
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
				"version": "1.0.0",
				"docs":    "https://salmanfaris.dev/nexgo/docs",
			})
		},
	})
}
