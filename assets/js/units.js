/* ============================================================
   全局兵种库
   ============================================================ */
(function () {
  'use strict';
  const data = window.UNITS || [];
  const races = window.RACES || [];
  const raceSel = document.getElementById('f-race');
  const catSel = document.getElementById('f-cat');
  const tierSel = document.getElementById('f-tier');
  const sortSel = document.getElementById('f-sort');
  const qInput = document.getElementById('f-q');
  const rowsEl = document.getElementById('unit-rows');
  const countEl = document.getElementById('unit-count');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (!rowsEl) return;

  const raceMap = Object.fromEntries(races.map(r => [r.slug, r]));
  for (const r of races.slice().sort((a, b) => a.name.localeCompare(b.name, 'zh'))) {
    const o = document.createElement('option');
    o.value = r.slug;
    o.textContent = r.name + ' · ' + r.en;
    raceSel.appendChild(o);
  }

  const state = { race: '', cat: '', tier: '', sort: 'name', q: '', page: 1, per: 80 };

  function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-US'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function cat(u) {
    if (u.section === 'Lords' || u.section === 'Heroes') return 'lord';
    if (u.section === 'Regiments of Renown') return 'ror';
    if (u.section === 'Melee infantry' || u.section === 'Monstrous infantry') return 'infantry';
    if (u.section === 'Missile infantry') return 'missile';
    if (['Melee cavalry', 'Missile cavalry', 'Monstrous cavalry', 'Chariots', 'War beasts'].includes(u.section)) return 'mobile';
    if (u.section === 'Monsters') return 'monster';
    if (u.section === 'War machines & artillery') return 'artillery';
    return 'other';
  }
  function filtered() {
    const q = state.q.toLowerCase();
    let list = data.filter(u => {
      if (state.race && u.race !== state.race) return false;
      if (state.cat && cat(u) !== state.cat) return false;
      if (state.tier && String(u.tier) !== state.tier) return false;
      if (q) {
        const hay = (u.name + ' ' + u.race_cn + ' ' + u.race_en + ' ' + u.type + ' ' + u.section).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const num = (v) => v == null ? -1 : v;
    if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (state.sort === 'hp') list.sort((a, b) => num(b.hp) - num(a.hp));
    else if (state.sort === 'armour') list.sort((a, b) => num(b.armour) - num(a.armour));
    else if (state.sort === 'ws') list.sort((a, b) => num(b.ws) - num(a.ws));
    else if (state.sort === 'upkeep') list.sort((a, b) => num(b.upkeep) - num(a.upkeep));
    return list;
  }
  function render() {
    const list = filtered();
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / state.per));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.per;
    const slice = list.slice(start, start + state.per);
    rowsEl.innerHTML = slice.map(u => {
      const r = raceMap[u.race] || { name: u.race_cn };
      const icon = u.icon ? `<img src="${u.icon}" alt="" loading="lazy">` : '';
      const tier = u.tier ? `<span class="tier">T${u.tier}</span>` : '<span class="dim">—</span>';
      const missile = u.dmg10 != null ? `${fmt(u.dmg10)}${u.range ? ' / ' + u.range + 'm' : ''}` : '<span class="dim">—</span>';
      return `<tr>
        <td><div class="u">${icon}<div><b><a href="wiki/${u.race}.html#roster">${esc(u.name)}</a></b></div></div></td>
        <td>${esc(r.name)}</td>
        <td>${esc(u.type)}</td>
        <td class="num">${tier}</td>
        <td class="num">${fmt(u.models)}</td>
        <td class="num">${fmt(u.hp)}</td>
        <td class="num">${fmt(u.armour)}</td>
        <td class="num">${fmt(u.leadership)}</td>
        <td class="num">${fmt(u.speed)}</td>
        <td class="num">${fmt(u.ma)}</td>
        <td class="num">${fmt(u.md)}</td>
        <td class="num">${fmt(u.ws)}</td>
        <td class="num">${missile}</td>
        <td class="num">${fmt(u.upkeep)}</td>
      </tr>`;
    }).join('');
    countEl.innerHTML = total
      ? `共 <b>${total.toLocaleString('en-US')}</b> 个单位 · 当前 ${start + 1}–${Math.min(start + state.per, total)} 条`
      : '没有符合条件的单位。试试清空搜索或换一个筛选。';
    pageInfo.textContent = `第 ${state.page} / ${pages} 页`;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= pages;
  }

  function reset() { state.page = 1; render(); }
  raceSel.addEventListener('change', () => { state.race = raceSel.value; reset(); });
  catSel.addEventListener('change', () => { state.cat = catSel.value; reset(); });
  tierSel.addEventListener('change', () => { state.tier = tierSel.value; reset(); });
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; reset(); });
  let timer = null;
  qInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = qInput.value.trim(); reset(); }, 160);
  });
  prevBtn.addEventListener('click', () => { if (state.page > 1) { state.page--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  nextBtn.addEventListener('click', () => { state.page++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  render();
})();
