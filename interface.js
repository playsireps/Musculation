/* =====================================================================
   Musculation — interface sur le modèle de l'appli CA1 Demi-fond
   N'EPS numérique — CA5 — Emilie BIDAULT et Quentin DELISLE
   · panneau fixe (à droite, ou en bas sur petit écran) : chrono de récupération + leçon du jour
   · accueil enseignant (3 grands boutons + raccourcis), barre du haut (enregistré · menu · verrou)
   · pages ajoutées aux étapes : signaux sonores, table % RM, minuteur
   Chargé avant app.js (déclarations seulement).
   ===================================================================== */
'use strict';

/* ---------- Panneau fixe ---------- */
function ifWatch(frac, cls){
  const off = Math.max(0, Math.min(100, 100 - (frac || 0) * 100));
  return `<svg class="watch" viewBox="0 0 64 72" aria-hidden="true">
    <rect x="26" y="1" width="12" height="7" rx="2.5" class="w-crown"/><rect x="29" y="7" width="6" height="6" class="w-crown"/>
    <rect x="48" y="12" width="9" height="5" rx="2" transform="rotate(45 52.5 14.5)" class="w-crown"/>
    <circle cx="32" cy="42" r="28" class="w-body"/><circle cx="32" cy="42" r="22" class="w-track"/>
    <circle id="dk-ring" cx="32" cy="42" r="22" class="w-ring ${cls || ''}" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="${off}" transform="rotate(-90 32 42)"/>
    <line id="dk-hand" x1="32" y1="42" x2="32" y2="24" class="w-hand" transform="rotate(${(1 - off / 100) * 360} 32 42)"/><circle cx="32" cy="42" r="2.8" class="w-hub"/></svg>`;
}
const ifDockOn = () => !!ROOT?.role && UI.view !== 'home' && !(isProfRole() && !UI.profUnlocked) && !document.querySelector('.lv-run');
const ifDockMin = () => UI.dockMin ?? (window.innerWidth < 900);
function ifRestNow(){ const ks = Object.keys(RESTS).sort((a, b) => RESTS[a].end - RESTS[b].end); const k = ks[0]; if (!k) return null; const R = RESTS[k], left = Math.max(0, Math.round((R.end - now()) / 1000)); return { k, R, left, frac: 1 - left / R.sec, more: ks.slice(1) }; }
const ifMMSS = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function ifDockInfo(){
  const n = curLesson(), L = lesson(n), T = THEMES[thOf(n)] || {};
  if (isProfRole()) {
    const pres = S.students.filter(s => present(n, s.id)), got = pres.filter(s => lessonState(n, s.id).any).length, wf = pres.filter(s => res(n, s.id)?.wu?.f?.ex?.length).length, G = nbGroups();
    const grp = G > 1 ? `<div class="dk-legend">${Array.from({ length:G }, (_, i) => { const c = groupColor(i + 1); return `<span><i style="background:${c?.c || '#888'}"></i>${esc(groupName(i + 1))} · ${S.students.filter(s => (s.grp || 0) === i + 1).length}</span>`; }).join('')}</div>` : '';
    return `<div class="dk-info"><div class="dk-lt"><span class="dk-num" style="--tc:${T.c || 'var(--navy)'}">${n}</span><div><b>${T.ico || ''} ${esc(T.n || '')}</b><small>${esc(lessonStatus(n).t)}${L.ex.length ? ' · ' + L.ex.length + ' atelier(s)' : ''}</small></div></div>
      <div class="dk-stats"><span>👥 <b>${pres.length}</b>/${S.students.length} présents</span><span>📥 <b>${got}</b> fiche(s) reçue(s)</span>${L.wu?.t === 'fiche' ? `<span>🔥 <b>${wf}</b> échauffement(s)</span>` : ''}${lessonPils(n).length ? `<span>🏛 ${lessonPils(n).map(p => p.ico).join(' ')}</span>` : ''}</div>${grp}
      <div class="dk-btns"><button class="btn small" data-action="profTab" data-tab="appel">✅ Appel</button><button class="btn small orange" data-action="profTab" data-tab="qr">📲 QR</button><button class="btn small orange" data-action="profTab" data-tab="bilanI">📥 Récupérer</button><button class="btn small" data-action="goSaisieP">✍️ Saisie</button></div></div>`;
  }
  const has = S.students.length && ROOT.seance && ROOT.seance.cid === S.id;
  return `<div class="dk-info"><div class="dk-lt"><span class="dk-num" style="--tc:${T.c || 'var(--navy)'}">${has ? n : '–'}</span><div><b>${has ? `${T.ico || ''} ${esc(T.n || '')}` : 'Aucune leçon'}</b><small>${has ? lessonPils(n).map(p => p.ico + ' ' + esc(p.n)).join(' · ') : 'Scanne le QR de la leçon'}</small></div></div>
    <div class="dk-btns">${has ? '<button class="btn small" data-action="goSaisie">✍️ Observer / saisir</button><button class="btn small orange" data-action="go" data-view="send">📤 Envoyer</button>' : '<button class="btn small orange" data-action="go" data-view="receive">📷 Scanner la leçon</button>'}<button class="btn small" data-action="go" data-view="savoirs">📚</button></div></div>`;
}
function ifRenderDock(){
  const d = document.getElementById('dock'); if (!d) return;
  const tb = document.getElementById('topbar'); if (tb) document.documentElement.style.setProperty('--hh', tb.offsetHeight + 'px');
  const on = ifDockOn(); document.body.classList.toggle('has-dock', on); d.hidden = !on;
  if (!on) { d.innerHTML = ''; return; }
  const min = ifDockMin(), r = ifRestNow(), n = curLesson(), T = THEMES[thOf(n)] || {};
  d.className = 'dock' + (min ? ' min' : '');
  d.innerHTML = `<div class="dk-chrono">${ifWatch(r ? r.frac : 0, r ? (r.left ? 'w-rest' : 'w-done') : '')}
      <div style="min-width:0"><div class="dk-course">Leçon ${n} · ${esc(T.n || '')}</div><div class="dk-t" id="dk-time">${r ? ifMMSS(r.left) : '0:00'}</div>
        <div class="dk-ph ${r ? (r.left ? 'is-rest' : 'is-run') : ''}" id="dk-phase">${r ? (r.left ? 'Récupération' : 'C\'est reparti !') : 'Récupération'}</div><div class="dk-sub" id="dk-sub">${r ? esc(r.R.label || '') : 'Lance un chrono de récupération'}</div></div>
      <button class="dk-toggle" data-action="dockMin" aria-label="${min ? 'Agrandir' : 'Réduire'} le panneau">${min ? '▴' : '▾'}</button>
      <div class="ctrls">${[30, 60, 90, 120, 180].map(s => `<button class="btn" data-action="dkRest" data-s="${s}">${fmtRest(s)}</button>`).join('')}<button class="btn primary" data-action="cxTimer">⏱️ Minuteur</button>${r ? `<button class="btn" data-action="restStop" data-k="${r.k}">✕</button>` : ''}</div>
      <div class="dk-more" id="dk-more">${ifMoreRests(r)}</div></div>
    ${min ? '' : ifDockInfo()}`;
  document.documentElement.style.setProperty('--dh', d.offsetHeight + 'px');
}
function ifMoreRests(r){ if (!r || !r.more.length) return ''; return r.more.map(k => { const R = RESTS[k], left = Math.max(0, Math.round((R.end - now()) / 1000)); return `<span class="${left ? '' : 'over'}">⏳ ${esc(R.label || '')} <b>${ifMMSS(left)}</b></span>`; }).join(''); }
/* mise à jour du chrono sans redessiner le panneau (toutes les 500 ms) */
function ifDockTick(){
  const d = document.getElementById('dock'); if (!d || d.hidden) return false;
  const r = ifRestNow(), t = document.getElementById('dk-time'); if (!t) return true;
  const had = d.dataset.r || '', key = r ? r.k : '';
  if (had !== key) { d.dataset.r = key; ifRenderDock(); return true; }
  t.textContent = r ? ifMMSS(r.left) : '0:00';
  const ph = document.getElementById('dk-phase'); if (ph) { ph.textContent = r ? (r.left ? 'Récupération' : 'C\'est reparti !') : 'Récupération'; ph.className = 'dk-ph ' + (r ? (r.left ? 'is-rest' : 'is-run') : ''); }
  const ring = document.getElementById('dk-ring'), hand = document.getElementById('dk-hand'), off = r ? Math.max(0, 100 - r.frac * 100) : 100;
  if (ring) { ring.setAttribute('stroke-dashoffset', off); ring.setAttribute('class', 'w-ring ' + (r ? (r.left ? 'w-rest' : 'w-done') : '')); }
  if (hand) hand.setAttribute('transform', `rotate(${(1 - off / 100) * 360} 32 42)`);
  const mo = document.getElementById('dk-more'); if (mo) mo.innerHTML = ifMoreRests(r);
  return true;
}

