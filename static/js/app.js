/* NexGo Website — app.js */

// ── Theme System ───────────────────────
(function () {
  const stored = localStorage.getItem('nexgo-theme');
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (preferDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Toggle ──────────────────────
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nexgo-theme', next);
      toggleBtn.innerHTML = next === 'dark'
        ? '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
        : '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    });

    // Set initial icon
    const current = document.documentElement.getAttribute('data-theme');
    toggleBtn.innerHTML = current === 'dark'
      ? '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
      : '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }

  // ── Copy Buttons ──────────────────────
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.copy || btn.closest('.install-box')?.querySelector('.cmd-text')?.textContent;
      if (!target) return;
      navigator.clipboard.writeText(target.trim()).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // ── Scroll Reveal ─────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

  // ── Stagger reveal for card grids ─────
  document.querySelectorAll('.stagger').forEach(container => {
    const cards = container.querySelectorAll('.card, .blog-card, .feat-card, .stat-card');
    const gridObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 80);
          });
          gridObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(c => c.classList.add('reveal'));
    gridObs.observe(container);
  });

  // ── Mobile Menu Toggle ────────────────
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    const iconMenu = mobileToggle.querySelector('.icon-menu');
    const iconClose = mobileToggle.querySelector('.icon-close');

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      iconMenu.style.display = isOpen ? 'none' : 'block';
      iconClose.style.display = isOpen ? 'block' : 'none';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        iconMenu.style.display = 'block';
        iconClose.style.display = 'none';
      });
    });
  }

  // ── Hero Parallax on Mouse Move ───────
  const hero = document.querySelector('.hero');
  if (hero) {
    const orbs = hero.querySelectorAll('.glow-orb');
    const beams = hero.querySelector('.hero-beams');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 12;
        orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
      if (beams) {
        beams.style.transform = `translate(${x * 5}px, ${y * 3}px)`;
      }
    });
    hero.addEventListener('mouseleave', () => {
      orbs.forEach(orb => { orb.style.transform = ''; });
      if (beams) beams.style.transform = '';
    });
  }

  // ── Active Nav Link ───────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(a => {
    if (a.getAttribute('href') === path ||
       (path.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/')) {
      a.classList.add('active');
    }
  });

  // ── SPA Navigation (no full reload) ──
  function isInternalLink(href) {
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('http')) return false;
    if (href.startsWith('mailto:')) return false;
    if (href.startsWith('javascript:')) return false;
    if (href.startsWith('tel:')) return false;
    return true;
  }

  function navigateTo(target) {
    // Parse hash from target URL
    const hashIndex = target.indexOf('#');
    const hash = hashIndex !== -1 ? target.substring(hashIndex + 1) : null;
    const fetchUrl = hashIndex !== -1 ? target.substring(0, hashIndex) || '/' : target;

    window.history.pushState({ path: target }, '', target);

    fetch(fetchUrl || target)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        document.title = doc.title;

        const newContent = doc.querySelector('#nexgo-root');
        const oldContent = document.querySelector('#nexgo-root');
        if (newContent && oldContent) {
          oldContent.innerHTML = newContent.innerHTML;
        }

        const newMeta = doc.querySelector('meta[name="description"]');
        if (newMeta) {
          let oldMeta = document.querySelector('meta[name="description"]');
          if (oldMeta) oldMeta.content = newMeta.content;
        }

        const newOGTitle = doc.querySelector('meta[property="og:title"]');
        if (newOGTitle) {
          let oldOGTitle = document.querySelector('meta[property="og:title"]');
          if (oldOGTitle) oldOGTitle.content = newOGTitle.content;
        }

        initPageScripts();

        // Scroll to hash target or top
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            const headerOffset = 100;
            const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            setTimeout(() => window.scrollTo({ top, behavior: 'smooth' }), 50);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const navTarget = fetchUrl || target;
        document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll(`.nav-links a[href="${navTarget}"], .mobile-menu-links a[href="${navTarget}"]`).forEach(a => a.classList.add('active'));
      })
      .catch(() => {
        window.location.href = target;
      });
  }

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!isInternalLink(href)) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const target = href;

    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      if (iconMenu) iconMenu.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
    }

    navigateTo(target);
  }, true);

  window.addEventListener('popstate', () => {
    fetch(window.location.pathname)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        document.title = doc.title;
        const newContent = doc.querySelector('#nexgo-root');
        const oldContent = document.querySelector('#nexgo-root');
        if (newContent && oldContent) {
          oldContent.innerHTML = newContent.innerHTML;
        }
        window.scrollTo({ top: 0 });
        initPageScripts();

        document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll(`.nav-links a[href="${window.location.pathname}"], .mobile-menu-links a[href="${window.location.pathname}"]`).forEach(a => a.classList.add('active'));
      })
      .catch(() => {
        window.location.reload();
      });
  });

  function initPageScripts() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.copy || btn.closest('.install-box')?.querySelector('.cmd-text')?.textContent;
        if (!target) return;
        navigator.clipboard.writeText(target.trim()).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)').forEach(el => observer.observe(el));

    document.querySelectorAll('.stagger').forEach(container => {
      const cards = container.querySelectorAll('.card, .blog-card, .feat-card, .stat-card');
      const gridObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('visible'), i * 80);
            });
            gridObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      cards.forEach(c => c.classList.add('reveal'));
      gridObs.observe(container);
    });

    document.querySelectorAll('[data-count]').forEach(el => {
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCounter(el);
      }
    });

    // Performance tab switching (compare page)
    document.querySelectorAll('.perf-tab[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        document.querySelectorAll('.perf-tab-content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.perf-tab').forEach(b => b.classList.remove('active'));
        const activeTab = document.getElementById('tab-' + tabName);
        if (activeTab) activeTab.style.display = 'block';
        btn.classList.add('active');
      });
    });

    // Sidebar scroll navigation (re-init after SPA nav)
    const sidebarEl = document.querySelector('.docs-sidebar');
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      a.addEventListener('click', function(ev) {
        ev.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerOffset = 100;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        if (sidebarEl) {
          this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
    if (headings.length) {
      const headingObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.id;
            document.querySelectorAll('.sidebar-nav a').forEach(a => {
              const isActive = a.getAttribute('href') === '#' + id;
              a.classList.toggle('active', isActive);
              if (isActive && sidebarEl) {
                a.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      headings.forEach(h => headingObs.observe(h));
    }
  }

  // ── Sidebar active state ──────────────
  const sidebar = document.querySelector('.docs-sidebar');
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      if (sidebar) {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Scroll spy for docs
  const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
  if (headings.length) {
    const headingObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          document.querySelectorAll('.sidebar-nav a').forEach(a => {
            const isActive = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', isActive);
            if (isActive && sidebar) {
              a.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(h => headingObs.observe(h));
  }

  // ── Number Counter ────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isFloat = el.dataset.count.includes('.');
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  // ── Performance Tabs (compare page) ────
  document.querySelectorAll('.perf-tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      document.querySelectorAll('.perf-tab-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.perf-tab').forEach(b => b.classList.remove('active'));
      const activeTab = document.getElementById('tab-' + tabName);
      if (activeTab) activeTab.style.display = 'block';
      btn.classList.add('active');
    });
  });

  // ── Tabs (compare page) ───────────────
  document.querySelectorAll('[data-tab-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.tabGroup;
      const target = btn.dataset.tabBtn;
      document.querySelectorAll(`[data-tab-group="${group}"] [data-tab-btn]`).forEach(b => {
        b.classList.remove('active');
      });
      document.querySelectorAll(`[data-tab-pane="${group}"]`).forEach(p => {
        p.style.display = p.dataset.paneId === target ? 'block' : 'none';
      });
      btn.classList.add('active');
    });
  });

});
