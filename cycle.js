/* =====================================================================
   Musculation — fonctions reprises de l'appli CA1 Demi-fond et adaptées
   N'EPS numérique — CA5 — Emilie BIDAULT et Quentin DELISLE
   · évaluation de fin de cycle (grille, degrés, points, appréciation, fiches familles)
   · auto-évaluation de l'élève sur sa tablette
   · groupements automatiques et binômes d'observation
   · minuteur de circuit (gainage, circuit training) avec sifflet et voix
   · petite forme du jour, fiches à imprimer, ateliers avec / sans matériel
   Chargé avant app.js (déclarations seulement).
   ===================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   1. Grilles d'évaluation de fin de cycle (modèles modifiables)
   critère : { id, afl, name, max, auto, self, desc:[4 degrés] }
   auto : aide à la saisie (degré suggéré d'après les données de l'appli)
   self : proposé en auto-évaluation sur la tablette élève
   --------------------------------------------------------------------- */
const EV_LEVELS = ['Objectifs non atteints', 'Partiellement atteints', 'Atteints', 'Dépassés'];
const EV_COLS = ['#D93025', '#F29900', '#7CB342', '#188038'];
const EV_PRESETS = {
  livret: { label:'Lycée · livret EPPCS (AFL1 détaillé)', title:'Évaluation · Musculation', on20:true, pts:'haut', split:true, criteria:[
    ['wu','AFL1 · Produire','Échauffement',1,'wu',1,['Échauffement peu pertinent, voire inexistant','Échauffement incomplet et peu structuré','Échauffement structuré et complet (durée, variété des exercices)','Échauffement structuré et complet (durée, variété des exercices) et orienté en fonction de la séance']],
    ['resp','AFL1 · Produire','Respiration',1,'pil:fati',1,['Aucun rythme respiratoire : respire quand il peut ou ne respire pas du tout','Un début de rythme respiratoire, pas systématique','Expire toujours dans l\'effort et inspire dans le relâchement','Expire dans l\'effort et inspire dans le relâchement même en difficulté (effort intense, fatigue)']],
    ['dos','AFL1 · Produire','Positionnement du dos',1,'pil:plac',1,['Positionnement incorrect, non sécuritaire dès le début des séries','Le positionnement se déforme au fil des séries','Bien placé tout au long des séries','Fait particulièrement attention au placement de son dos toute la séance']],
    ['trajet','AFL1 · Produire','Trajet moteur',1,'pil:ampl',1,['Trajets moteurs incorrects et non sécuritaires dès le début des séries','Le trajet moteur se raccourcit avec la difficulté','Le trajet moteur reste efficace tout au long des séries','Le trajet moteur reste efficace même en zone d\'effort intense']],
    ['rythme','AFL1 · Produire','Rythme',1,'pil:comp',1,['Rythme sans lien avec l\'objectif de travail','Rythme requis tenu sur certains ateliers seulement','Rythme du thème pris en compte, mais abandonné en difficulté','Rythme du thème tenu tout au long de la séance']],
    ['charge','AFL1 · Produire','Charge',1,'pil:equi',1,['Charge sous-estimée','Charge surestimée','Charge adaptée','Charge adaptée et régulée pendant la séance']],
    ['theme','AFL1 · Produire','Entraînement adapté au thème',1,'param',0,['Paramètres non respectés (séries, répétitions, méthodes)','Paramètres pas toujours respectés','Paramètres cohérents avec le thème','Paramètres cohérents et individualisés selon le mobile de l\'élève']],
    ['recup','AFL1 · Produire','Récupération',1,'',1,['Récupération entre les séries non respectée','Récupération respectée sur certains ateliers seulement','Temps de récupération respecté, mais étirements et hydratation absents','Récupération bien menée (durée, hydratation, étirements)']],
    ['bilan','AFL1 · Analyser','Bilan de séance',2,'cq',0,['Bilan absent ou très succinct, pas d\'analyse','Bilan peu approfondi : énonce l\'écart prévu / réalisé','Bilan complet : analyse le contenu de la séance (difficultés, adaptations)','Propose des perspectives pour une future séance']],
    ['justif','AFL1 · Analyser','Analyse et justification des choix',2,'just',0,['Justifications évasives, n\'exploitent ni l\'observation ni le ressenti','S\'appuient soit sur des connaissances, soit sur le ressenti et le vécu','Certains choix justifiés par des connaissances, le ressenti et le vécu','Tous les choix justifiés par des connaissances, le ressenti et le vécu ; analyse fine']],
    ['afl2','AFL2','Choix et conception de son entraînement',4,'carnet',0,['Séquence inadaptée à ses ressources ou au thème ; répète les mêmes erreurs ; bilans peu présents','Reproduit de façon stéréotypée un projet avec quelques incohérences ; ne tient pas compte des bilans','Conçoit un projet pertinent : charge, répétitions, séries en lien avec le thème ; s\'appuie sur ses bilans','Conçoit, régule et justifie son projet ; planification optimale, diversification des méthodes']],
    ['afl3','AFL3','Coopérer pour faire progresser',4,'obs',0,['Agit seul ; n\'aide pas à l\'installation, ne pare pas','Aide à l\'installation, pare, mais n\'observe pas','Aide, observe et pare son partenaire à partir d\'indicateurs simples','Conseille son partenaire sur le placement et la charge à partir d\'indicateurs précis']] ] },
  lycee: { label:'Lycée · CA5 (AFL1, AFL2, AFL3)', title:'Évaluation · CA5 Musculation', on20:true, pts:'milieu', split:true, criteria:[
    ['prod','AFL1','Produire : s\'engager pour obtenir les effets recherchés',8,'pil',1,['Gestuelles non maîtrisées, erreurs répétées, matériel mal utilisé','Dégradations répétées des postures ; charge ou paramètres incohérents','Gestuelles et postures efficaces ; charge adaptée ; paramètres cohérents avec le thème','Techniques efficientes en zone d\'effort intense ; charge optimisée et régulée ; choix individualisés']],
    ['ana','AFL1','Analyser : ressentis et régulations',4,'rs',0,['Ressentis non identifiés ; régulations absentes ou incohérentes','Ressentis identifiés en partie ; régulations inadaptées','Ressentis identifiés ; régulations à partir des ressentis ou de données chiffrées','Ressentis fins reliés à l\'activité ; régulations croisant données et ressentis ; régulation différée']],
    ['afl2','AFL2','S\'entraîner : concevoir et réguler sa séquence',4,'carnet',0,['Choix non référencés et potentiellement dangereux','Mise en relation incohérente des indicateurs et des effets recherchés','Séquences cohérentes à partir de paramètres simples','Personnalisation et régulations adaptées des paramètres']],
    ['afl3','AFL3','Coopérer : rôles de juge, coach et observateur',4,'obs',0,['Agit seul et pour lui-même','Collabore ponctuellement, de façon organisationnelle','Disponible et réactif pour observer et aider à partir d\'indicateurs simples','Conseille volontairement à partir d\'indicateurs précis et pertinents']] ] },
  national: { label:'Lycée · exemple national (unités de 40 s)', title:'Épreuve · CA5 Musculation', on20:true, pts:'milieu', split:true, criteria:[
    ['charge','AFL1 · Produire','Charge de travail',4,'param',0,['Dangereuse','Inefficace par rapport au thème','Efficace par rapport au thème','Ajustée pour être au seuil']],
    ['gest','AFL1 · Produire','Gestuelles (amplitude, rythme, forme) et postures',4,'pil',1,['Dangereuses ou non significatives','Sécuritaires (forme et posture défaillantes)','Adaptées aux muscles sollicités','Ajustées par rapport aux qualités développées']],
    ['ress','AFL1 · Analyser','Identification de ressentis',2,'rs',1,['Absente','Formelle','Prélève des indices de fatigue ou de ressenti','Fait parler des indices de fatigue ou de ressenti par rapport à son thème']],
    ['regul','AFL1 · Analyser','Régulation',2,'just',0,['Pas d\'ajustement sans remédiation de l\'enseignant','Hasardeuse, formelle','Ponctuelle','Dans l\'exercice et la séquence']],
    ['prog','AFL2','Programmer (exercices, ordre, paramètres de charge)',2,'carnet',0,['Perdu dans sa programmation','Suit une programmation aléatoire','Suit une programmation pertinente','Suit une programmation pertinente et justifiée']],
    ['suiv','AFL2','Suivre son évolution (au cours de la séquence)',2,'cq',0,['S\'égare','Reproduit','Applique','Transpose, questionne, justifie']],
    ['afl3','AFL3','Coopérer : co-entraînement',4,'obs',0,['Se perturbent ou sont dangereux','Agissent à côté, sans se gêner','S\'organisent ensemble','Enrichissent leur entraînement']] ] },
  eps79: { label:'Collège · niveaux du Dossier EP&S n°79', title:'Évaluation · Musculation (niveau initial à niveau 3)', on20:true, pts:'milieu', split:false, criteria:[
    ['plac','Production','Placement initial',2,'pil:plac',1,['Placement approximatif : bassin non fixé, prise de barre déséquilibrée','Placement juste : fixation des articulations et des ceintures','Placement initial irréprochable','Placement irréprochable, conservé en zone d\'effort']],
    ['traj','Production','Trajet moteur (amplitude, rythme)',4,'pil:ampl',1,['Compensations (déséquilibre, tronc non fixé), saccades, dissymétrie ; vitesse inadaptée','Trajet respecté sauf avec la fatigue ; difficultés à contrôler le retour (excentrique)','Mouvements lents ou rapides selon le projet ; le rythme perd de sa régularité avec la fatigue','Exécution totalement maîtrisée ; vitesse adaptée aux motifs et au type de séance']],
    ['charge','Production','Gestion de la charge',4,'param',0,['Charge souvent inadaptée (surévaluée ou sous-évaluée)','Les tests sont utilisés directement ; adaptations simples en fin de séance','La prise en compte des sensations permet d\'adapter la charge pendant la séance','Charge anticipée selon l\'état de forme et adaptée dans la séquence (sensations, efforts perçus)']],
    ['resp','Production','Respiration',2,'pil:fati',1,['Apnée ou expiration placée au hasard ; respiration inversée en tirage','Expire et inspire sur les bonnes phases ; arrêts quand c\'est difficile','Blocage en début de phase concentrique avec les charges lourdes, respiration au service du mouvement','Dosage des phases selon la difficulté et le % de charge']],
    ['prog','Gestion de la séance','Suivi du programme',2,'carnet',0,['Programme souvent inachevé (mauvaise gestion de la charge)','Programme rarement respecté (gestion inadaptée des paramètres)','Programme généralement réalisé, quelques imprécisions','Volume de travail optimal par rapport à l\'objectif et aux capacités']],
    ['roles','Gestion de la séance','Rôles sociaux (aide, parade, observateur)',2,'obs',0,['Acteur seulement ; difficultés à aider et parer','Prévoit les parades, intervient sans gêner ; quelques oublis','Actions, aides et parades efficaces ; conseille','Le pareur devient indispensable (séries brûlantes, super-séries) ; ses conseils aident à réguler la charge']],
    ['temps','Gestion de la séance','Temps de travail et de récupération',2,'',0,['Le temps est géré par l\'enseignant','Gère sa série et sa récupération avec des repères de l\'enseignant','Gère entièrement l\'organisation de sa séquence','Gère sa séance de façon totalement autonome']],
    ['concept','Conception','Programmation et justification des ateliers',2,'just',0,['Ateliers « culturels » ; erreurs de calcul ; justifications évasives','Choix rationnel (équilibres) ; connaît une douzaine d\'ateliers','Connaît une vingtaine d\'ateliers ; relie muscles principaux et étirements ; justifie par le motif','Conçoit une séance « page blanche » ; justifie par les équilibres, le motif et ses points forts / faibles']] ] },
  college: { label:'Collège · cycle 4 (avec ou sans matériel)', title:'Évaluation · Renforcement musculaire', on20:true, pts:'milieu', split:false, criteria:[
    ['real','Produire','Réaliser des exercices en sécurité (placement, respiration, trajet)',8,'pil',1,['Postures dangereuses, respiration bloquée, mouvements incontrôlés','Placement correct au début, qui se dégrade avec la fatigue','Placement, respiration et trajet corrects sur toute la série','Placement, respiration et trajet maîtrisés même en fin de série, au niveau de difficulté adapté']],
    ['proj','Concevoir','Construire et adapter sa séance (exercices, niveaux, séries)',4,'param',0,['Exercices choisis au hasard, niveau inadapté','Séance copiée, peu adaptée à ses ressources','Séance cohérente : exercices agoniste / antagoniste, niveau adapté','Séance adaptée et régulée d\'une leçon à l\'autre']],
    ['soi','Connaître','Connaître ses ressentis et son échauffement',4,'wu',1,['Ne sait pas dire ce qu\'il ressent ; échauffement négligé','Ressentis vagues ; s\'échauffe quand on le lui demande','Relie ressentis et effort ; échauffement complet','Utilise ses ressentis pour régler sa séance ; échauffement autonome et orienté']],
    ['roles','Coopérer','Rôles, sécurité et entraide',4,'obs',0,['Observateur peu fiable ; consignes de sécurité oubliées','Relevés avec oublis ; pare quand on le lui demande','Relevés fiables ; pare et aide son partenaire','Relevés fiables et conseils utiles sur le placement et la charge']] ] },
};
const EV_AUTO = { '':'Aucune', wu:'Échauffement (degré retenu ou indicatif)', param:'Paramètres cohérents avec le thème', rs:'Ressentis dans les zones recherchées', cq:'Questions du carnet remplies', just:'Analyses et justifications écrites', carnet:'Note de carnet d\'entraînement (/4)', obs:'Note d\'observateur (/4)', pil:'Moyenne de tous les piliers' };
function evMakeGrid(key){ const p = EV_PRESETS[key];
  return { preset:key, title:p.title, on20:p.on20, pts:p.pts, split: p.split ? { on:true, opts:['4-4','6-2','2-6'], a:'AFL2', b:'AFL3' } : { on:false, opts:['4-4','6-2','2-6'], a:'AFL2', b:'AFL3' },
    self:'eval', criteria:p.criteria.map(([id, afl, name, max, auto, self, desc]) => ({ id, afl, name, max, auto, self:!!self, desc:desc.slice() })) }; }
