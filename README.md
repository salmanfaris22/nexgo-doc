# nexgo-website

Official website for the [NexGo](https://github.com/salmanfaris22/nexgo) Go web framework — built with NexGo itself.

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/index.html` | Landing page with hero, features, stats |
| `/docs` | `pages/docs.html` | Full documentation |
| `/blog` | `pages/blog.html` | Blog listing |
| `/compare` | `pages/compare.html` | Framework comparison |
| `/api/hello` | `pages/api/hello.go` | Sample API endpoint |

## Project Structure

```
nexgo-website/
├── main.go                   # Entry point + data loaders
├── nexgo.config.json         # Framework config
├── go.mod
├── pages/
│   ├── index.html            # → /
│   ├── docs.html             # → /docs
│   ├── blog.html             # → /blog
│   ├── compare.html          # → /compare
│   └── api/
│       └── hello.go          # → /api/hello
├── layouts/
│   └── default.html          # Shared layout (header + footer)
├── components/               # Reusable template partials
└── static/
    ├── css/
    │   └── global.css        # All styles (dark/light theme)
    └── js/
        └── app.js            # Theme toggle, copy buttons, scroll reveal
```

## Running Locally

```bash
# Install NexGo CLI
go install github.com/salmanfaris22/nexgo/cmd/nexgo@v1.0.5

# Fix PATH
export PATH=$PATH:$(go env GOPATH)/bin

# Install dependencies
go mod tidy

# Development (hot reload)
nexgo dev

# Production build
nexgo build

# Production server
nexgo start
```

Open [http://localhost:3000](http://localhost:3000)

## Theme

The site uses a dark violet theme by default with a light mode toggle.

- **Dark:** `#070710` background, `#7c3aed` violet accent
- **Light:** `#f5f3ff` background, `#6d28d9` violet accent
- Toggle persists to `localStorage`

## Creator

Built by [Salman Faris](https://salmanfaris.dev)

- 🌐 [salmanfaris.dev](https://salmanfaris.dev)
- 💼 [LinkedIn](https://www.linkedin.com/in/salman-faris-50b664272/)
- 📧 [salmanfariskalm@gmail.com](mailto:salmanfariskalm@gmail.com)
- 📱 WhatsApp: +91 9961821977

## License

MIT
