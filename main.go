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

	info "github.com/salmanfaris22/nexgo-website/config"
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

	// Global version data for all pages
	versionData := map[string]interface{}{
		"version":        info.Version,
		"prevVersion":    info.PrevVersion,
		"goVersion":      info.GoVersion,
		"installCmd":     info.InstallCmd,
		"prevInstallCmd": info.PrevInstallCmd,
		"latestBadge":    info.LatestBadge,
		"versionBadge":   info.VersionBadge,
		"prevBadge":      info.PrevBadge,
	}

	srv.RegisterDataLoader("/index", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})

	srv.RegisterDataLoader("/docs", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})

	srv.RegisterDataLoader("/blog", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})

	srv.RegisterDataLoader("/compare", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})

	srv.RegisterDataLoader("/versions", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})

	srv.RegisterDataLoader("/announcement", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		return versionData, nil
	})
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	if err := srv.Start(ctx); err != nil {
		log.Fatal(err)
	}
}

// ── Sample data ───────────────────────────────────────────────────────────────

func getBlogPosts() []map[string]interface{} {
	return []map[string]interface{}{
		{
			"slug":        "nexgo-v2-0-2",
			"title":       "NexGo v1.2.5 — Auth, WebSockets, ORM, Cluster Mode & 24 New Features",
			"description": "Production-ready: JWT auth, sessions, CSRF, rate limiting, i18n, WebSockets, database, ORM, plugin system, deployment adapters, and more.",
			"date":        "April 2026",
			"readTime":    "12 min read",
			"tag":         "Release",
		},
		{
			"slug":        "nexgo-v1-2-0",
			"title":       "NexGo v1.2.0 — SEO, Streaming SSR, ISR & Advanced Features",
			"description": "Production-ready features: SEO meta tags, sitemaps, streaming SSR, incremental static regeneration, worker pools, and more.",
			"date":        "April 2026",
			"readTime":    "8 min read",
			"tag":         "Release",
		},
		{
			"slug":        "nexgo-v1-1-0",
			"title":       "NexGo v1.1.0 — HTMX Support, State Management & API Helpers",
			"description": "Built-in HTMX helpers, thread-safe state management, and HTML sanitization utilities.",
			"date":        "April 2026",
			"readTime":    "6 min read",
			"tag":         "Release",
		},
		{
			"slug":        "introducing-nexgo",
			"title":       "Introducing NexGo — The Go Web Framework Inspired by Next.js",
			"description": "After months of development, NexGo v1.0.5 is here.",
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