function EG(){ if (!ROOT.evG) ROOT.evG = evMakeGrid(ROOT.mobPreset === 'neps' ? 'lycee' : 'livret'); return ROOT.evG; }
function evData(){ S.evalF = S.evalF || { date: Date.now(), data:{} }; return S.evalF; }
function evOf(sid){ const E = evData(); return E.data[sid] = E.data[sid] || { c:{}, comment:'' }; }
const ev05 = x => Math.round(x * 4) / 4;
const evFmt = v => v == null ? '–' : String(Math.round(v * 100) / 100).replace('.', ',');
/* répartition AFL2 / AFL3 choisie par l'élève (4-4, 6-2, 2-6) */
function evSplitOf(sid){ const g = EG(); if (!g.split?.on) return null; const e = S.evalF?.data?.[sid]; const s = e?.split || g.split.opts[0]; return s.split('-').map(Number); }
function evMax(c, sid){ const g = EG(), sp = sid ? evSplitOf(sid) : null;
  if (sp && g.split.on) { if (c.afl === g.split.a) return sp[0]; if (c.afl === g.split.b) return sp[1]; } return +c.max || 0; }
const evGridMax = sid => EG().criteria.reduce((a, c) => a + evMax(c, sid), 0);
function evDegValues(max, d){ const st = max <= 2 ? 0.25 : 0.5, lo = (d - 1) * max / 4, hi = d * max / 4, out = [];
  for (let v = 0; v <= max + 1e-9; v += st) if ((d === 1 ? v >= lo : v > lo + 1e-9) && v <= hi + 1e-9) out.push(Math.round(v * 100) / 100);
  if (!out.length) out.push(ev05(hi)); return out; }
function evDefPts(max, d){ const v = evDegValues(max, d); return EG().pts === 'haut' ? v[v.length - 1] : v[Math.floor((v.length - 1) / 2 + 0.5)]; }
function evScore(sid){ const e = S.evalF?.data?.[sid], g = EG(), M = evGridMax(sid);
  if (!e) return { sum:0, n:0, done:false, note:null, max: g.on20 ? 20 : M };
  let sum = 0, n = 0; g.criteria.forEach(c => { const x = e.c[c.id]; if (x && x.d) { sum += x.p || 0; n++; } });
  return { sum, n, done: n === g.criteria.length, note: g.on20 && M ? Math.round(sum * 20 / M * 4) / 4 : sum, max: g.on20 ? 20 : M }; }

/* données du cycle utilisées pour les suggestions */
function evLessons(sid){ const out = []; for (let n = 1; n <= S.settings.nbLessons; n++) { const r = res(n, sid); if (r && present(n, sid)) out.push({ n, r }); } return out; }
const evDegOfRatio = q => q == null ? null : q >= 0.85 ? 4 : q >= 0.6 ? 3 : q >= 0.35 ? 2 : 1;
const evDegOf10 = v => v == null ? null : v >= 8 ? 4 : v >= 6 ? 3 : v >= 4 ? 2 : 1;
function evSuggest(c, sid){
  const a = c.auto || '', L = evLessons(sid);
  if (a === 'wu') { for (let i = L.length - 1; i >= 0; i--) { const n = L[i].n, pd = lesson(n).wfEv?.[sid]?.d; if (pd) return { d:pd, why:`degré retenu à la leçon ${n}` };
      const f = L[i].r.wu?.f; if (f && f.ex?.length) { const an = lvWfAnalyse(n, sid, f); return { d:an.deg, why:`fiche de la leçon ${n} (indicatif)` }; } }
    const ok = L.filter(x => x.r.wu?.ok).length; return L.length ? { d: evDegOfRatio(ok / L.length), why:`échauffement fait ${ok}/${L.length} leçon(s)` } : null; }
  if (a === 'pil' || a.startsWith('pil:')) { const pid = a.split(':')[1], v = [];
    L.forEach(({ n }) => { const pm = pilMeans(n, sid); Object.entries(pm).forEach(([id, x]) => { if (x != null && (!pid || id === pid)) v.push(x); }); });
    if (pid) { const ev = []; L.forEach(({ n }) => { const x = lesson(n).ev?.[sid]?.[pid]; if (x) ev.push(x); }); if (ev.length) v.push(...ev); }
    const m = avg(v); return m == null ? null : { d: evDegOf10(m), why:`moyenne ${pid ? '« ' + (pilier(pid)?.n || pid) + ' »' : 'des piliers'} : ${fmt(m)}/10` }; }
  if (a === 'param') { let tot = 0, ok = 0; L.forEach(({ n, r }) => (r.ex || []).forEach(E => { if (E.k !== 'th') return; const M = lvChoiceOn(n, sid, E), t = target(n, sid, E); if (!M || !t) return; tot++; if (!lvCoherence(M, t).length) ok++; }));
    return tot ? { d: evDegOfRatio(ok / tot), why:`${ok}/${tot} atelier(s) dans les fourchettes du thème` } : null; }
  if (a === 'rs') { let tot = 0, ok = 0; L.forEach(({ n, r }) => (r.ex || []).forEach(E => { const M = mobP(n, E.mob || mobOf(n, sid)); if (!M || !E.rs) return;
      LV().rs.sc.forEach(sc => { const z = M[lvZoneKey(sc.k)]; if (!z) return; vals(E.rs[sc.k]).forEach(v => { tot++; if (v >= z[0] && v <= z[1]) ok++; }); }); }));
    return tot ? { d: evDegOfRatio(ok / tot), why:`${ok}/${tot} ressenti(s) dans les zones recherchées` } : null; }
  if (a === 'cq') { let tot = 0, ok = 0; L.forEach(({ n, r }) => { const Q = lvCqList(n); tot += Q.length; ok += Q.filter(q => (r.cq?.[q.id] || '').trim().length > 10).length; });
    return tot ? { d: evDegOfRatio(ok / tot), why:`${ok}/${tot} réponse(s) du carnet` } : null; }
  if (a === 'just') { let tot = 0, ok = 0; L.forEach(({ r }) => (r.ex || []).forEach(E => { if (E.k === 'max') return; tot++; if ((E.ju || '').trim().length > 10) ok++; }));
    return tot ? { d: evDegOfRatio(ok / tot), why:`${ok}/${tot} atelier(s) justifié(s)` } : null; }
  if (a === 'carnet') { const v = carnetNote(S.settings.nbLessons, sid); return v == null ? null : { d: Math.max(1, Math.min(4, Math.round(v))), why:`carnet d'entraînement : ${fmt(v)}/4` }; }
  if (a === 'obs') { const v = []; for (let n = 1; n <= S.settings.nbLessons; n++) { const x = observerNote(n, sid); if (x?.v != null) v.push(x.v); else if (typeof x === 'number') v.push(x); }
    const m = avg(v); return m == null ? null : { d: Math.max(1, Math.min(4, Math.round(m))), why:`note d'observateur : ${fmt(m)}/4` }; }
  return null;
}
/* auto-évaluation de l'élève (dernière leçon où il s'est positionné) */
function evSelfOf(sid, cid){ for (let n = S.settings.nbLessons; n >= 1; n--) { const v = res(n, sid)?.ae?.[cid]; if (v) return { d:v, n }; } return null; }

