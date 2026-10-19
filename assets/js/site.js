/* ============================================================
   TWW3 新兵营 — shared scripts
   ============================================================ */
(function () {
  'use strict';

  /* ---------- header / progress ---------- */
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('progress');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }
  // Safety net: never leave content invisible if the observer misses an element
  // (deep links, printing, embedded browsers, very tall viewports).
  window.setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1400);

  /* ---------- accordion ---------- */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const panel = item.querySelector('.acc-panel');
      const isOpen = item.classList.contains('open');
      const parent = item.parentElement;
      parent.querySelectorAll('.acc-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.acc-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = group.querySelectorAll('.tab');
    const panels = group.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = group.querySelector('#' + btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---------- TOC scrollspy ---------- */
  const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, link);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = map.get(e.target);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    map.forEach((_, sec) => spy.observe(sec));
  }

  /* ---------- annotated screenshot pins ---------- */
  document.querySelectorAll('.shot-annot').forEach(wrap => {
    const note = wrap.querySelector('.pin-note');
    wrap.querySelectorAll('.pin').forEach(pin => {
      const show = () => {
        wrap.querySelectorAll('.pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        note.innerHTML = '<b>' + pin.dataset.title + '</b>' + pin.dataset.note;
        note.classList.add('show');
        const pr = wrap.getBoundingClientRect();
        const r = pin.getBoundingClientRect();
        let left = r.left - pr.left + 22;
        let top = r.top - pr.top - 10;
        if (left + 270 > pr.width) left = Math.max(8, left - 300);
        if (top + note.offsetHeight > pr.height) top = pr.height - note.offsetHeight - 10;
        note.style.left = left + 'px';
        note.style.top = Math.max(8, top) + 'px';
      };
      pin.addEventListener('mouseenter', show);
      pin.addEventListener('click', show);
    });
  });

  /* ---------- quiz ---------- */
  const quiz = document.getElementById('quiz');
  if (quiz) {
    quiz.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        quiz.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const out = document.getElementById('quiz-result');
        out.innerHTML = '<h4>' + btn.dataset.title + '</h4><p>' + btn.dataset.result + '</p>';
        out.classList.add('show');
      });
    });
  }

  /* ---------- checklist ---------- */
  const checklist = document.getElementById('checklist-widget');
  if (checklist) {
    const items = checklist.querySelectorAll('input[type="checkbox"]');
    const bar = checklist.querySelector('.check-bar i');
    const label = checklist.querySelector('.check-count');
    const key = 'tww3-checklist-v1';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    items.forEach(input => {
      if (saved[input.id]) input.checked = true;
      input.addEventListener('change', () => {
        saved[input.id] = input.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        update();
      });
    });
    function update() {
      const done = Array.from(items).filter(i => i.checked).length;
      if (bar) bar.style.width = (done / items.length) * 100 + '%';
      if (label) label.textContent = done + ' / ' + items.length;
    }
    update();
  }

  /* ---------- back to top ---------- */
  const toTop = document.createElement('button');
  toTop.id = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', '回到顶部');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);
  const syncTop = () => toTop.classList.toggle('show', (window.scrollY || 0) > 700);
  window.addEventListener('scroll', syncTop, { passive: true });
  syncTop();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