/* ---------- Accueil enseignant (modèle Demi-fond) ---------- */
function ifHomeCard(){
  const n = curLesson(), L = lesson(n), T = THEMES[thOf(n)] || {}, pres = S.students.filter(s => present(n, s.id)).length, N = S.settings.nbLessons, nd = Array.from({ length:N }, (_, i) => i + 1).filter(isDone).length;
  return `<div class="home-lesson"><div class="big">Leçon ${n} · ${T.ico || ''} ${esc(T.n || '')}</div>
    <div style="font-size:18px;font-weight:800">${esc(lessonStatus(n).t)}${L.ex.length ? ' · ' + L.ex.length + ' atelier(s) imposé(s)' : ' · ateliers au libre choix'}</div>
    <div class="muted" style="font-weight:700">👥 ${pres}/${S.students.length} élève(s) · 🏛 ${lessonPils(n).map(p => esc(p.n)).join(', ') || 'piliers à choisir'} · ${nd}/${N} leçon(s) terminée(s)</div></div>`;
}
function ifHomeProf(){
  return `<div class="home"><img class="home-logo" src="logo-app.png" alt="N'EPS numérique – Musculation">
    ${classPicker().replace('justify-content:flex-start', 'justify-content:center')}${ifHomeCard()}
    <div class="home-grid">
      <button class="home-btn saisie" data-action="profTab" data-tab="hub"><span class="ico">🏋️</span>Leçon du jour<small>appel · échauffements · saisie · bilans</small></button>
      <button class="home-btn stats" data-action="profTab" data-tab="bilanL"><span class="ico">📊</span>Résultats<small>bilan par leçon · suivi · max</small></button>
      <button class="home-btn prof" data-action="profTab" data-tab="menu"><span class="ico">🛠</span>Enseignant<small>préparer · tablettes · bilans</small></button></div>
    <div class="home-sync"><button class="btn orange" data-action="profTab" data-tab="qr">📲 QR de la leçon</button><button class="btn orange" data-action="profTab" data-tab="bilanI">📥 Récupérer les saisies</button><button class="btn" data-action="profTab" data-tab="fiches">📄 Fiches PDF</button><button class="btn" data-action="cxTimer">⏱️ Minuteur</button></div></div>`;
}
function ifHomeProfLocked(){
  return `<div class="home"><img class="home-logo" src="logo-app.png" alt="N'EPS numérique – Musculation">
    <div class="class-chips"><span class="class-chip on">🏫 ${esc(className())}</span></div>${ifHomeCard()}
    <div class="home-grid two">
      <button class="home-btn prof" data-action="openProf"><span class="ico">👩‍🏫</span>Tablette enseignant<small>🔒 code · préparer · QR de la leçon · bilans</small></button>
      <button class="home-btn saisie" data-action="toEleve"><span class="ico">🧒</span>Tablette élève<small>Scanner la leçon · observer · saisir · envoyer</small></button></div>
    <div class="home-tools">${cxInstallBtn()}</div></div>`;
}

