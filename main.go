package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/salmanfaris22/nexgo/v2/pkg/builder"
	"github.com/salmanfaris22/nexgo/v2/pkg/config"
	"github.com/salmanfaris22/nexgo/v2/pkg/renderer"
	"github.com/salmanfaris22/nexgo/v2/pkg/server"

	info "github.com/salmanfaris22/nexgo-website/config"
)

// Shared data loaders — used by both server and builder
var versionData = map[string]interface{}{
	"version":        info.Version,
	"prevVersion":    info.PrevVersion,
	"goVersion":      info.GoVersion,
	"installCmd":     info.InstallCmd,
	"prevInstallCmd": info.PrevInstallCmd,
	"latestBadge":    info.LatestBadge,
	"versionBadge":   info.VersionBadge,
	"prevBadge":      info.PrevBadge,
}

var versionLoader renderer.DataLoader = func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
	return versionData, nil
}

type loaderRegistrar interface {
	RegisterDataLoader(route string, loader renderer.DataLoader)
}

func registerLoaders(r loaderRegistrar) {
	r.RegisterDataLoader("/", versionLoader)
	r.RegisterDataLoader("/docs", versionLoader)
	r.RegisterDataLoader("/blog", versionLoader)
	r.RegisterDataLoader("/compare", versionLoader)
	r.RegisterDataLoader("/versions", versionLoader)
	r.RegisterDataLoader("/announcement", versionLoader)

	r.RegisterDataLoader("/blog/[slug]", func(req *http.Request, params map[string]string) (map[string]interface{}, error) {
		slug := params["slug"]
		posts := getBlogPosts()
		for _, post := range posts {
			if post["slug"] == slug {
				return map[string]interface{}{"post": post}, nil
			}
		}
		return map[string]interface{}{"post": nil}, nil
	})
}

func main() {
	cfg, err := config.Load(".")
	if err != nil {
		log.Fatal(err)
	}

	// Build mode: go run main.go build
	if len(os.Args) > 1 && os.Args[1] == "build" {
		b := builder.New(cfg)
		registerLoaders(b)
		if _, err := b.Build(); err != nil {
			log.Fatal(err)
		}
		return
	}

	// Server mode (default)
	srv, err := server.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	registerLoaders(srv)

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