/* ---------------------------------------------------------------------
   2. Appréciation proposée (modifiable), adaptée à la musculation
   --------------------------------------------------------------------- */
const evListFr = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1];
function evAppreciation(sid){
  const g = EG(), q = evScore(sid), e = S.evalF?.data?.[sid] || { c:{} }, P = nameOf(sid).split(' ')[0] || 'Cet élève';
  const pick = arr => { let h = 0; for (const ch of sid + arr.length) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return arr[h % arr.length]; };
  let lvl; if (q.n) { const r = q.note / (q.max || 20); lvl = r >= 0.8 ? 4 : r >= 0.6 ? 3 : r >= 0.4 ? 2 : 1; }
  else { const v = g.criteria.map(c => evSuggest(c, sid)?.d).filter(Boolean); lvl = v.length ? Math.round(avg(v)) : 2; }
  const out = [];
  out.push(pick({ 4:[`${P} a réalisé un très beau cycle de musculation, avec un engagement constant et des séances bien construites.`, `${P} a mené un excellent cycle de musculation : sérieux, rigueur technique et séances adaptées à son projet.`],
    3:[`${P} a fourni un travail sérieux et régulier tout au long du cycle de musculation.`, `${P} s'est bien investi(e) dans ce cycle de musculation et a mené ses séances avec sérieux.`],
    2:[`${P} a montré de l'engagement dans le cycle de musculation, avec une exécution encore irrégulière.`, `${P} a participé au cycle de musculation avec de la bonne volonté, mais les séances restent inégales.`],
    1:[`${P} a rencontré des difficultés pendant ce cycle de musculation et n'a pas toujours réussi à tenir ses séances.`, `${P} a eu du mal à s'engager durablement dans les séances de ce cycle de musculation.`] }[lvl]));
  const degT = re => { const v = g.criteria.filter(c => re.test(c.name + ' ' + (c.afl || ''))).map(c => e.c[c.id]?.d || evSuggest(c, sid)?.d).filter(Boolean); return v.length ? Math.round(avg(v)) : null; };
  const tech = degT(/respir|dos|trajet|placement|produire|réaliser|rythme/i);
  if (tech) out.push({ 4:'La technique est maîtrisée : placement, respiration et trajet moteur restent efficaces même dans l\'effort intense.', 3:'La technique est correcte : placement, respiration et trajet moteur sont respectés.', 2:'La technique se dégrade encore avec la fatigue : placement et respiration sont à consolider.', 1:'La technique doit progresser : le placement et la respiration ne sont pas encore sûrs.' }[tech]);
  const proj = degT(/thème|param|concevoir|afl2|charge|s'entra/i);
  if (proj) out.push({ 4:'Les choix d\'entraînement (charges, séries, répétitions) sont cohérents avec le thème et bien régulés.', 3:'Les choix d\'entraînement sont cohérents avec le thème retenu.', 2:'Les choix d\'entraînement ne sont pas toujours cohérents avec le thème : il faut mieux s\'appuyer sur la RM et les fourchettes.', 1:'Les paramètres d\'entraînement sont encore choisis au hasard.' }[proj]);
  const ana = degT(/analys|bilan|justif|ressenti|connaître/i);
  if (ana) out.push({ 4:'Les ressentis sont finement analysés et servent à réguler la séance.', 3:'Les ressentis sont identifiés et reliés à l\'effort.', 2:'L\'analyse des ressentis reste partielle.', 1:'Les ressentis et les bilans doivent être davantage exploités.' }[ana]);
  const coop = degT(/coop|r[oô]le|afl3|observ|coach/i);
  if (coop) out.push({ 4:'Dans le rôle de coach et d\'observateur, l\'élève conseille son partenaire avec pertinence.', 3:'Les rôles de pareur et d\'observateur sont assurés avec sérieux.', 2:'Les rôles sociaux sont assurés, avec encore des imprécisions dans l\'observation.', 1:'Les rôles de pareur et d\'observateur doivent être pris plus au sérieux.' }[coop]);
  const strong = g.criteria.filter(c => e.c[c.id]?.d === 4).map(c => c.name), weak = g.criteria.filter(c => { const d = e.c[c.id]?.d; return d && d <= 2; }).map(c => c.name);
  if (strong.length) out.push(`Point${strong.length > 1 ? 's' : ''} fort${strong.length > 1 ? 's' : ''} : ${evListFr(strong.map(x => '« ' + x + ' »'))}.`);
  if (weak.length) out.push(`Des efforts restent à fournir sur ${evListFr(weak.map(x => '« ' + x + ' »'))}.`);
  const ups = []; maxedMachines(sid).forEach(id => { const h = maxHist(sid, id); if (h.length > 1 && h[h.length - 1].v > h[0].v) ups.push(mName(id)); });
  if (ups.length) out.push(`Les max progressent sur ${ups.length > 2 ? ups.length + ' ateliers' : evListFr(ups)}.`);
  out.push(lvl === 4 ? pick(['Bravo pour ce très beau cycle, continue ainsi !', 'Félicitations, c\'est un cycle exemplaire !']) : lvl === 3 ? pick(['Bon travail, continue sur cette lancée !', 'C\'est un cycle réussi, bravo !'])
    : lvl === 2 ? pick(['Continue tes efforts, les progrès sont à ta portée !', 'Persévère, tu as les moyens de progresser !']) : 'Ne te décourage pas : avec de la régularité, tu progresseras !');
  return out.join(' ');
}
function evSyncApp(sid){ const e = evOf(sid); if (!e.comment || e.auto) { const t = evAppreciation(sid); if (t !== e.comment) { e.comment = t; e.auto = true; } } return e; }

/* ---------------------------------------------------------------------
   3. Écrans enseignant : grille, saisie, fiches familles
   --------------------------------------------------------------------- */
const evDegBadge = (d, sm) => d ? `<span class="ev-lv" style="background:${EV_COLS[d - 1]}">${d}</span>${sm ? '' : ' ' + esc(EV_LEVELS[d - 1])}` : '<span class="muted">–</span>';
function evProfGrid(){
  const g = EG(), M = evGridMax();
  return `<div class="card strong"><div class="row"><h2 class="grow" style="margin:0">📝 Grille d'évaluation de fin de cycle</h2>${Object.entries(EV_PRESETS).map(([k, p]) => `<button class="btn small ${g.preset === k ? 'primary' : ''}" data-action="evPreset" data-v="${k}">↺ ${esc(p.label)}</button>`).join('')}</div>
      <div class="muted" style="font-weight:700;margin-top:6px">Chaque critère a 4 degrés : le degré fixe la fourchette de points, vous choisissez la note précise. Modèles tirés de votre livret (repères AFL1, AFL2, AFL3) : tout est modifiable.</div>
      <div class="lv-mgrid"><label class="field lv-f"><span>Titre</span><input type="text" data-field="evG" data-k="title" value="${esc(g.title)}"></label>
        <label class="field lv-f"><span>Points dans le degré</span><select data-field="evG" data-k="pts"><option value="haut" ${g.pts === 'haut' ? 'selected' : ''}>Haut de la fourchette (livret : 0,25 / 0,5 / 0,75 / 1)</option><option value="milieu" ${g.pts !== 'haut' ? 'selected' : ''}>Milieu de la fourchette</option></select></label>
        <label class="field lv-f"><span>Auto-évaluation des élèves sur la tablette</span><select data-field="evG" data-k="self"><option value="none" ${g.self === 'none' ? 'selected' : ''}>Jamais</option><option value="eval" ${g.self === 'eval' ? 'selected' : ''}>Leçons d'évaluation</option><option value="all" ${g.self === 'all' ? 'selected' : ''}>Toutes les leçons</option></select></label></div>
      <div class="btn-row"><button class="tgl ${g.on20 ? 'on' : ''}" data-action="evTgl" data-k="on20">Note ramenée sur 20 : <b>${g.on20 ? 'oui' : 'non'}</b></button>
        <button class="tgl ${g.split.on ? 'on' : ''}" data-action="evTgl" data-k="split">Répartition AFL2 / AFL3 au choix de l'élève : <b>${g.split.on ? 'oui' : 'non'}</b></button>
        ${g.split.on ? `<span class="muted" style="font-weight:800">Choix possibles</span><input type="text" style="max-width:200px" data-field="evG" data-k="splitOpts" value="${esc(g.split.opts.join(', '))}">` : ''}
        <span class="tag ${M === 20 || g.on20 ? 'ok' : 'mod'}">Total : ${evFmt(M)} points${g.on20 && M !== 20 ? ' → ramené sur 20' : ''}</span></div></div>
    <details class="card compact"><summary><b>📈 Repères de progressivité 2nde → Terminale</b> (modifiable)</summary>${lvIn('prog', 'area', 'rows="10"')}</details>
    ${g.criteria.map((c, i) => `<div class="card compact"><div class="row lv-zrow"><input type="text" style="max-width:150px" data-field="evC" data-i="${i}" data-k="afl" value="${esc(c.afl || '')}" placeholder="Repère">
        <input type="text" class="grow" data-field="evC" data-i="${i}" data-k="name" value="${esc(c.name)}"><input type="number" step="0.25" min="0.25" style="max-width:100px" data-field="evC" data-i="${i}" data-k="max" value="${c.max}">
        <select data-field="evC" data-i="${i}" data-k="auto" style="max-width:300px">${[...Object.entries(EV_AUTO), ...piliers().map(p => ['pil:' + p.id, 'Pilier « ' + p.n + ' »'])].map(([k, t]) => `<option value="${k}" ${c.auto === k ? 'selected' : ''}>💡 ${esc(t)}</option>`).join('')}</select>
        <button class="tgl ${c.self ? 'on' : ''}" data-action="evSelfT" data-i="${i}">🪞 auto-éval.</button>
        <button class="btn small ghost" data-action="evMove" data-i="${i}" data-d="-1" ${i ? '' : 'disabled'}>▲</button><button class="btn small ghost" data-action="evMove" data-i="${i}" data-d="1" ${i < g.criteria.length - 1 ? '' : 'disabled'}>▼</button><button class="btn small red" data-action="evDel" data-i="${i}">🗑</button></div>
      <div class="ev-descs">${[0,1,2,3].map(j => { const v = evDegValues(+c.max || 0, j + 1); return `<label class="field lv-f"><span>${evDegBadge(j + 1, true)} ${esc(EV_LEVELS[j])} · ${evFmt(v[0])} à ${evFmt(v[v.length - 1])} pt</span><textarea rows="3" data-field="evC" data-i="${i}" data-k="d${j}">${esc(c.desc[j] || '')}</textarea></label>`; }).join('')}</div></div>`).join('')}
    <div class="btn-row"><button class="btn green" data-action="evAdd">＋ Critère</button></div>`;
}
function evProfSaisie(){
  const g = EG(), L = sortedStudents(); if (!L.length) return '<div class="card">Aucun élève.</div>';
  if (!L.some(s => s.id === UI.evSid)) UI.evSid = L[0].id;
  const sid = UI.evSid, i = L.findIndex(s => s.id === sid), e = evSyncApp(sid), sc = evScore(sid), sp = evSplitOf(sid);
  const nDone = L.filter(s => evScore(s.id).done).length;
  return `<div class="card strong compact"><div class="row"><b class="grow">${nDone}/${L.length} élève(s) évalué(s)</b><button class="btn small" data-action="evSugAll">💡 Appliquer les suggestions aux élèves non évalués</button><button class="btn small" data-action="evFam">🖨️ Fiches familles</button><button class="btn small" data-action="evCsv">📊 Notes (CSV)</button></div>
      <div class="ev-chips">${L.map(s => { const q = evScore(s.id); return `<button class="ev-chip ${q.done ? 'done' : q.n ? 'part' : ''} ${s.id === sid ? 'on' : ''}" data-action="evSel" data-sid="${s.id}">${esc(nameOf(s.id))}${q.n ? ` <b>${evFmt(q.note)}</b>` : ''}</button>`; }).join('')}</div></div>
    <div class="card"><div class="row"><h2 class="grow" style="margin:0">${band(sid)} ${esc(nameOf(sid))}</h2><div class="ev-total"><span>Note</span><b>${sc.n ? evFmt(sc.note) : '–'}</b><small>/ ${evFmt(sc.max)}</small></div></div>
      ${sp ? `<div class="row" style="margin:6px 0"><b>Répartition ${esc(g.split.a)} / ${esc(g.split.b)} choisie :</b><div class="seg" style="min-width:260px">${g.split.opts.map(o => `<button class="${sp.join('-') === o ? 'on norm' : ''}" data-action="evSplit" data-v="${o}">${o.replace('-', ' / ')}</button>`).join('')}</div></div>` : ''}
      ${g.criteria.map(c => { const x = e.c[c.id] || {}, mx = evMax(c, sid), sug = evSuggest(c, sid), self = evSelfOf(sid, c.id);
        return `<div class="ev-crit"><div class="ev-head"><b>${c.afl ? `<span class="tag mod">${esc(c.afl)}</span> ` : ''}${esc(c.name)}</b><span class="ev-pts">${x.d ? `<b>${evFmt(x.p)}</b>` : '–'} / ${evFmt(mx)} pt</span></div>
          ${sug || self ? `<div class="ev-calc">${sug ? `💡 ${esc(sug.why)} → degré ${sug.d}` : ''}${self ? ` · 🪞 l'élève s'est situé au degré <b>${self.d}</b> (leçon ${self.n})` : ''}</div>` : ''}
          <div class="ev-ds">${[1,2,3,4].map(d => `<button class="ev-d ${x.d === d ? 'on' : ''}" style="--lc:${EV_COLS[d - 1]}" data-action="evDeg" data-c="${c.id}" data-v="${d}"><b>${evDegBadge(d, true)} ${esc(EV_LEVELS[d - 1])}${sug?.d === d ? ' <span class="ev-sug">💡</span>' : ''}${self?.d === d ? ' <span class="ev-sug">🪞</span>' : ''}</b><span>${esc(c.desc[d - 1] || '')}</span></button>`).join('')}</div>
          ${x.d ? `<div class="btn-row ev-vals"><span class="muted">Points :</span>${evDegValues(mx, x.d).map(v => `<button class="btn small ${x.p === v ? 'primary' : ''}" data-action="evPts" data-c="${c.id}" data-v="${v}">${evFmt(v)}</button>`).join('')}</div>` : ''}</div>`; }).join('')}
      <label class="field" style="margin-top:10px"><span class="row">Appréciation pour la famille ${e.auto ? '<span class="tag mod">✨ proposée d\'après les résultats : modifiable</span>' : '<span class="tag ok">✎ personnalisée</span>'}</span><textarea data-field="evCom" rows="5">${esc(e.comment || '')}</textarea></label>
      <div class="btn-row"><button class="btn small" data-action="evRegen">✨ ${e.auto ? 'Actualiser' : 'Remplacer par'} la proposition</button><button class="btn small red" data-action="evClear">Effacer l'évaluation</button></div>
      <div class="nav-bottom"><button class="btn" data-action="evSel" data-sid="${L[(i - 1 + L.length) % L.length].id}">← ${esc(nameOf(L[(i - 1 + L.length) % L.length].id))}</button><button class="btn primary" data-action="evSel" data-sid="${L[(i + 1) % L.length].id}">${esc(nameOf(L[(i + 1) % L.length].id))} →</button></div></div>`;
}
function evProfFinal(){
  const sub = UI.evSub || 'saisie';
  return `<div class="seg" style="max-width:520px;margin-bottom:10px">${[['saisie','✍️ Évaluer les élèves'],['grille','📝 Grille']].map(([k, t]) => `<button class="${sub === k ? 'on norm' : ''}" data-action="evSub" data-v="${k}">${t}</button>`).join('')}</div>` + (sub === 'grille' ? evProfGrid() : evProfSaisie());
}
/* fiche famille (A4 recto-verso : évaluation, puis max et cycle) */
function evFamHTML(sid){
  const g = EG(), e = evSyncApp(sid), q = evScore(sid), sp = evSplitOf(sid), dt = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  const rows = g.criteria.map(c => { const x = e.c[c.id] || {}; return `<tr><td>${c.afl ? `<small>${esc(c.afl)}</small><br>` : ''}<b>${esc(c.name)}</b></td><td class="c">${x.d ? evDegBadge(x.d, true) : '–'}</td><td>${x.d ? esc(c.desc[x.d - 1] || '') : ''}</td><td class="c"><b>${x.d ? evFmt(x.p) : '–'}</b> / ${evFmt(evMax(c, sid))}</td></tr>`; }).join('');
  const recto = `<div class="print-page evf"><div class="evf-h"><div><b>${esc(g.title)}</b><div>${esc(className())} · ${dt}</div></div><div class="evf-n">${esc(nameOf(sid))}</div></div>
    <table class="pj-table evf-t"><tr><th>Critère</th><th>Degré</th><th>Ce qui est atteint</th><th>Points</th></tr>${rows}</table>
    ${sp ? `<p>Répartition choisie : ${esc(g.split.a)} ${sp[0]} pts / ${esc(g.split.b)} ${sp[1]} pts</p>` : ''}
    <div class="evf-note">Note : <b>${q.n ? evFmt(q.note) : '–'}</b> / ${evFmt(q.max)}</div>
    <div class="evf-app"><b>Appréciation</b><p>${esc(e.comment || '')}</p></div>
    <div class="evf-sign"><div>Signature de l'enseignant</div><div>Signature des responsables légaux</div></div></div>`;
  const verso = `<div class="print-page evf"><div class="evf-h"><b>Mes résultats du cycle · ${esc(nameOf(sid))}</b></div><h3>🏋️ Mes max</h3>${maxTable(sid)}<h3>📅 Mes séances</h3>${evFamCycle(sid)}</div>`;
  return recto + verso;
}
function evFamCycle(sid){
  const rows = []; for (let n = 1; n <= S.settings.nbLessons; n++) { const x = lessonSummary(n, sid); if (!x) continue; const T = THEMES[x.th] || {}, r = x.r, f = r?.wu?.f;
    const ex = (r?.ex || []).filter(E => E.k !== 'max').map(E => E.m ? mName(E.m) : E.nm).filter(Boolean);
    rows.push(`<tr><td class="c"><b>L${n}</b></td><td>${T.ico || ''} ${esc(T.n || '')}</td><td>${x.at ? esc(ATT[x.at]?.n || '') : 'Présent'}</td><td>${esc(ex.join(', ')) || (x.ex ? x.ex + ' exercice(s)' : '—')}</td><td class="c">${chipV(x.pil)}</td><td>${f?.ex?.length ? '🔥 ' + f.ex.length + ' ex.' : r?.wu?.ok ? '🔥 ✓' : ''}</td></tr>`); }
  return rows.length ? `<table class="pj-table evf-t"><tr><th>Leçon</th><th>Thème</th><th>Statut</th><th>Ateliers</th><th>Piliers /10</th><th>Échauffement</th></tr>${rows.join('')}</table>` : '<p>Pas encore de séance.</p>';
}
function evCsv(){
  const g = EG(), L = sortedStudents();
  const head = ['Élève', ...g.criteria.flatMap(c => [c.name + ' (degré)', c.name + ' (points)']), 'Total', 'Note', 'Appréciation'];
  const rows = L.map(s => { const e = S.evalF?.data?.[s.id] || { c:{} }, q = evScore(s.id); return [nameOf(s.id), ...g.criteria.flatMap(c => { const x = e.c[c.id]; return x?.d ? [x.d, String(x.p).replace('.', ',')] : ['', '']; }), q.n ? String(q.sum).replace('.', ',') : '', q.n ? String(q.note).replace('.', ',') : '', e.comment || '']; });
  const csv = '﻿' + [head, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' })); a.download = `Evaluation_${fileTag(className())}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 500);
}
/* auto-évaluation sur la tablette (fin de séance) */
function evSelfOn(n){ const g = EG(); return g.self === 'all' || (g.self === 'eval' && ['evi','evf'].includes(thOf(n))); }
function evSelfList(n){ const L = lesson(n); if (Array.isArray(L.aeS) && !isProfRole()) return L.aeS; return EG().criteria.filter(c => c.self).map(c => ({ id:c.id, n:c.name, d:c.desc })); }
/* QR : les descripteurs identiques au modèle ne sont pas envoyés (la tablette les connaît déjà) */
function evSelfPack(n){ const g = EG(), P = EV_PRESETS[g.preset];
  return { p:g.preset, c: evSelfList(n).map(c => { const o = P?.criteria.find(x => x[0] === c.id); return JSON.stringify(o?.[6]) === JSON.stringify(c.d) ? [c.id, c.n] : [c.id, c.n, c.d]; }) }; }
function evSelfUnpack(a){ if (!a || !a.c) return []; const P = EV_PRESETS[a.p];
  return a.c.map(([id, n, d]) => ({ id, n, d: d || P?.criteria.find(x => x[0] === id)?.[6] || ['','','',''] })); }
function evSelfHTML(n, sid, r){
  if (!evSelfOn(n) && !(Array.isArray(lesson(n).aeS) && lesson(n).aeS.length && !isProfRole())) return '';
  const C = evSelfList(n); if (!C.length) return ''; const a = r.ae || {};
  return `<section class="lv-cq ev-self"><h2>🪞 Je me situe <small class="muted">(auto-évaluation)</small></h2>${C.map(c => `<div class="ev-crit"><b>${esc(c.n)}</b><div class="ev-ds">${[1,2,3,4].map(d => `<button class="ev-d ${a[c.id] === d ? 'on' : ''}" style="--lc:${EV_COLS[d - 1]}" data-action="aeSet" data-c="${c.id}" data-v="${d}"><b>${evDegBadge(d, true)}</b><span>${esc(c.d?.[d - 1] || '')}</span></button>`).join('')}</div></div>`).join('')}</section>`;
}

/* ---------------------------------------------------------------------
   4. Groupements automatiques et binômes d'observation
   --------------------------------------------------------------------- */
const CX_GMODES = [['hasard','🎲 Au hasard'],['theme','🎽 Par thème d\'entraînement'],['hetero','⚖️ Équilibrés (piliers)'],['homog','📶 De niveau (piliers)'],['besoin','🧭 Selon un besoin (pilier le plus faible)'],['alpha','🔤 Ordre alphabétique']];
const CX_PMODES = [['grp','🎽 Dans son groupe, au hasard'],['theme','🎯 Même thème d\'entraînement'],['niveau','📶 Niveau proche (piliers)'],['hasard','🎲 Toute la classe, au hasard']];
function cxPilAvg(sid){ const v = []; for (let n = 1; n <= S.settings.nbLessons; n++) Object.values(pilMeans(n, sid)).forEach(x => v.push(x)); return avg(v); }
function cxWeak(sid){ const by = {}; for (let n = 1; n <= S.settings.nbLessons; n++) Object.entries(pilMeans(n, sid)).forEach(([k, x]) => (by[k] = by[k] || []).push(x)); let w = null, wv = 99; Object.entries(by).forEach(([k, a]) => { const m = avg(a); if (m < wv) { wv = m; w = k; } }); return w || ''; }
function cxTheme(sid){ const P = S.projects[sid]; if (P?.mob) return P.mob; for (let n = S.settings.nbLessons; n >= 1; n--) { const m = res(n, sid)?.mob; if (m) return m; } return 'zz'; }
const cxShuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function cxMakeGroups(mode){
  const G = nbGroups(); if (G < 2) return toast('Choisissez d\'abord au moins 2 groupes');
  let L = sortedStudents();
  const chunk = list => list.forEach((s, i) => { s.grp = Math.min(G, Math.floor(i * G / list.length) + 1); });
  if (mode === 'hasard') cxShuffle(L).forEach((s, i) => { s.grp = i % G + 1; });
  else if (mode === 'alpha') chunk(L);
  else if (mode === 'theme') chunk(cxShuffle(L).sort((a, b) => cxTheme(a.id).localeCompare(cxTheme(b.id))));
  else if (mode === 'besoin') chunk(cxShuffle(L).sort((a, b) => cxWeak(a.id).localeCompare(cxWeak(b.id))));
  else { const sc = s => cxPilAvg(s.id) ?? 5; L = cxShuffle(L).sort((a, b) => sc(b) - sc(a));
    if (mode === 'homog') chunk(L); else L.forEach((s, i) => { const r = Math.floor(i / G), k = i % G; s.grp = (r % 2 ? G - k : k + 1); }); }
  save(); render(); toast('✓ Groupes proposés : ajustez-les en faisant glisser les élèves');
}
function cxMakePairs(mode){
  const pairs = {}, L = sortedStudents();
  const link = list => { for (let i = 0; i + 1 < list.length; i += 2) { if (i + 3 === list.length) { const [a, b, c] = list.slice(i); pairs[a.id] = b.id; pairs[b.id] = c.id; pairs[c.id] = a.id; return; } pairs[list[i].id] = list[i + 1].id; pairs[list[i + 1].id] = list[i].id; } };
  if (mode === 'hasard') link(cxShuffle(L));
  else { const keyOf = s => mode === 'grp' ? String(s.grp || 0) : mode === 'theme' ? cxTheme(s.id) : '';
    const by = {}; L.forEach(s => (by[keyOf(s)] = by[keyOf(s)] || []).push(s));
    let rest = [];
    Object.values(by).forEach(list => { list = mode === 'niveau' ? list.slice().sort((a, b) => (cxPilAvg(b.id) ?? 5) - (cxPilAvg(a.id) ?? 5)) : cxShuffle(list);
      if (list.length === 1) rest.push(list[0]); else link(list); });
    if (rest.length > 1) link(rest); else if (rest.length === 1) { const x = rest[0], y = L.find(s => s.id !== x.id); if (y) pairs[x.id] = y.id; } }
  S.pairs = pairs; save(); render(); toast('✓ Binômes proposés : ils sont envoyés avec le QR de la leçon');
}
function cxGroupsCard(){
  const L = sortedStudents(), P = S.pairs || {};
  return `<div class="card compact"><h2>⚡ Former les groupes automatiquement</h2><div class="muted" style="font-weight:700">L'appli propose, puis vous ajustez en faisant glisser les élèves (ou touchez un élève puis le groupe).</div>
      <div class="btn-row" style="margin-top:6px">${CX_GMODES.map(([k, t]) => `<button class="btn small" data-action="cxGroups" data-v="${k}">${t}</button>`).join('')}</div></div>
    <div class="card compact"><h2>👥 Binômes d'observation (qui observe qui)</h2><div class="muted" style="font-weight:700">Proposés en premier à l'observateur sur la tablette (« ⭐ Ton partenaire habituel »). Envoyés avec le QR de la leçon.</div>
      <div class="btn-row" style="margin-top:6px">${CX_PMODES.map(([k, t]) => `<button class="btn small" data-action="cxPairs" data-v="${k}">${t}</button>`).join('')}<button class="btn small ghost" data-action="cxPairsClr">Effacer</button><button class="btn small" data-action="cxPairsPrint">🖨️ Imprimer</button></div>
      <div class="cx-pairs">${L.map(s => `<label class="cx-pair">${band(s.id)}<b>${esc(nameOf(s.id))}</b> observe <select data-field="cxPair" data-sid="${s.id}"><option value="">—</option>${L.filter(x => x.id !== s.id).map(x => `<option value="${x.id}" ${P[s.id] === x.id ? 'selected' : ''}>${esc(nameOf(x.id))}</option>`).join('')}</select></label>`).join('')}</div></div>`;
}

/* ---------------------------------------------------------------------
   5. Minuteur (circuit training, gainage) · sifflet et annonces vocales
   --------------------------------------------------------------------- */
const CX_TM_PRESETS = [
  { n:'Livret leçon 5 · 45 s / 15 s', work:45, rest:15, rounds:3, restR:60 },
  { n:'Tabata · 20 s / 10 s × 8', work:20, rest:10, rounds:8, restR:0, one:true },
  { n:'30 s / 30 s', work:30, rest:30, rounds:2, restR:60 },
  { n:'Gainage · 30 s / 15 s', work:30, rest:15, rounds:2, restR:45 },
  { n:'40 s / 20 s', work:40, rest:20, rounds:3, restR:60 },
  { n:'Épreuve · 30 unités de 40 s (échauffement)', work:40, rest:0, rounds:30, restR:0, units:true },
  { n:'Épreuve · 60 unités de 40 s (séquence)', work:40, rest:0, rounds:60, restR:0, units:true } ];
let CX_AC = null;
function cxAudio(){ try { CX_AC = CX_AC || new (window.AudioContext || window.webkitAudioContext)(); if (CX_AC.state === 'suspended') CX_AC.resume(); } catch(e){} return CX_AC; }
function cxBeep(f = 880, d = 0.15, vol = 0.25){ const A = cxAudio(); if (!A) return; try { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(vol, A.currentTime); g.gain.exponentialRampToValueAtTime(0.001, A.currentTime + d); o.start(); o.stop(A.currentTime + d); } catch(e){} }
const cxWhistle = () => { cxBeep(2900, 0.45, 0.35); setTimeout(() => cxBeep(2900, 0.25, 0.35), 520); };
function cxSay(t){ if (!LV().tm?.voice || !window.speechSynthesis || !t) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; u.rate = 1.05; const v = speechSynthesis.getVoices().find(x => /^fr/i.test(x.lang)); if (v) u.voice = v; speechSynthesis.speak(u); } catch(e){} }
/* moteur commun (minuteur et échauffement) : étapes { ty:'w'|'rx'|'rs', x:{n,ico}, t, sec, reps, nx } */
let CX_RUN = null;
function cxRun(steps, { title = '', tours = 1, onEnd } = {}){
  if (!steps.length) return;
  cxAudio(); CX_RUN = { steps, i:0, end: now() + steps[0].sec * 1000, paused:false, left:steps[0].sec, last:-1, tick:null };
  const m = modal(`<div class="lv-run" id="lv-run"></div>`, { wide:true });
  const announce = st => { if (st.ty === 'w') { cxWhistle(); cxSay(st.x.n + (st.reps ? ', ' + st.reps + ' répétitions' : '')); } else { cxBeep(520, 0.3); cxSay(st.ty === 'rs' ? 'Récupération entre les séries' : 'Récupération' + (st.nx ? '. Ensuite : ' + st.nx.n : '')); } };
  const stop = fin => { const R = CX_RUN; if (R) clearInterval(R.tick); CX_RUN = null; try { speechSynthesis?.cancel(); } catch(e){} if (document.body.contains(m)) closeModal(); if (fin) { cxBeep(990, 0.6); cxSay('Terminé, bravo !'); } if (onEnd) onEnd(!!fin); else rerender(); };
  const next = () => { const R = CX_RUN; if (!R) return; R.i++; if (navigator.vibrate) navigator.vibrate(150); if (R.i >= R.steps.length) return stop(true);
    R.end = now() + R.steps[R.i].sec * 1000; R.paused = false; R.last = -1; announce(R.steps[R.i]); draw(); };
  const draw = () => { const R = CX_RUN; if (!R) return; if (!document.body.contains(m)) { clearInterval(R.tick); CX_RUN = null; try { speechSynthesis?.cancel(); } catch(e){} rerender(); return; }
    const st = R.steps[R.i], left = R.paused ? R.left : Math.max(0, Math.ceil((R.end - now()) / 1000));
    if (!R.paused && left <= 3 && left > 0 && left !== R.last && !(st.ty === 'w' && st.reps)) cxBeep(660, 0.1);
    R.last = left; if (!R.paused && left <= 0 && !(st.ty === 'w' && st.reps)) return next();
    const nx = st.ty === 'w' ? R.steps.slice(R.i + 1).find(x => x.ty === 'w')?.x : st.nx;
    const total = R.steps.reduce((a, x) => a + x.sec, 0), done = R.steps.slice(0, R.i).reduce((a, x) => a + x.sec, 0) + (st.sec - left);
    m.querySelector('#lv-run').innerHTML = `<div class="lv-run-top"><b>${esc(title)}</b>${tours > 1 ? ` · série ${st.t} / ${tours}` : ''}<div class="lv-run-pb"><span style="width:${Math.min(100, done / total * 100)}%"></span></div></div>
      <div class="lv-run-ph ${st.ty}">${st.ty === 'w' ? '💪 Effort' : st.ty === 'rx' ? '😮‍💨 Récupération' : '🔁 Récupération entre les séries'}</div>
      <div class="lv-run-ex">${st.ty === 'w' ? `${esc(st.x.ico || '')} ${esc(st.x.n)}` : '&nbsp;'}</div>
      <div class="lv-run-t">${st.ty === 'w' && st.reps ? `${st.reps} <small>répétitions</small>` : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</div>
      ${st.ty === 'w' && st.reps ? `<div class="muted" style="font-weight:800">à ton rythme · touche « Fait » quand c'est terminé</div>` : ''}
      <div class="lv-run-nx">${nx ? `Ensuite : <b>${esc(nx.n)}</b>` : R.i === R.steps.length - 1 ? '🏁 Dernier effort !' : ''}</div>
      <div class="btn-row" style="justify-content:center;margin-top:14px">${st.ty === 'w' && st.reps ? '<button class="btn green" data-r="next">✓ Fait →</button>' : `<button class="btn" data-r="pause">${R.paused ? '▶️ Reprendre' : '⏸ Pause'}</button><button class="btn" data-r="next">⏭ Suivant</button>`}
        <button class="btn ${LV().tm?.voice ? 'green' : ''}" data-r="voice">${LV().tm?.voice ? '🔊 Voix' : '🔇 Voix'}</button><button class="btn red" data-r="stop">✕ Arrêter</button></div>`;
    m.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { const k = b.dataset.r;
      if (k === 'next') next(); else if (k === 'stop') stop(false);
      else if (k === 'voice') { LV().tm.voice = !LV().tm.voice; save(); draw(); }
      else { if (R.paused) { R.end = now() + R.left * 1000; R.paused = false; } else { R.left = Math.max(0, Math.ceil((R.end - now()) / 1000)); R.paused = true; } draw(); } }); };
  announce(steps[0]); draw(); CX_RUN.tick = setInterval(draw, 250);
}
function cxTimerModal(){
  const T = LV().tm;
  const m = modal(`<h2>⏱️ Minuteur · circuit training et gainage</h2><div class="muted" style="font-weight:700">Un sifflet à chaque départ, des bips sur les 3 dernières secondes et, si vous le souhaitez, l'annonce vocale de l'exercice.</div>
    <div class="btn-row" style="margin:8px 0">${CX_TM_PRESETS.map((p, i) => `<button class="btn small" data-pr="${i}">${esc(p.n)}</button>`).join('')}</div>
    <div class="lv-cgrid"><label class="field">Effort (s)<input type="number" id="tm-w" value="${T.work}"></label><label class="field">Récupération (s)<input type="number" id="tm-r" value="${T.rest}"></label>
      <label class="field">Séries (tours)<input type="number" id="tm-n" value="${T.rounds}"></label><label class="field">Récup entre les séries (s)<input type="number" id="tm-rr" value="${T.restR}"></label></div>
    <label class="field">Exercices (un par ligne, dans l'ordre du circuit)<textarea id="tm-ex" rows="6">${esc((T.ex || []).join('\n'))}</textarea></label>
    <div class="btn-row"><span class="muted" style="font-weight:800">Ajouter :</span>${['Planche (gainage ventral)','Gainage latéral droit','Gainage latéral gauche','Pont fessier','Superman','Crunchs','Squats','Pompes','Fentes','Mountain climber','Jumping jack','Chaise contre le mur'].map(x => `<button class="btn small ghost" data-add="${esc(x)}">＋ ${esc(x)}</button>`).join('')}</div>
    <label class="field"><span><input type="checkbox" id="tm-v" ${T.voice ? 'checked' : ''}> 🔊 Annonce vocale des exercices</span></label>
    <label class="field"><span><input type="checkbox" id="tm-u" ${T.units ? 'checked' : ''}> 🔢 Unités de travail (compte à rebours d'unités, sans liste d'exercices)</span></label>
    <div id="tm-sum" class="advice info"></div>
    <div class="btn-row spread" style="margin-top:10px"><button class="btn" data-p="close">Fermer</button><button class="btn orange" data-p="go">▶️ Lancer</button></div>`, { wide:true });
  const rd = () => ({ work:Math.max(5, +m.querySelector('#tm-w').value || 30), rest:Math.max(0, +m.querySelector('#tm-r').value || 0), rounds:Math.max(1, +m.querySelector('#tm-n').value || 1), restR:Math.max(0, +m.querySelector('#tm-rr').value || 0),
    ex:m.querySelector('#tm-ex').value.split('\n').map(x => x.trim()).filter(Boolean), voice:m.querySelector('#tm-v').checked, units:m.querySelector('#tm-u').checked });
  const sum = () => { const c = rd(), nb = c.units ? 1 : Math.max(1, c.ex.length), tot = c.rounds * (nb * c.work + (nb - 1) * c.rest) + (c.rounds - 1) * c.restR; m.querySelector('#tm-sum').textContent = `${nb} exercice(s) × ${c.rounds} série(s) · durée totale ${lvDurTxt(tot)}`; };
  m.querySelectorAll('input,textarea').forEach(i => i.oninput = sum);
  m.querySelectorAll('[data-pr]').forEach(b => b.onclick = () => { const p = CX_TM_PRESETS[+b.dataset.pr]; m.querySelector('#tm-w').value = p.work; m.querySelector('#tm-r').value = p.rest; m.querySelector('#tm-n').value = p.rounds; m.querySelector('#tm-rr').value = p.restR; m.querySelector('#tm-u').checked = !!p.units; if (p.one && !m.querySelector('#tm-ex').value.trim()) m.querySelector('#tm-ex').value = 'Exercice'; sum(); });
  m.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const t = m.querySelector('#tm-ex'); t.value = (t.value.trim() ? t.value.trim() + '\n' : '') + b.dataset.add; sum(); });
  m.querySelector('[data-p="close"]').onclick = () => { Object.assign(LV().tm, rd()); save(); closeModal(); };
  m.querySelector('[data-p="go"]').onclick = () => { const c = rd(); Object.assign(LV().tm, c); save(); const ex = (c.units ? ['Unité'] : c.ex.length ? c.ex : ['Exercice']).map(n => ({ n })), steps = [];
    if (c.units) { for (let t = 1; t <= c.rounds; t++) steps.push({ ty:'w', x:{ n:`Unité ${t} / ${c.rounds}` }, t, sec:c.work }); closeModal(); return cxRun(steps, { title:'🔢 Unités de travail', tours:1, onEnd: () => {} }); }
    for (let t = 1; t <= c.rounds; t++) { ex.forEach((x, i) => { steps.push({ ty:'w', x, t, sec:c.work }); if (i < ex.length - 1 && c.rest) steps.push({ ty:'rx', sec:c.rest, t, nx:ex[i + 1] }); }); if (t < c.rounds && c.restR) steps.push({ ty:'rs', sec:c.restR, t, nx:ex[0] }); }
    closeModal(); cxRun(steps, { title:'⏱️ Minuteur', tours:c.rounds, onEnd: () => {} }); };
  sum();
}

/* ---------------------------------------------------------------------
   6. Petite forme du jour : −10 % sur la charge (ou les répétitions au poids de corps)
   --------------------------------------------------------------------- */
function cxPf(n, sid){ const F = LV().forme; if (!F?.on) return 0; return (res(n, sid)?.pf || lesson(n).pf?.[sid]) ? (+F.pct || 10) : 0; }
const cxPfBtn = (n, sid) => LV().forme?.on ? `<button class="btn small ${cxPf(n, sid) ? 'orange' : ''}" data-action="${isProfRole() && UI.view === 'prof' ? 'cxPfProf' : 'cxPf'}" data-sid="${sid}" title="Charges à −${LV().forme.pct} % aujourd'hui">😓 ${cxPf(n, sid) ? `Petite forme · −${LV().forme.pct} %` : 'Petite forme ?'}</button>` : '';

/* ---------------------------------------------------------------------
   7. Avec et sans matériel : niveaux de difficulté, méthodes d'entraînement
   --------------------------------------------------------------------- */
function cxNivOf(mid){ const x = (LV().mc || []).find(y => y.id === mid); const a = x?.niv?.length ? x.niv : LV().niv?.[mid]; return Array.isArray(a) && a.filter(Boolean).length ? a : null; }
function cxNivHTML(E){
  if (!E.m) return ''; const N = cxNivOf(E.m); if (!N) return '';
  return `<div class="cx-niv"><span class="lbl">🪜 Niveau de difficulté <small class="muted">(sans matériel, la difficulté remplace la charge)</small></span><div class="cx-niv-b">${N.map((t, i) => t ? `<button class="${E.niv === i + 1 ? 'on' : ''}" data-action="cxNiv" data-e="${E.id}" data-v="${i + 1}"><b>${i + 1}</b> ${esc(t)}</button>` : '').join('')}</div></div>`;
}
function cxMethHTML(n, sid, E){
  const L = LV(); if (!L.methOn || E.k === 'max' || !(L.meth || []).length) return '';
  const cur = (L.meth || []).find(x => x.k === E.me), M = mobP(n, E.mob || mobOf(n, sid)), rec = M?.methR || [];
  return `<div class="cx-meth"><label class="pil-sel">🧩 Méthode <select data-field="cxMe" data-e="${E.id}"><option value="">— séries simples —</option>${L.meth.map(x => `<option value="${x.k}" ${E.me === x.k ? 'selected' : ''}>${rec.includes(x.k) ? '⭐ ' : ''}${esc(x.n)}</option>`).join('')}</select></label>${cur?.d ? `<small class="muted">${esc(cur.d)}</small>` : rec.length ? `<small class="muted">⭐ conseillées pour ton thème</small>` : ''}</div>${M?.ordre && E.k === 'th' ? `<div class="muted cx-ordre">🔀 <b>Ordre des exercices :</b> ${esc(M.ordre)}</div>` : ''}`;
}
const cxExTags = E => [E.niv ? `niv. ${E.niv}` : '', E.me ? (LV().meth || []).find(x => x.k === E.me)?.n || '' : ''].filter(Boolean).join(' · ');
function cxMachFilterHTML(){
  return `<div class="card compact"><h3 style="margin-top:0">🏠 Avec ou sans matériel</h3><div class="muted" style="font-weight:700">${esc(LV().diffTxt || '')}</div>
    <div class="btn-row" style="margin-top:6px"><button class="btn small" data-action="cxSalle" data-v="sans">🤸 Sans matériel uniquement (gymnase, collège)</button><button class="btn small" data-action="cxSalle" data-v="avec">🏋️ Salle de musculation (sans les ateliers au poids de corps ajoutés)</button><button class="btn small" data-action="cxSalle" data-v="tout">✓ Tout proposer</button></div></div>`;
}

/* ---------------------------------------------------------------------
   8. Fiches à imprimer : ateliers (affichage en salle), fiche du cycle
   --------------------------------------------------------------------- */
function cxFicheAtelier(m){
  const i = m.cu ? (LV().mc.find(x => x.id === m.id) || {}) : (LV().mi[m.id] || {}), N = cxNivOf(m.id), g = GROUPS[m.g];
  return `<div class="cx-fa"><div class="cx-fa-h">${m.img ? `<img src="${esc(m.img)}" alt="">` : `<span class="cx-fa-ico">${esc(m.ico || '🏋️')}</span>`}<div><div class="cx-fa-n">${esc(m.n)}</div><div class="cx-fa-g" style="--gc:${g?.c || '#888'}">${esc(g?.n || '')}${i.mu ? ' · muscle principal : ' + esc(i.mu) : ''}</div></div></div>
    ${i.c ? `<p class="cx-fa-c">${esc(i.c)}</p>` : ''}${N ? `<div class="cx-fa-l"><b>Niveaux :</b><ol>${N.filter(Boolean).map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>` : ''}
    ${SV_KF.slice(1).some(([k]) => i[k]) ? `<div class="sv-kf">${SV_KF.slice(1).filter(([k]) => i[k]).map(([k, t]) => `<div><b>${t} :</b> ${esc(i[k])}</div>`).join('')}</div>` : ''}
    <div class="cx-fa-s">🌬️ ${esc(LV().resp || '')}${m.pm && LV().bars ? `<br>⚖️ ${esc(LV().bars)}` : ''}</div>
    <div class="cx-fa-poss"><b>Connaître mes possibilités</b><table><tr><td>Ma RM</td>${(LV().refReps || []).map(r => `<td>${r} rép.</td>`).join('')}</tr><tr><td>&nbsp;</td>${(LV().refReps || []).map(() => '<td>&nbsp;</td>').join('')}</tr></table></div></div>`;
}
function cxPrintAteliers(){ const ms = salleMachines().filter(m => m.g !== 'cardio'); const pages = []; for (let i = 0; i < ms.length; i += 2) pages.push(`<div class="print-page cx-fa-page">${ms.slice(i, i + 2).map(cxFicheAtelier).join('')}</div>`); lvPrint(pages.join('')); }
function cxPrintCycle(){
  const N = S.settings.nbLessons, rows = Array.from({ length:N }, (_, k) => { const n = k + 1, L = lesson(n), T = THEMES[L.th], tp = lvTipsOf(n);
    return `<tr><td class="c"><b>${n}</b></td><td>${T.ico} ${esc(T.n)}</td><td>${esc(WU_TYPES[L.wu?.t || 'none'] || '')}${L.wu?.c?.txt ? '<br><small>' + esc(L.wu.c.txt) + '</small>' : ''}</td><td>${lessonPils(n).map(p => esc(p.ico + ' ' + p.n)).join('<br>')}</td><td>${L.ex.length ? L.ex.map(mName).map(esc).join(', ') : '<i>libre choix</i>'}</td><td>${esc(tp.att || '')}</td></tr>`; }).join('');
  const mob = MOB_IDS.map(k => { const M = MOB[k]; return `<tr><td><b>${M.ico} ${esc(M.n)}</b> ${M.ch ? '· chasuble ' + esc(M.ch) : ''}</td><td>${esc(M.d)}</td><td>${esc(M.ry || '')}</td></tr>`; }).join('');
  lvPrint(`<div class="print-page"><div class="print-h">Musculation · ${esc(className())} · fiche du cycle</div><table class="pj-table"><tr><th>Leçon</th><th>Thème</th><th>Échauffement</th><th>Piliers observés</th><th>Ateliers</th><th>Points d'attention</th></tr>${rows}</table>
    <h3>Thèmes d'entraînement</h3><table class="pj-table"><tr><th>Thème</th><th>Paramètres</th><th>Rythme</th></tr>${mob}</table></div>`);
}
function cxPrintPairs(){ const L = sortedStudents(), P = S.pairs || {}; lvPrint(`<div class="print-page"><div class="print-h">Musculation · ${esc(className())} · binômes d'observation</div><table class="pj-table"><tr><th>Groupe</th><th>Observateur</th><th>observe</th></tr>${L.map(s => `<tr><td>${s.grp ? groupName(s.grp) : ''}</td><td><b>${esc(nameOf(s.id))}</b></td><td>${P[s.id] ? esc(nameOf(P[s.id])) : '—'}</td></tr>`).join('')}</table></div>`); }
function cxFichesTools(){
  return `<div class="card strong compact"><h2>🖨️ Fiches à imprimer et outils</h2><div class="muted" style="font-weight:700">Fiches A4 générées à partir de vos réglages (impression ou « Enregistrer en PDF »).</div></div>
    <div class="pmenu tools">
      <button class="pm-btn" data-action="cxPrintAt"><span class="ico">🏋️</span>Fiches ateliers<small>À afficher en salle : consignes, muscle principal, niveaux, respiration, mes possibilités</small></button>
      <button class="pm-btn" data-action="cxPrintCy"><span class="ico">📅</span>Fiche du cycle<small>Leçons, thèmes, échauffements, piliers, points d'attention</small></button>
      <button class="pm-btn" data-action="wfPrintBlank"><span class="ico">🔥</span>Fiche d'échauffement vierge<small>Modèle du livret + document d'aide</small></button>
      <button class="pm-btn" data-action="cxPairsPrint"><span class="ico">👥</span>Binômes d'observation<small>Qui observe qui</small></button>
      <button class="pm-btn" data-action="lvTable"><span class="ico">📊</span>Table des charges<small>% de la RM</small></button>
      <button class="pm-btn" data-action="cxTimer"><span class="ico">⏱️</span>Minuteur<small>Circuit training, gainage, unités de 40 s · sifflet et voix</small></button>
      <button class="pm-btn" data-action="lvFce"><span class="ico">🫀</span>Fréquence cardiaque<small>Calcul de la FCE</small></button>
      <button class="pm-btn" data-action="lvProto"><span class="ico">📜</span>Protocole<small>Règles essentielles</small></button></div>`;
}
function cxFormeCard(){
  return `<div class="card compact"><h3 style="margin-top:0">😓 Petite forme du jour</h3><div class="muted" style="font-weight:700">L'élève (ou l'enseignant à l'appel) signale une petite forme : la charge proposée baisse.</div>
    <div class="btn-row">${lvTgl('forme.on', 'Proposer la petite forme')}<label class="pil-sel">−${lvIn('forme.pct', 'num', 'style="max-width:80px"')} % sur la charge</label><button class="btn small" data-action="lvTable">📊 Voir la table des charges</button><button class="btn small" data-action="lvFce">🫀 FCE</button></div></div>`;
}
function cxMethCard(){
  return `<div class="card compact"><h3 style="margin-top:0">🧩 Méthodes d'entraînement</h3><div class="muted" style="font-weight:700">Choisies par l'élève sur chaque atelier ; celles conseillées pour chaque thème (⭐) se règlent dans 🎯 Thèmes d'entraînement.</div>
      <div class="btn-row">${lvTgl('methOn', 'Choix de la méthode par l\'élève')}</div>
      ${lvF('Méthodes proposées (une par ligne : nom | explication)', `<textarea data-field="cxMethTxt" rows="12">${esc((LV().meth || []).map(x => x.n + (x.d ? ' | ' + x.d : '')).join('\n'))}</textarea>`)}</div>
    <div class="card compact"><h3 style="margin-top:0">🤸 Avec ou sans matériel</h3>${lvF('Facteurs de difficulté (sans matériel, la difficulté remplace la charge)', lvIn('diffTxt', 'area', 'rows="5"'))}
      <div class="btn-row"><button class="btn small" data-action="profTab" data-tab="machines">🏋️ Choisir les ateliers de la salle (avec / sans matériel)</button></div>
      <div class="muted" style="font-weight:700;margin-top:6px">Les 4 niveaux de difficulté de chaque atelier au poids de corps se règlent dans 🏋️ Salle & ateliers.</div></div>`;
}
function cxPilPresets(){
  return `<div class="card compact"><h3 style="margin-top:0">🏛 Modèles de piliers</h3><div class="muted" style="font-weight:700">Remplacent les noms et les observables des piliers (les leçons déjà préparées gardent leurs piliers choisis).</div>
    <div class="btn-row"><button class="btn small" data-action="lvPilPreset" data-v="livret">📘 Piliers du livret (respiration, dos, trajet moteur…)</button><button class="btn small" data-action="svPilPa">✅ PA2RIS (Dossier EP&S n°89)</button><button class="btn small ghost" data-action="lvPilPreset" data-v="neps">↺ Piliers d'origine</button></div></div>`;
}
/* ---------------------------------------------------------------------
   9. Installer l'appli (PWA)
   --------------------------------------------------------------------- */
let CX_INSTALL = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); CX_INSTALL = e; try { if (UI.view === 'home') render(); } catch(err){} });
const cxInstallBtn = () => CX_INSTALL ? '<button class="btn primary" data-action="cxInstall">📲 Installer l\'appli</button>' : '';