/* ---------- Pages ajoutées aux étapes ---------- */
function ifSonsPage(){
  const T = LV().tm;
  return `<div class="card compact"><h2>🔔 Signaux sonores</h2><div class="muted" style="font-weight:700">Utilisés par le minuteur, le chrono de l'échauffement et le chrono de récupération. Les annonces utilisent la voix française de la tablette.</div>
      <div class="btn-row" style="margin-top:8px">${lvTgl('tm.voice', '🔊 Annonce vocale des exercices')}<button class="btn small" data-action="ifTestSnd" data-v="whistle">▶️ Tester le sifflet</button><button class="btn small" data-action="ifTestSnd" data-v="beep">▶️ Tester les bips (3 dernières secondes)</button><button class="btn small" data-action="ifTestSnd" data-v="voice">▶️ Tester la voix</button></div>
      <table class="simple" style="margin-top:10px"><tr><th>Moment</th><th>Signal</th></tr><tr><td>Début d'un effort</td><td>Sifflet + annonce du nom de l'exercice</td></tr><tr><td>3 dernières secondes</td><td>Bips</td></tr><tr><td>Récupération</td><td>Bip grave + annonce « Récupération, ensuite : … »</td></tr><tr><td>Fin</td><td>Long bip + « Terminé, bravo ! »</td></tr><tr><td>Fin d'une récupération (panneau)</td><td>Vibration de la tablette</td></tr></table></div>`;
}
function ifTablePage(){
  const sel = UI.tbSel || 'all', groups = [...new Map(MOB_IDS.map(k => [lvPcts(MOB[k]).join(','), k])).values()];
  const pcts = sel === 'all' ? [...new Set(MOB_IDS.flatMap(k => lvPcts(MOB[k])))].sort((a, b) => a - b) : lvPcts(MOB[sel]);
  return `<div class="card compact"><div class="row"><h2 class="grow" style="margin:0">📈 Table % de la RM</h2><button class="btn small" data-action="ifTablePrint">🖨️ Imprimer</button></div>
      <div class="seg wrap" style="margin:8px 0">${[['all', 'Tous les thèmes'], ...groups.map(k => [k, `${MOB[k].ico} ${MOB[k].n}`])].map(([k, t]) => `<button class="${sel === k ? 'on norm' : ''}" data-action="ifTbSel" data-v="${k}">${esc(t)}</button>`).join('')}</div>
      <div class="lv-tbox" style="max-height:none">${lvTableHTML(pcts)}</div></div>${lvProfLivret(['table'])}`;
}
function ifTimerPage(){
  return `<div class="card compact"><h2>⏱️ Minuteur</h2><div class="muted" style="font-weight:700">Circuit training, gainage, Tabata ou unités de 40 s (épreuve). Sur tablette élève, il est aussi dans les outils de l'accueil.</div>
      <div class="pmenu tools" style="margin-top:8px">${CX_TM_PRESETS.map((p, i) => `<button class="pm-btn" data-action="ifTmPreset" data-i="${i}"><span class="ico">${p.units ? '🔢' : '⏱️'}</span>${esc(p.n)}<small>${p.units ? `${p.rounds} unités de ${p.work} s` : `${p.work} s d'effort · ${p.rest} s de récup · ${p.rounds} série(s)`}</small></button>`).join('')}</div>
      <div class="btn-row"><button class="btn primary" data-action="cxTimer">⏱️ Ouvrir le minuteur (réglages libres)</button><button class="btn small" data-action="profTab" data-tab="sons">🔔 Signaux sonores</button></div></div>`;
}

