package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/salmanfaris22/nexgo/pkg/config"
	"github.com/salmanfaris22/nexgo/pkg/server"
)

func main() {
	cfg, err := config.Load(".")
	if err != nil {
		log.Fatal(err)
	}

	srv, err := server.New(cfg)
	if err != nil {
		log.Fatal(err)
	}

	// Register data loaders (like getServerSideProps in Next.js)
	// srv.RegisterDataLoader("/blog/[slug]", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
	//     return map[string]interface{}{"slug": params["slug"]}, nil
	// })

	srv.RegisterDataLoader("/blog/[slug]", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		slug := params["slug"]
		// In a real app, fetch from DB or CMS
		posts := getBlogPosts()
		for _, post := range posts {
			if post["slug"] == slug {
				return map[string]interface{}{"post": post}, nil
			}
		}
		return map[string]interface{}{"post": nil}, nil
	})

	// Docs page metadata
	srv.RegisterDataLoader("/docs", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return map[string]interface{}{
			"version":   "1.0.5",
			"goVersion": "1.22+",
		}, nil
	})
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	if err := srv.Start(ctx); err != nil {
		log.Fatal(err)
	}
}

// ── Sample data ───────────────────────────────────────────────────────────────

func getBlogPosts() []map[string]interface{} {
	return []map[string]interface{}{
		{
			"slug":        "introducing-nexgo",
			"title":       "Introducing NexGo — The Go Web Framework Inspired by Next.js",
			"description": "After months of development, NexGo v1.0.0 is here.",
			"date":        "December 2024",
			"readTime":    "8 min read",
			"tag":         "Release",
		},
		{
			"slug":        "file-based-routing",
			"title":       "File-Based Routing in NexGo: A Complete Guide",
			"description": "Learn how NexGo's automatic route discovery works.",
			"date":        "December 2024",
			"readTime":    "6 min read",
			"tag":         "Tutorial",
		},
		{
			"slug":        "data-loaders",
			"title":       "Server-Side Data Loading: NexGo's getServerSideProps",
			"description": "How to use RegisterDataLoader to fetch server-side data.",
			"date":        "December 2024",
			"readTime":    "10 min read",
			"tag":         "Deep Dive",
		},
	}
}
