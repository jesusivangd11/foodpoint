// FoodPoint · sitio oficial: novedades, descargas, avisos de version y detalles de interfaz.
(() => {
  const cfg = window.MESANA_SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } },
  };
  const SEEN_KEY = 'mesana-version-vista';
  const releasesPage = `https://github.com/${cfg.releasesRepo}/releases/latest`;

  // ---------- Contacto ----------
  function contactHref(motivo) {
    const c = cfg.contacto || {};
    const texto = `Hola, me interesa FoodPoint${motivo ? ` (${motivo})` : ''}.`;
    if (c.whatsapp) return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(texto)}`;
    return `mailto:${c.email}?subject=${encodeURIComponent('FoodPoint · ' + (motivo || 'Información'))}&body=${encodeURIComponent(texto)}`;
  }
  const c = cfg.contacto || {};
  $$('[data-contacto]').forEach((a) => { a.href = contactHref(a.dataset.contacto); });
  $$('[data-whatsapp]').forEach((a) => {
    a.href = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(`Hola ${c.nombre || ''}, me interesa FoodPoint${a.dataset.whatsapp ? ` (${a.dataset.whatsapp})` : ''}.`)}`;
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-mailto]').forEach((a) => { a.href = `mailto:${c.email}?subject=${encodeURIComponent('FoodPoint · ' + (a.dataset.mailto || 'Información'))}`; });
  $$('[data-email]').forEach((el) => { el.textContent = c.email || ''; });
  $$('[data-telefono]').forEach((el) => { el.textContent = c.telefono || ''; });

  // ---------- Precios ----------
  const planesBox = $('#planes');
  if (planesBox && cfg.planes) {
    planesBox.innerHTML = cfg.planes.map((p) => `
      <article class="plan ${p.destacado ? 'plan--hot' : ''} reveal">
        ${p.etiqueta ? `<span class="plan-stamp">${esc(p.etiqueta)}</span>` : ''}
        <h3>${esc(p.nombre)}</h3>
        <p class="plan-lema">${esc(p.lema)}</p>
        <div class="plan-price"><span class="plan-cur">$</span>${p.precio.toLocaleString('es-MX')}<small>${esc(p.periodo)}</small></div>
        <ul>${p.incluye.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <a class="btn ${p.destacado ? 'btn--solid' : 'btn--ghost'}" ${p.accion === 'descargar' ? 'data-descargar' : `href="${contactHref('Plan ' + p.nombre)}"`}>${esc(p.cta)}</a>
      </article>`).join('');
  }

  // ---------- Novedades (GitHub Releases, con respaldo local) ----------
  async function loadReleases() {
    try {
      const r = await fetch(`https://api.github.com/repos/${cfg.releasesRepo}/releases?per_page=8`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!r.ok) throw new Error(r.status);
      const list = await r.json();
      const ok = list.filter((x) => !x.draft && !x.prerelease);
      if (!ok.length) throw new Error('sin releases');
      return ok.map((x) => ({
        version: String(x.tag_name || x.name).replace(/^v/i, ''),
        fecha: (x.published_at || '').slice(0, 10),
        titulo: x.name && x.name !== x.tag_name ? x.name : '',
        notas: x.body || '',
        ...exeInfo(x),
      }));
    } catch (e) {
      const r = await fetch('novedades.json');
      return (await r.json()).map((x) => ({ ...x, descarga: releasesPage }));
    }
  }

  // Datos del instalador para la ficha de descarga (tamano y huella SHA-256).
  function exeInfo(release) {
    const exe = (release.assets || []).find((a) => /\.exe$/i.test(a.name));
    return {
      descarga: exe?.browser_download_url || release.html_url,
      tamano: exe ? `${Math.round(exe.size / 1048576)} MB` : '',
      sha256: exe?.digest && exe.digest.startsWith('sha256:') ? exe.digest.slice(7) : '',
      archivo: exe?.name || '',
    };
  }

  function notesHtml(md) {
    const lines = String(md).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let html = ''; let inList = false;
    lines.forEach((l) => {
      const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (/^[-*]\s+/.test(l)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += /^#+\s/.test(l) ? `<h4>${inline(l.replace(/^#+\s/, ''))}</h4>` : `<p>${inline(l)}</p>`;
      }
    });
    return html + (inList ? '</ul>' : '');
  }

  const fechaLarga = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  function renderReleases(rel) {
    const latest = rel[0];
    $$('[data-version]').forEach((el) => { el.textContent = latest.version; });
    $$('[data-descargar]').forEach((a) => {
      a.href = latest.descarga;
      a.setAttribute('download', '');
    });
    $$('[data-fecha]').forEach((el) => { el.textContent = fechaLarga(latest.fecha); });
    if (latest.tamano) $$('[data-tamano]').forEach((el) => { el.textContent = latest.tamano; });
    if (latest.archivo) $$('[data-archivo]').forEach((el) => { el.textContent = latest.archivo; });
    $$('[data-sha]').forEach((el) => {
      const row = el.closest('[data-sha-row]');
      if (latest.sha256) { el.textContent = latest.sha256; if (row) row.hidden = false; }
    });

    const box = $('#novedades-lista');
    if (box) {
      box.innerHTML = rel.slice(0, 4).map((x, i) => `
        <article class="release reveal ${i === 0 ? 'release--new' : ''}">
          <header>
            <span class="release-v">v${esc(x.version)}</span>
            <time datetime="${esc(x.fecha)}">${esc(fechaLarga(x.fecha))}</time>
            ${i === 0 ? '<span class="release-tag">Más reciente</span>' : ''}
          </header>
          ${x.titulo ? `<h3>${esc(x.titulo)}</h3>` : ''}
          <div class="release-notes">${notesHtml(x.notas)}</div>
        </article>`).join('');
      observeReveals(box);
    }

    // Aviso de version nueva para quien ya habia visitado la pagina.
    const seen = store.get(SEEN_KEY);
    const bell = $('#bell');
    const panel = $('#bell-panel');
    if (bell && panel) {
      panel.innerHTML = `<p class="bell-head">Novedades</p>` + rel.slice(0, 3).map((x, i) => `
        <a class="bell-item" href="index.html#novedades">
          <strong>FoodPoint ${esc(x.version)}${i === 0 && seen !== x.version ? ' <em>nuevo</em>' : ''}</strong>
          <span>${esc(x.titulo || firstLine(x.notas))}</span>
          <time>${esc(fechaLarga(x.fecha))}</time>
        </a>`).join('') + `<a class="bell-all" href="index.html#novedades">Ver todas las novedades →</a>`;
      bell.classList.toggle('has-new', seen !== latest.version);
      bell.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = panel.classList.toggle('open');
        bell.setAttribute('aria-expanded', open);
        if (open) { store.set(SEEN_KEY, latest.version); bell.classList.remove('has-new'); }
      });
      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target)) { panel.classList.remove('open'); bell.setAttribute('aria-expanded', 'false'); }
      });
    }
    const bar = $('#announce');
    if (bar && seen !== latest.version) {
      bar.innerHTML = `<span class="announce-dot"></span> Nuevo: <strong>FoodPoint ${esc(latest.version)}</strong> — ${esc(latest.titulo || firstLine(latest.notas))} <a href="index.html#novedades">Ver novedades →</a><button aria-label="Cerrar aviso">×</button>`;
      bar.hidden = false;
      bar.querySelector('button').addEventListener('click', () => { bar.hidden = true; store.set(SEEN_KEY, latest.version); bell?.classList.remove('has-new'); });
    }
  }

  const firstLine = (md) => String(md).split(/\r?\n/).map((l) => l.replace(/^[-*#\s]+/, '').replace(/\*\*/g, '').trim()).find(Boolean) || '';

  loadReleases().then(renderReleases).catch(() => {
    $$('[data-descargar]').forEach((a) => { a.href = releasesPage; });
  });

  // ---------- Navegacion movil ----------
  const toggle = $('#nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  // ---------- Video ----------
  $$('.video-frame').forEach((frame) => {
    const video = $('video', frame);
    const play = $('.video-play', frame);
    play?.addEventListener('click', () => {
      frame.classList.add('playing');
      video.controls = true;
      video.play();
    });
  });

  // ---------- Apariciones al hacer scroll ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  function observeReveals(root = document) {
    $$('.reveal:not(.in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
  }
  observeReveals();

  // ---------- Ayuda: buscador y seccion activa ----------
  const search = $('#help-search');
  if (search) {
    const items = $$('.help-article');
    const empty = $('#help-empty');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      let shown = 0;
      items.forEach((it) => {
        const txt = it.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const hit = !q || txt.includes(q);
        it.hidden = !hit;
        if (hit) shown++;
      });
      $$('.help-group').forEach((g) => { g.hidden = !$$('.help-article', g).some((a) => !a.hidden); });
      if (empty) empty.hidden = shown > 0;
    });
    const links = $$('.help-toc a');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.help-group').forEach((g) => spy.observe(g));
  }
})();