/* ---------- Actions ---------- */
const IF_ACTIONS = {
  dockMin: () => { UI.dockMin = !ifDockMin(); ifRenderDock(); },
  dkRest: d => { startRest(+d.s, 'Récupération ' + fmtRest(+d.s), 'dock'); ifRenderDock(); },
  goSaisieP: () => go('saisie'),
  ifTestSnd: d => { if (d.v === 'whistle') cxWhistle(); else if (d.v === 'beep') { cxBeep(660, 0.1); setTimeout(() => cxBeep(660, 0.1), 1000); setTimeout(() => cxBeep(660, 0.1), 2000); } else { const v = LV().tm.voice; LV().tm.voice = true; cxSay('Planche, gainage ventral. Trente secondes.'); LV().tm.voice = v; } },
  ifTbSel: d => { UI.tbSel = d.v; rerender(); },
  ifTablePrint: () => { const sel = UI.tbSel || 'all', pcts = sel === 'all' ? [...new Set(MOB_IDS.flatMap(k => lvPcts(MOB[k])))].sort((a, b) => a - b) : lvPcts(MOB[sel]); lvPrint(`<div class="print-page"><div class="print-h">Musculation · table des charges (% de la RM)</div>${lvTableHTML(pcts)}</div>`); },
  ifTmPreset: d => { const p = CX_TM_PRESETS[+d.i]; Object.assign(LV().tm, { work:p.work, rest:p.rest, rounds:p.rounds, restR:p.restR, units:!!p.units }); save(); cxTimerModal(); },
};

let IF_RZ = null; window.addEventListener('resize', () => { clearTimeout(IF_RZ); IF_RZ = setTimeout(() => { try { ifRenderDock(); } catch(e){} }, 150); });