/* ---------------------------------------------------------------------
   10. Actions et saisies
   --------------------------------------------------------------------- */
const CX_ACTIONS = {
  evSub: d => { UI.evSub = d.v; rerender(); },
  evPreset: async d => { if (!(await confirmBox('Modèle « ' + EV_PRESETS[d.v].label + ' » ?', 'La grille actuelle (critères, points, descripteurs) est remplacée. Les degrés déjà donnés sur des critères qui existent encore sont gardés.', 'Appliquer', true))) return; ROOT.evG = evMakeGrid(d.v); save(); render(); },
  evTgl: d => { const g = EG(); if (d.k === 'split') g.split.on = !g.split.on; else g[d.k] = !g[d.k]; save(); rerender(); },
  evSelfT: d => { const c = EG().criteria[+d.i]; c.self = !c.self; save(); rerender(); },
  evMove: d => { const a = EG().criteria, i = +d.i, j = i + (+d.d); [a[i], a[j]] = [a[j], a[i]]; save(); rerender(); },
  evDel: async d => { if (!(await confirmBox('Supprimer ce critère ?', '', 'Supprimer', true))) return; EG().criteria.splice(+d.i, 1); save(); render(); },
  evAdd: () => { EG().criteria.push({ id:'c' + rnd(4), afl:'', name:'Nouveau critère', max:2, auto:'', self:false, desc:['','','',''] }); save(); render(); },
  evSel: d => { UI.evSid = d.sid; render(); window.scrollTo(0, 0); },
  evDeg: d => { const e = evOf(UI.evSid), c = EG().criteria.find(x => x.id === d.c), v = +d.v; if (e.c[d.c]?.d === v) delete e.c[d.c]; else e.c[d.c] = { d:v, p: evDefPts(evMax(c, UI.evSid), v) }; save(); rerender(); },
  evPts: d => { const e = evOf(UI.evSid); if (e.c[d.c]) e.c[d.c].p = +d.v; save(); rerender(); },
  evSplit: d => { const e = evOf(UI.evSid); e.split = d.v; EG().criteria.forEach(c => { const x = e.c[c.id]; if (x?.d) x.p = evDefPts(evMax(c, UI.evSid), x.d); }); save(); rerender(); },
  evRegen: () => { const e = evOf(UI.evSid); e.auto = true; e.comment = ''; evSyncApp(UI.evSid); save(); rerender(); },
  evClear: async () => { if (!(await confirmBox('Effacer l\'évaluation de ' + nameOf(UI.evSid) + ' ?', '', 'Effacer', true))) return; delete evData().data[UI.evSid]; save(); render(); },
  evSugAll: () => { let k = 0; sortedStudents().forEach(s => { if (evScore(s.id).n) return; const e = evOf(s.id); EG().criteria.forEach(c => { const g = evSuggest(c, s.id); if (g) { e.c[c.id] = { d:g.d, p:evDefPts(evMax(c, s.id), g.d) }; k++; } }); evSyncApp(s.id); });
    save(); render(); toast(k ? `💡 ${k} degré(s) proposé(s) : vérifiez-les élève par élève` : 'Pas assez de données pour proposer des degrés', 3500); },
  evFam: () => lvPrint(sortedStudents().map(s => evFamHTML(s.id)).join('')),
  evCsv: () => evCsv(),
  aeSet: d => { setRes(curLesson(), UI.sid, r => { r.ae = { ...(r.ae || {}) }; r.ae[d.c] = r.ae[d.c] === +d.v ? null : +d.v; }); rerender(); flagSaved(); },
  cxGroups: d => cxMakeGroups(d.v),
  cxPairs: d => cxMakePairs(d.v),
  cxPairsClr: () => { S.pairs = {}; save(); render(); },
  cxPairsPrint: () => cxPrintPairs(),
  cxTimer: () => cxTimerModal(),
  cxPf: d => { const sid = d.sid || UI.sid; setRes(curLesson(), sid, r => { r.pf = r.pf ? 0 : 1; }); rerender(); flagSaved(); },
  cxPfProf: d => { const L = lesson(curLesson()); L.pf = L.pf || {}; if (L.pf[d.sid]) delete L.pf[d.sid]; else L.pf[d.sid] = 1; save(); rerender(); },
  cxNiv: d => { updE(d.e, E => { E.niv = E.niv === +d.v ? null : +d.v; }); rerender(); flagSaved(); },
  cxSalle: d => { const sm = m => m.cu && (LV().mc.find(x => x.id === m.id)?.sm) || ['pompes','dips','tractions','abdos','chaise_romaine'].includes(m.id) || m.k === 'pdc';
    ROOT.mOff = d.v === 'tout' ? [] : MACHINES.filter(m => m.g !== 'cardio' && (d.v === 'sans' ? !sm(m) : (m.cu && LV().mc.find(x => x.id === m.id)?.sm))).map(m => m.id); save(); render(); toast('✓ Salle mise à jour'); },
  cxPrintAt: () => cxPrintAteliers(), cxPrintCy: () => cxPrintCycle(),
  cxInstall: async () => { if (!CX_INSTALL) return; CX_INSTALL.prompt(); try { await CX_INSTALL.userChoice; } catch(e){} CX_INSTALL = null; render(); },
};
function cxOnChange(t, d){
  const f = d.field; if (!f || !/^(ev|cx)/.test(f)) return false;
  if (f === 'evG') { const g = EG(); if (d.k === 'splitOpts') g.split.opts = t.value.split(/[,;]+/).map(x => x.trim().replace(/\s*\/\s*/, '-')).filter(x => /^\d+(\.\d+)?-\d+(\.\d+)?$/.test(x)); else g[d.k] = t.value; save(); if (t.tagName === 'SELECT') rerender(); return true; }
  if (f === 'evC') { const c = EG().criteria[+d.i]; if (!c) return true; if (d.k === 'max') c.max = Math.max(0.25, +String(t.value).replace(',', '.') || 1); else if (/^d\d$/.test(d.k)) c.desc[+d.k[1]] = t.value.trim(); else c[d.k] = t.value.trim(); save(); if (d.k === 'max' || d.k === 'auto') rerender(); return true; }
  if (f === 'evCom') { const e = evOf(UI.evSid); e.comment = t.value; e.auto = false; save(); return true; }
  if (f === 'cxPair') { S.pairs = S.pairs || {}; if (t.value) S.pairs[d.sid] = t.value; else delete S.pairs[d.sid]; save(); return true; }
  if (f === 'cxMe') { updE(d.e, E => { E.me = t.value || null; }); flagSaved(); rerender(); return true; }
  if (f === 'cxMethTxt') { ROOT.lv.meth = t.value.split('\n').map(x => x.trim()).filter(Boolean).map((x, i) => { const [n, ...dd] = x.split('|'); return { k:'m' + i + '_' + n.trim().toLowerCase().replace(/[^a-z]/g, '').slice(0, 8), n:n.trim(), d:dd.join('|').trim() }; }); lvBump(); toast('✓ Méthodes enregistrées', 900); return true; }
  return false;
}
