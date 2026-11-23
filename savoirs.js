/* =====================================================================
   Musculation — ressources théoriques intégrées à l'appli
   N'EPS numérique — CA5 — Emilie BIDAULT et Quentin DELISLE
   Sources fournies par l'enseignant : carnet de musculation 3e (fiches « connaître l'atelier »),
   fiche « choisir un exercice pour ses effets », tableaux du Dossier EP&S n°79 (relation actions–muscles,
   exercices segmentaires / articulaires, critères et indicateurs), fiche des thèmes (sensations, décisions,
   ordre des exercices, choix des charges), « L'élève lycéen en EPS » (Dossier EP&S n°89 : profils, PA2RIS,
   charge de référence par le ressenti), N. Terré (savoirs durables, muscles fléchés, moment de force),
   bibliographie du CM musculation (ressentis), exemple national d'épreuve (unités de 40 s, aléas).
   Toutes ces données sont des valeurs proposées, modifiables (ROOT.lv), chargé avant app.js.
   ===================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   1. Données proposées
   --------------------------------------------------------------------- */
/* Répertoire d'exercices : « Muscle | Exercice | Effet / précision | Muscles sollicités | type » (une ligne par exercice)
   type : seg = geste segmentaire (chaîne musculaire), art = articulaire (une articulation), glob = global */
const SV_CAT = `Biceps | Curl mains serrés | Longue portion (extérieur) | Biceps | art
Biceps | Curl concentration | Courte et longue portion | Biceps | art
Biceps | Curl avec haltères | Biceps + brachial | Biceps, brachial | art
Biceps | Curl mains écartées | Courte portion (intérieur) | Biceps | art
Triceps | Barre front | Triceps (int + ext) | Triceps | art
Triceps | Barre nuque | Triceps (longue portion) | Triceps | art
Triceps | Pull-over un bras | Sans barre spécifique | Triceps | art
Triceps | Dips | Sans matériel | Triceps, deltoïdes antérieurs, pectoraux | seg
Épaules | Rowing debout | Trapèze | Trapèzes, deltoïdes, biceps | seg
Épaules | Élévation avant | Deltoïdes avant | Deltoïdes | seg
Épaules | Développé assis | Deltoïdes médians | Deltoïdes, triceps | seg
Épaules | Développé nuque | Deltoïdes | Deltoïdes, triceps | seg
Épaules | Oiseau | Deltoïdes postérieurs | Deltoïdes, trapèzes | seg
Épaules | Élévation des épaules (haussements) | Trapèzes | Trapèzes | art
Pectoraux | Développé couché | Coordination triceps-pectoraux | Pectoraux, triceps, deltoïdes antérieurs | seg
Pectoraux | Écarté couché | Minimise épaule et triceps | Pectoraux, deltoïdes antérieurs | seg
Pectoraux | Pull-over | Grand dorsal + pectoraux | Pectoraux, grand dorsal | seg
Pectoraux | Pompes | Sans matériel | Pectoraux, triceps, deltoïdes antérieurs | seg
Pectoraux | Butterfly | Isolation des pectoraux | Pectoraux | art
Dos | Tractions | Grands dorsaux | Grands dorsaux, biceps, trapèzes, deltoïdes postérieurs, fléchisseurs des doigts | seg
Dos | Tractions obliques (australiennes) | Sans matériel spécifique | Biceps, trapèzes, deltoïdes postérieurs | seg
Dos | Tirage plat ventre | Haut du dos | Grands dorsaux, trapèzes, biceps, deltoïdes postérieurs | seg
Dos | Rowing vertical | Trapèzes | Trapèzes, biceps | seg
Dos | Tirage poitrine poulie haute | Grands dorsaux | Grands dorsaux, trapèzes, biceps | seg
Dos | Tirage poitrine poulie basse | Milieu du dos | Grands dorsaux, trapèzes, biceps | seg
Avant-bras | Flexion des poignets | Fléchisseurs des poignets et des doigts | Fléchisseurs des avant-bras | art
Avant-bras | Extension des poignets | Extenseurs des poignets | Extenseurs des avant-bras | art
Abdominaux | Ciseaux | Grand droit (partie basse) | Grand droit, psoas iliaque | seg
Abdominaux | Relevé de buste | Grand droit (partie haute) | Grand droit | seg
Abdominaux | Flexions latérales | Obliques (contrôle de la charge) | Obliques, carré des lombes | seg
Abdominaux | Crunch obliques | Obliques (taille) | Obliques, grand droit | seg
Abdominaux | Demi-crunchs | Abdominaux partie haute | Grand droit | seg
Abdominaux | Abdominaux de perchiste | Abdominaux partie basse | Grand droit, psoas iliaque | seg
Abdominaux | Pédalo | Partie haute et partie basse | Grand droit, psoas iliaque | seg
Abdominaux | Marche de l'Empereur | Partie haute et obliques | Grand droit, obliques | seg
Tronc | Superman / « Mickey » | Lombaires | Lombaires | seg
Tronc | Planches de gainage | Tout le tronc | Lombaires, abdominaux, obliques, transverse, fessiers | seg
Tronc | Équilibre sur swiss-ball | Muscles profonds (proprioception) | Transverse, lombaires, abdominaux, fessiers | seg
Fessiers | Fente avant | Contrôle de la charge | Grands fessiers, quadriceps, ischio-jambiers | seg
Fessiers | Extension axiale | Fessiers postérieurs (galbe) | Grands fessiers | seg
Fessiers | Extension latérale (abduction) | Fessiers externes (tour de hanche) | Petits et moyens fessiers | seg
Fessiers | Fentes latérales | Face interne de la cuisse | Adducteurs, grands fessiers, quadriceps | seg
Fessiers | Adduction de la hanche | Face interne de la cuisse | Adducteurs | seg
Quadriceps | Leg extension | Centré sur les quadriceps | Quadriceps | art
Quadriceps | Squat | Coordination avec les fessiers | Quadriceps, grands fessiers, adducteurs | seg
Quadriceps | Squat 2 barres | Descente complète | Quadriceps, grands fessiers | seg
Quadriceps | Fente arrière | Évite la compensation | Quadriceps, grands fessiers | seg
Quadriceps | Presse oblique | Quadriceps et fessiers | Quadriceps, grands fessiers, adducteurs, jumeaux | seg
Quadriceps | Bondissements | Explosivité | Quadriceps, grands fessiers, ischio-jambiers, jumeaux | seg
Ischio-jambiers | Leg curl (curls cuisses) | Arrière de la cuisse | Ischio-jambiers | art
Mollets | Mollets à l'espalier | Évite la compensation | Jumeaux, soléaire | art
Mollets | Mollets assis | Préserve le dos | Soléaire | art
Mollets | Mollets « donkey » | Sans matériel | Jumeaux, soléaire | art
Mollets | Extensions 2 jambes | Amplitude maximale | Jumeaux, soléaire | art
Mollets | Corde à sauter | Pieds dynamiques | Jumeaux, quadriceps | seg`;
/* Relation actions – muscles : « Zone | Articulation | Mouvement | Muscles sollicités en priorité | Localisation » */
const SV_AM = `Membres supérieurs | Poignet | Flexion des poignets + flexion des doigts | Fléchisseurs des avant-bras | Face antérieure des avant-bras
Membres supérieurs | Poignet | Extension du poignet + extension des doigts | Extenseurs des avant-bras | Face postérieure des avant-bras
Membres supérieurs | Coude | Extension de l'avant-bras sur le bras | Triceps brachial | Face postérieure du bras
Membres supérieurs | Coude | Flexion de l'avant-bras sur le bras | Biceps brachial | Face antérieure du bras
Membres supérieurs | Épaule | Élévation des bras | Deltoïde | Coiffe de l'épaule
Membres supérieurs | Épaule | Abaissement des bras (traction) | Grand dorsal | Partie médiane du dos qui remonte vers le bras (« dos en V »)
Membres supérieurs | Épaule | Rapprochement des bras vers le corps (adduction) | Pectoraux | Poitrine
Membres supérieurs | Épaule | Écartement des bras vers l'arrière (abduction) | Rhomboïde, petit et grand ronds, trapèze, deltoïde postérieur | Haut du dos entre la colonne et l'omoplate + arrière de l'épaule
Membres inférieurs | Hanche | Flexion de la hanche | Psoas + abdominaux (partie basse) + tenseur du fascia lata + droit antérieur | Bas de l'abdomen + haut de la cuisse
Membres inférieurs | Hanche | Extension de la hanche | Grand fessier + ischio-jambiers si bassin en flexion | Arrière de la fesse et de la cuisse
Membres inférieurs | Hanche | Abduction | Moyen et petit fessiers + tenseur du fascia lata | Partie latérale de la fesse et haut de la cuisse
Membres inférieurs | Hanche | Adduction | Adducteurs | Partie interne de la cuisse
Membres inférieurs | Genou | Flexion de la jambe sur la cuisse | Ischio-jambiers (demi-membraneux, demi-tendineux, long biceps) | Partie postérieure de la cuisse
Membres inférieurs | Genou | Extension de la jambe sur la cuisse | Quadriceps (crural, vastes externe et interne, droit antérieur) | Partie antérieure de la cuisse
Membres inférieurs | Cheville | Extension du pied sur la jambe | Mollets (jumeaux + soléaire) | Partie postérieure de la jambe
Membres inférieurs | Cheville | Flexion du pied sur la jambe | Péronier latéral, jambier antérieur | Partie antérieure et latérale de la jambe
Tronc | Abdomen | Flexion du buste dans l'axe | Grand droit (partie haute surtout) | Centre du ventre, entre sternum, côtes et pubis
Tronc | Abdomen | Flexion du buste en torsion | Obliques | Face antérieure de la taille
Tronc | Abdomen | Inclinaison latérale | Obliques + carré des lombes | Taille, entre la dernière côte et la crête iliaque
Tronc | Abdomen | Extension du buste | Lombaires | Chevron musculaire le long de la colonne
Tronc | Abdomen | Contrôle de l'équilibre, exercices respiratoires | Transverse | Tour de l'abdomen, de part et d'autre de la colonne`;
const SV_SAV = [
  { t:'🛡️ Préserver son intégrité physique', l:[
    'Se préparer à l\'effort : l\'augmentation progressive des charges facilite l\'adaptation du muscle ; l\'étirement en tension active a un effet mécanique, thermique et neuromusculaire.',
    'Charger et décharger les barres en sécurité : risque de déséquilibre si les deux côtés ne sont pas chargés en même temps.',
    'Adopter des postures sécuritaires : le gainage régule la tension autour d\'une articulation ; le regard, puis la tête, influencent la courbure du dos ; garder l\'axe anatomique sur les trajets moteurs.',
    'Butée articulaire : risque de lésion en cas d\'extension complète et violente (os) ou d\'étirement complet et violent (tendon).',
    'Blocage respiratoire (blockpnée) en début de phase concentrique : il rigidifie le rachis lombaire (pression abdominale, protection des disques). Hors charge lourde, on expire dans l\'effort.',
    'Parer un partenaire : se placer à l\'endroit le plus risqué, tout près, sans gêner ; rester vigilant, surtout avec la fatigue.' ] },
  { t:'🔗 Mobiliser divers segments corporels', l:[
    'Adapter sa respiration : elle crée des points de fixation, favorise l\'oxydation et aide à pousser dans la charge.',
    'Coordonner contraction et relâchement : relâcher les muscles antagonistes ou inutiles limite les résistances et les pertes d\'énergie.',
    'Favoriser la transmission des forces : le gainage évite une perte d\'énergie de part et d\'autre de la charnière lombaire.',
    'Adapter ses postures et trajets moteurs : plus la charge est loin du point de pivot, plus le bras de levier est grand et plus c\'est difficile (moment de force).' ] },
  { t:'⚖️ Une charge personnalisée', l:[
    'La RM (résistance maximale) est la charge que l\'on soulève une fois mais pas deux. On ne soulève jamais cette charge en séance.',
    'On peut l\'estimer avec une table de correspondance (une charge soulevée 10 fois mais pas 11 ≈ 75 % de la RM) ou une formule.',
    'Les tables sont à manier avec prudence : un élève peu endurant ne fera pas 8 répétitions à 85 %. On peut aussi trouver sa charge de référence par le ressenti.',
    'Individualisation : les charges sont calculées à partir de ses propres possibilités. S\'aider sans se comparer.' ] },
  { t:'🎯 Identifier les effets attendus', l:[
    'Relier les exercices aux muscles sollicités : nom du muscle, situation, action (voir « Muscles et actions »).',
    'Rythmer les répétitions : plus une contraction est rapide, moins on recrute d\'unités motrices ; contrôler la vitesse de la phase excentrique (le retour) recrute plus de fibres.',
    'Vie quotidienne : charge près du corps, on se baisse en fléchissant les jambes, on travaille de façon symétrique (prévention du mal de dos).' ] },
  { t:'🗣️ Les ressentis', l:[
    'Le ressenti sert à associer un exercice à un muscle, vérifier et réguler la charge, vérifier qu\'on travaille dans son thème.',
    'Nommer ses sensations (vide, lourdeur, chaleur, brûlure, essoufflement…) aide à mieux les percevoir : on peut les nommer avant de commencer.',
    'La valeur compte moins que son évolution : on compare d\'une série à l\'autre, d\'une séance à l\'autre, ou entre deux exercices.',
    'Garder des traces dans son carnet améliore la reconnaissance des sensations.' ] } ];
const SV_PA2RIS = [
  ['P', 'Posture et placement', 'Avant de démarrer : sur le développé couché, dos en contact avec le banc, yeux sous la barre, jambes repliées, mains sur les repères. Cette posture reste la même toute la série.'],
  ['A', 'Amplitude', 'Toute l\'amplitude de l\'articulation est utilisée (sans aller jusqu\'à la butée).'],
  ['R', 'Respiration', 'Pas d\'apnée : j\'expire pendant l\'effort (phase concentrique), j\'inspire sur le retour (phase excentrique).'],
  ['R', 'Rythme', 'Tempo 2/0/1/0 : 2 temps à la descente, 0 de pause, 1 temps à la montée, 0 de pause (ou le rythme de mon thème).'],
  ['I', 'Isolation', 'Seul le muscle travaillé bouge : pas de compensation (coudes collés à la poulie haute, pas d\'élan).'],
  ['S', 'Symétrie', 'Les deux côtés poussent pareil : pas de bras plus haut que l\'autre.'] ];
const SV_PA_CR = [
  ['Posture de référence prise avant de démarrer (repères, appuis)', 'Posture conservée toute la série', 'Dos et bassin gainés'],
  ['Amplitude complète de l\'articulation', 'Pas de butée articulaire (extension complète)', 'Amplitude conservée avec la fatigue'],
  ['Pas d\'apnée', 'Expire pendant l\'effort (concentrique)', 'Inspire sur le retour (excentrique)'],
  ['Tempo respecté (2/0/1/0 ou rythme du thème)', 'Retour contrôlé', 'Rythme tenu jusqu\'à la dernière répétition'],
  ['Seul le muscle travaillé bouge', 'Pas d\'élan ni de compensation', 'Coudes / segments fixes'],
  ['Les deux côtés poussent pareil', 'Charge équilibrée', 'Pas de rotation du buste'] ];
const SV_PROFILS = [
  { k:'p1', n:'Profil 1 · « le performeur insensible »', obs:'Veut faire un maximum de répétitions même si sa posture et sa gestuelle se dégradent ; vise le record plutôt que la qualité.', ce:'Qualité avant quantité : une répétition ne compte que si PA2RIS est respecté. Écoute tes sensations au lieu de te comparer aux autres.' },
  { k:'p2', n:'Profil 2 · « l\'indifférent hyper-sensible »', obs:'S\'arrête aux premières sensations d\'inconfort ; pense être à son maximum alors que la charge est sous-évaluée.', ce:'Une légère brûlure en fin de série est normale et utile : si tu finis facilement, augmente un peu la charge. Sors de ta zone de confort, ton coach t\'aide.' },
  { k:'p3', n:'Profil 3 · « le sportif applicateur »', obs:'Applique ce qui est proposé, mais a du mal à choisir sa charge de référence et à réguler à partir de ses ressentis.', ce:'Questionne tes choix : trouve toi-même ta charge de référence avec tes ressentis, et justifie chaque réglage dans ton carnet.' } ];
const SV_ALEAS = ['Matériel imposé au début de l\'échauffement (medecine-ball, cordes…)', 'Absence d\'un disque : adapte ta charge', 'Changement de machine : trouve un exercice qui sollicite le même muscle', 'Ton partenaire change : réorganisez le co-entraînement'];
const SV_RMTAB = [100, 95, 93, 90, 87, 85, 83, 80, 77, 75, 72, 70, 68, 67, 65];
function svDefaults(){
  return {
    svV: 1,
    cat: SV_CAT, am: SV_AM, sav: SV_SAV.map(x => ({ t:x.t, l:[...x.l] })), pa2ris: SV_PA2RIS.map(x => [...x]),
    profils: SV_PROFILS.map(x => ({ ...x })), profOn: true,
    aleas: [...SV_ALEAS],
    rmF: 'brzycki', rmTab: [...SV_RMTAB],
    refReps: [15, 20, 25], refQ: 'As-tu ressenti une légère brûlure et as-tu eu du mal à finir tes {r} répétitions ?',
    sensOn: true, snat: ['Essoufflement','Vide','Brûlure','Lourdeur','Chaleur','Tremblements','Picotements','Congestion'],
    sint: [ { n:'Faible', dec:'Trop facile : augmente la charge (ou le niveau) à la prochaine série' }, { n:'Moyen', dec:'Garde la charge : tu es dans ton thème' }, { n:'Fort', dec:'Trop dur : réduis la charge, ou allonge ta récupération' } ],
    quiz: { n:8, src:'salle' },
    prog: `AFL1 Produire · 2nde (degré 3) : gestuelles et postures efficaces (sécurité, effets sur le muscle) ; charges adaptées aux ressources (différenciation, avec ou sans matériel) ; paramètres cohérents avec un ou deux thèmes contrastés (endurance de force, puissance). Terminale (degré 4) : gestuelles spécifiques (exercices personnalisés), charges optimisées selon le thème et le ressenti, choix individualisés (3 thèmes).
AFL1 Analyser · 2nde : indicateurs observables quantitatifs, guidés ; ressentis à partir de données chiffrées (localisation + intensité) ; régulations immédiates (répétitions, série). Terminale : indicateurs qualitatifs, incorporés ; ressentis liés au thème, évolution ; régulations immédiates et différées (enchaînement des ateliers, séquence).
AFL2 Concevoir · 2nde : paramètres simples, séquences guidées à semi-guidées (choix des exercices, fourchette charges-répétitions, échauffement, étirement). Terminale : personnalisation, séquences semi-guidées à non guidées (séries, répétitions, rythme, combinaison et ordre des exercices, combinaisons de charges, types de récupération).
AFL3 Coopérer · 2nde : s'organise avec (sécurité, gestion du matériel). Terminale : conseille (observation et co-entraînement : enchaînement, croisement, assistance).`,
  };
}
/* paramètres de thème issus de la fiche des thèmes (sensations attendues, ordre des exercices, méthodes conseillées) */
/* fiches « connaître l'atelier » du carnet de 3e (action, précautions, zones à risque) + vie quotidienne */
const SV_MI_PLUS = {
  dc:{ act:'Descente et remontée des bras (rapprochement des bras)', prec:'Bras écartés, épaules basses, jambes relevées', bles:'Épaules', vq:'Pousser une porte lourde, se relever du sol' },
  biceps_curl:{ act:'Flexion du coude', prec:'Contrôle de la descente, stabilité du buste', bles:'Tendon, butée articulaire du coude', vq:'Porter des sacs de courses' },
  tirage_vertical:{ act:'Adduction (abaissement des bras)', prec:'Garder le dos droit, lever la tête', bles:'Dos', vq:'Se hisser, grimper' },
  abdos:{ act:'Flexion du buste', prec:'Dos droit, tête droite', bles:'Lombaires', vq:'Se relever du lit, porter un enfant' },
  squat:{ act:'Extension des jambes', prec:'Dos droit', bles:'Dos, genoux', vq:'Se baisser jambes fléchies pour soulever un colis, charge près du corps' },
  ischios:{ act:'Flexion des genoux', prec:'Garder le dos droit', bles:'Dos', vq:'Courir, freiner une course' },
  presse:{ act:'Extension des jambes', prec:'Dos calé, pas d\'extension complète', bles:'Genoux, dos', vq:'Monter des escaliers, se relever d\'une chaise' },
  legcurl:{ act:'Extension du genou', prec:'Pas d\'extension complète, descente lente', bles:'Genoux', vq:'Shooter dans un ballon' },
  rowing:{ act:'Tirer les bras vers soi (écartement vers l\'arrière)', prec:'Dos droit, ne pas tirer avec le dos', bles:'Dos', vq:'Ouvrir une porte, ramer' },
  butterfly:{ act:'Rapprochement des bras (adduction)', prec:'Bras pas au-delà du plan des épaules', bles:'Épaules', vq:'Serrer quelqu\'un dans ses bras' },
  shoulder:{ act:'Élévation des bras', prec:'Ne pas verrouiller les coudes, dos calé', bles:'Épaules', vq:'Ranger un objet en hauteur' } };
function svMi(mi){ Object.entries(SV_MI_PLUS).forEach(([k, v]) => { mi[k] = { ...v, ...(mi[k] || {}) }; }); return mi; }
const SV_METH = [
  { k:'bulgare', n:'Méthode bulgare', d:'Alterner deux muscles antagonistes pour augmenter la fatigue (volume) · récup 1\'20' },
  { k:'transpo', n:'Transposition', d:'Alterner un exercice de musculation et un exercice proche de l\'activité sportive (puissance) · récup 2\'' },
  { k:'contraste', n:'Contraste', d:'5 répétitions à 70 % en lent, directement suivies de 5 à 50 % en explosif (puissance)' },
  { k:'brulante', n:'Série brûlante', d:'10 répétitions à 70 % + 5 répétitions aidé ou plus léger (volume)' },
  { k:'recact', n:'Récupération active (alternance de charges)', d:'Alterner des séries à 50-60 % et des séries à 30-40 % quand la lourdeur apparaît (endurance)' } ];

/* ---------------------------------------------------------------------
   2. Outils
   --------------------------------------------------------------------- */
const SV = () => ROOT.lv;
const svLines = (txt, n) => String(txt || '').split('\n').map(l => l.split('|').map(x => x.trim())).filter(a => a[0] && a.length >= n);
const svCat = () => svLines(SV().cat, 2).map(([g, n, eff, mus, ty]) => ({ g, n, eff:eff || '', mus:(mus || '').split(',').map(x => x.trim()).filter(Boolean), ty:ty || '' }));
const svAm = () => svLines(SV().am, 4).map(([z, art, mvt, mus, loc]) => ({ z, art, mvt, mus, loc:loc || '' }));
/* estimation de la RM (formule choisie par l'enseignant) */
const SV_RMF = { brzycki:'Brzycki', epley:'Epley', lander:'Lander', table:'Table de correspondance' };
function svRmEst(kg, r){
  r = Math.round(r); if (r <= 1) return kg; const f = ROOT?.lv?.rmF || 'brzycki';
  if (f === 'epley') return kg * (1 + r / 30);
  if (f === 'lander') return 100 * kg / (101.3 - 2.67123 * r);
  if (f === 'table') { const T = ROOT.lv.rmTab || SV_RMTAB, p = T[Math.min(T.length, r) - 1] || T[T.length - 1]; return kg * 100 / p; }
  return kg / (1.0278 - 0.0278 * r);
}
const svRmName = () => SV_RMF[ROOT?.lv?.rmF] || 'Brzycki';
/* fiche de connaissance d'un atelier (carnet 3e) : muscle, action, étirement, précautions, blessures, vie quotidienne */
const SV_KF = [['mu','Muscle principal'],['act','Action'],['etir','Étirement'],['prec','Précautions'],['bles','Zones à risque (blessures)'],['vq','Dans la vie quotidienne']];
function svKnow(mid){ const m = machine(mid); if (!m) return {}; return m.cu ? (SV().mc.find(x => x.id === mid) || {}) : (SV().mi[mid] || {}); }

/* ---------------------------------------------------------------------
   3. Charge de référence par le ressenti (sans passer par la RM)
   E.ref = { kg, ok:1 | -1 (trop facile) | -2 (pas fini) }
   --------------------------------------------------------------------- */
function svRefs(sid, mid, upto){
  const out = []; for (let n = 1; n <= (upto || S.settings.nbLessons); n++) (res(n, sid)?.ex || []).forEach(E => { if (E.m === mid && E.ref?.kg && E.ref.ok === 1) { const M = mobP(n, E.mob || mobOf(n, sid)); out.push({ n, kg:E.ref.kg, r: (M?.choice && E.cr) || M?.r || 10, ts:E.ts || 0 }); } });
  return out;
}
/* charge proposée : même nombre de répétitions → dernière charge validée ; sinon estimation depuis la meilleure référence */
function svRefSuggest(sid, mid, r, n){
  const R = svRefs(sid, mid, n - 1); if (!R.length) return null;
  const same = R.filter(x => x.r === r); if (same.length) return same[same.length - 1].kg;
  const rm = Math.max(...R.map(x => svRmEst(x.kg, x.r))); const g = rm / svRmEst(1, r); return Math.round(g * 2) / 2;
}
const svRefOn = (n, sid, E) => { if (!E.m || isPdc(E.m) || E.k === 'max') return false; const M = mobP(n, E.mob || mobOf(n, sid)); return M?.cm === 'ref'; };
function svRefHTML(n, sid, E, t){
  if (!svRefOn(n, sid, E)) return ''; const ref = E.ref || {}, sug = svRefSuggest(sid, E.m, t?.r, n), r = t?.r || '?';
  const q = (SV().refQ || '').replace('{r}', r);
  return `<div class="sv-ref"><div class="lv-ch-h">🎯 Ma charge de référence <small class="muted">(trouvée par le ressenti, sans calcul de RM)</small></div>
    <div class="row"><span class="lbl">Charge essayée pour ${r} répétitions</span><input type="number" inputmode="decimal" step="0.5" data-field="svRefKg" data-e="${E.id}" value="${ref.kg ?? ''}" placeholder="${sug ?? 'kg'}" style="max-width:120px"> kg
      ${sug != null && ref.kg == null ? `<button class="btn small" data-action="svRefSug" data-e="${E.id}" data-v="${sug}">Reprendre ${fmtKg(sug)}</button>` : ''}</div>
    ${ref.kg ? `<div class="sv-q">❓ ${esc(q)}</div><div class="btn-row"><button class="btn small ${ref.ok === 1 ? 'green' : ''}" data-action="svRefOk" data-e="${E.id}" data-v="1">✓ Oui : charge validée</button><button class="btn small ${ref.ok === -1 ? 'orange' : ''}" data-action="svRefOk" data-e="${E.id}" data-v="-1">😌 Non, trop facile → j'augmente</button><button class="btn small ${ref.ok === -2 ? 'red' : ''}" data-action="svRefOk" data-e="${E.id}" data-v="-2">😣 Je n'ai pas pu finir → je baisse</button></div>` : ''}
    ${ref.ok === 1 ? `<div class="lv-ok">✓ Charge de référence validée : ${fmtKg(ref.kg)} pour ${r} répétitions (RM estimée ≈ ${fmtKg(Math.round(svRmEst(ref.kg, r) * 2) / 2)}, ${esc(svRmName())})</div>` : ref.ok < 0 ? `<div class="advice warn">${ref.ok === -1 ? 'Ajoute un peu de charge (2,5 à 5 kg) et refais la série.' : 'Enlève un peu de charge et refais la série.'}</div>` : ''}</div>`;
}
/* « Mes possibilités » : charges de référence par nombre de répétitions (carnet 3e : 15 / 20 / 25 rép.) */
function svPossHTML(sid){
  const reps = (SV().refReps || []).map(Number).filter(x => x > 0), ids = new Set();
  for (let n = 1; n <= S.settings.nbLessons; n++) (res(n, sid)?.ex || []).forEach(E => { if (E.m && E.ref?.ok === 1) ids.add(E.m); });
  maxedMachines(sid).forEach(id => { if (!isPdc(id)) ids.add(id); });
  if (!ids.size || !reps.length) return '';
  const cell = (id, r) => { const R = svRefs(sid, id).filter(x => x.r === r); if (R.length) return `<b>${fmtKg(R[R.length - 1].kg)}</b>`;
    const all = svRefs(sid, id), mx = maxVal(sid, id); const rm = all.length ? Math.max(...all.map(x => svRmEst(x.kg, x.r))) : mx; return rm ? `<span class="muted">≈ ${fmtKg(Math.round(rm / svRmEst(1, r) * 2) / 2)}</span>` : '—'; };
  return `<h2>💪 Mes possibilités</h2><div class="muted" style="font-weight:700">Charges de référence validées par le ressenti (en gras) ou estimées (≈) à partir de ma RM.</div>
    <table class="pj-table"><tr><th>Atelier</th>${reps.map(r => `<th>${r} rép.</th>`).join('')}</tr>${[...ids].map(id => `<tr><td>${mImg(id, 'm-mini')} <b>${esc(mName(id))}</b></td>${reps.map(r => `<td class="c">${cell(id, r)}</td>`).join('')}</tr>`).join('')}</table>`;
}

/* ---------------------------------------------------------------------
   4. Sensations : nature, intensité, décision (fiche des thèmes)
   E.sn = [natures], E.si = 0 | 1 | 2
   --------------------------------------------------------------------- */
function svSensHTML(n, E){
  if (!SV().sensOn || E.k === 'max') return ''; const M = mobP(n, E.mob || mobOf(n, UI.sid)), exp = M?.snE || [], I = SV().sint || [];
  const sn = E.sn || [], si = E.si;
  const match = exp.length && sn.length ? sn.some(x => exp.includes(x)) : null;
  return `<div class="sv-sens"><div class="fq-h">🧭 Ce que je ressens et ce que je décide ${exp.length ? `<small class="muted">(attendu pour ${esc(M.n)} : ${esc(exp.join(', ').toLowerCase())})</small>` : ''}</div>
    <div class="sv-row"><b>Nature</b>${(SV().snat || []).map(x => `<button class="pchip ${sn.includes(x) ? 'on' : ''} ${exp.includes(x) ? 'exp' : ''}" data-action="svSn" data-e="${E.id}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <div class="sv-row"><b>Intensité</b>${I.map((x, i) => `<button class="pchip ${si === i ? 'on' : ''}" data-action="svSi" data-e="${E.id}" data-v="${i}">${esc(x.n)}</button>`).join('')}</div>
    ${match === false ? `<div class="advice warn">Cette sensation n'est pas celle attendue pour ton thème : vérifie ta charge, ton rythme ou ta récupération.</div>` : match ? '<div class="lv-ok">✓ Sensation en accord avec ton thème</div>' : ''}
    ${si != null && I[si] ? `<div class="sv-dec">➡️ <b>Décision :</b> ${esc(I[si].dec)}</div>` : ''}</div>`;
}

/* ---------------------------------------------------------------------
   5. Profil d'élève (Dossier EP&S n°89) : conseil personnalisé sur la tablette
   --------------------------------------------------------------------- */
function svProfOf(sid){ const k = (S.svProf || {})[sid]; return k ? (SV().profils || []).find(p => p.k === k) : null; }
function svProfHTML(sid){ if (!SV().profOn) return ''; const p = svProfOf(sid); return p?.ce ? `<div class="advice info sv-prof">💡 <b>Conseil pour toi</b> · ${esc(p.ce)}</div>` : ''; }

/* ---------------------------------------------------------------------
   6. Connaissances (vue élève et enseignant) et quiz « muscles fléchés »
   --------------------------------------------------------------------- */
function svViewSavoirs(){
  const tab = UI.svTab || 'sav', V = SV();
  const tabs = [['sav','📚 Savoirs'],['pa','✅ PA2RIS'],['am','🦴 Muscles et actions'],['cat','📖 Exercices par muscle'],['quiz','🎯 Muscles fléchés']];
  let body = '';
  if (tab === 'sav') body = V.sav.map(s => `<div class="card compact"><h2>${esc(s.t)}</h2><ul class="sv-ul">${s.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
  else if (tab === 'pa') body = `<div class="card compact"><h2>✅ PA2RIS : ce que le coach vérifie pour valider une répétition</h2><div class="sv-pa">${V.pa2ris.map(([l, n, d]) => `<div class="sv-pa-i"><span class="sv-pa-l">${esc(l)}</span><div><b>${esc(n)}</b><div>${esc(d)}</div></div></div>`).join('')}</div></div>`;
  else if (tab === 'am') { const Z = [...new Set(svAm().map(x => x.z))];
    body = Z.map(z => `<div class="card compact"><h2>${esc(z)}</h2><table class="pj-table"><tr><th>Articulation</th><th>Mouvement</th><th>Muscles sollicités en priorité</th><th>Où ?</th></tr>${svAm().filter(x => x.z === z).map(x => `<tr><td><b>${esc(x.art)}</b></td><td>${esc(x.mvt)}</td><td>${esc(x.mus)}</td><td class="muted">${esc(x.loc)}</td></tr>`).join('')}</table></div>`).join(''); }
  else if (tab === 'cat') { const C = svCat(), G = [...new Set(C.map(x => x.g))], f = UI.svCat || G[0];
    body = `<div class="card compact"><div class="seg wrap sv-seg">${G.map(g => `<button class="${f === g ? 'on norm' : ''}" data-action="svCatG" data-v="${esc(g)}">${esc(g)}</button>`).join('')}</div>
      <div class="sv-cat">${C.filter(x => x.g === f).map(x => `<div class="sv-ex"><b>${esc(x.n)}</b>${x.ty ? `<span class="tag ${x.ty === 'art' ? 'mod' : 'ok'}">${x.ty === 'art' ? 'articulaire' : x.ty === 'seg' ? 'segmentaire' : esc(x.ty)}</span>` : ''}<div>${esc(x.eff)}</div><small class="muted">${esc(x.mus.join(', '))}</small>
        ${isProfRole() ? `<button class="btn small" data-action="svCatAdd" data-n="${esc(x.n)}">＋ Ajouter à la salle</button>` : ''}</div>`).join('')}</div>
      <div class="muted" style="font-size:14px;margin-top:6px">Segmentaire : le geste sollicite une chaîne de muscles · articulaire : une seule articulation (isolation).</div></div>`; }
  else body = svQuizHTML();
  return `<div class="card strong"><h2>📚 Connaissances en musculation</h2><div class="seg wrap sv-seg">${tabs.map(([k, t]) => `<button class="${tab === k ? 'on norm' : ''}" data-action="svTab" data-v="${k}">${t}</button>`).join('')}</div></div>${body}`;
}
/* quiz : un atelier de la salle → quel muscle principal ? */
let SV_Q = null;
function svQuizPool(){
  const out = [];
  salleMachines().forEach(m => { if (m.g === 'cardio') return; const k = svKnow(m.id); if (k.mu) { const a = k.mu.split(/[(·,+]/)[0].trim(); out.push({ q: m.n.toLowerCase().includes(a.toLowerCase().slice(0, 5)) ? m.n.replace(/\s*\(.*?\)/g, '') : m.n, img:m, a }); } });
  if (SV().quiz?.src !== 'salle' || out.length < 4) svCat().forEach(x => out.push({ q:x.n, a:x.mus[0] || x.g }));
  return out;
}
function svQuizNew(){ const P = cxShuffle(svQuizPool()), N = Math.min(+SV().quiz?.n || 8, P.length); const all = [...new Set(P.map(x => x.a))];
  SV_Q = { i:0, ok:0, items: P.slice(0, N).map(x => ({ ...x, ch: cxShuffle([x.a, ...cxShuffle(all.filter(a => a !== x.a)).slice(0, 3)]) })), ans:null }; }
function svQuizHTML(){
  if (!SV_Q) svQuizNew(); const Q = SV_Q;
  if (!Q.items.length) return '<div class="card">Ajoutez le muscle principal des ateliers (menu enseignant → 1. Préparer le cycle → 📘 Fiches des ateliers) pour jouer.</div>';
  if (Q.i >= Q.items.length) return `<div class="card center"><h2>🎯 ${Q.ok} / ${Q.items.length}</h2><p style="font-weight:800">${Q.ok === Q.items.length ? 'Parfait ! Tu relies chaque atelier à son muscle.' : Q.ok >= Q.items.length / 2 ? 'Bien joué ! Révise les ateliers manqués.' : 'Continue : pense au mouvement de l\'articulation pour trouver le muscle.'}</p><button class="btn primary" data-action="svQuizNew">↻ Rejouer</button></div>`;
  const it = Q.items[Q.i];
  return `<div class="card"><div class="muted" style="font-weight:800">Question ${Q.i + 1} / ${Q.items.length} · score ${Q.ok}</div><h2>${it.img ? mImg(it.img, 'm-mini') + ' ' : ''}${esc(it.q)} : quel muscle travaille surtout ?</h2>
    <div class="sv-quiz">${it.ch.map(c => `<button class="btn ${Q.ans == null ? '' : c === it.a ? 'green' : Q.ans === c ? 'red' : ''}" data-action="svQuizA" data-v="${esc(c)}" ${Q.ans != null ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div>
    ${Q.ans != null ? `<div class="btn-row" style="margin-top:10px"><b>${Q.ans === it.a ? '✓ Bravo !' : '✗ C\'était : ' + esc(it.a)}</b><button class="btn primary" data-action="svQuizNext">Suivant →</button></div>` : ''}</div>`;
}

/* ---------------------------------------------------------------------
   7. Page enseignant « Connaissances & ressources »
   --------------------------------------------------------------------- */
function svProfPage(keys){
  const V = SV(), L = sortedStudents();
  const P_ = {
    head: `<div class="card strong">${lvSecH('📚', 'Connaissances, ressentis et profils', 'Contenus tirés de vos ressources (carnet 3e, Dossiers EP&S n°79 et 89, N. Terré, fiche des thèmes). Ils s\'affichent sur les tablettes (📚 Connaissances, fiches des ateliers, conseils). Tout est modifiable.', 'sv')}
      <div class="btn-row"><button class="btn small" data-action="svOpen">👁 Voir comme un élève</button><button class="btn small" data-action="svPilPa">🏛 Piliers PA2RIS (posture, amplitude, respiration, rythme, isolation, symétrie)</button></div></div>`,
    charge: `    <div class="card compact"><h3>⚖️ Charge : RM ou ressenti</h3><div class="muted" style="font-weight:700">Pour chaque thème (onglet 🎯 Thèmes d'entraînement → « Charge »), l'élève peut partir de sa RM (% de la RM) ou d'une charge de référence trouvée par le ressenti.</div>
      <div class="lv-mgrid">${lvF('Formule d\'estimation de la RM', `<select data-field="lvSet" data-p="rmF" data-t="text">${Object.entries(SV_RMF).map(([k, t]) => `<option value="${k}" ${V.rmF === k ? 'selected' : ''}>${t}</option>`).join('')}</select>`)}
        ${lvF('Table : % de la RM pour 1, 2, 3… répétitions', `<input type="text" data-field="svRmTab" value="${esc((V.rmTab || []).join(', '))}">`)}
        ${lvF('Question de validation de la charge ({r} = répétitions)', lvIn('refQ'))}${lvF('« Mes possibilités » : nombres de répétitions', `<input type="text" data-field="svRefReps" value="${esc((V.refReps || []).join(', '))}">`)}</div></div>`,
    sens: `    <div class="card compact"><h3>🧭 Nature et intensité des sensations</h3><div class="row">${lvTgl('sensOn', 'Afficher sur la fiche')}</div>
      <div class="lv-mgrid">${lvF('Natures proposées (une par ligne)', lvIn('snat', 'lines', 'rows="6"'))}${(V.sint || []).map((x, i) => lvF(lvIn(`sint.${i}.n`), lvIn(`sint.${i}.dec`, 'area', 'rows="3"'))).join('')}</div></div>`,
    profils: `    <div class="card compact"><h3>👤 Profils d'élèves</h3><div class="row">${lvTgl('profOn', 'Conseil personnalisé sur la tablette')}</div>
      ${V.profils.map((p, i) => `<div class="lv-mgrid">${lvF('Nom', lvIn(`profils.${i}.n`))}${lvF('Ce que l\'on observe', lvIn(`profils.${i}.obs`, 'area', 'rows="3"'))}${lvF('Conseil affiché à l\'élève', lvIn(`profils.${i}.ce`, 'area', 'rows="3"'))}</div>`).join('')}
      <div class="cx-pairs">${L.map(s => `<label class="cx-pair">${band(s.id)}<b>${esc(nameOf(s.id))}</b><select data-field="svProf" data-sid="${s.id}"><option value="">—</option>${V.profils.map(p => `<option value="${p.k}" ${(S.svProf || {})[s.id] === p.k ? 'selected' : ''}>${esc(p.n.split('·')[0])}</option>`).join('')}</select></label>`).join('')}</div></div>`,
    sav: `    <div class="card compact"><h3>📚 Savoirs à construire</h3>${V.sav.map((s, i) => lvF(lvIn(`sav.${i}.t`), lvIn(`sav.${i}.l`, 'lines', 'rows="5"'))).join('')}</div>`,
    pa: `    <div class="card compact"><h3>✅ PA2RIS</h3>${V.pa2ris.map((p, i) => `<div class="row lv-zrow">${lvIn(`pa2ris.${i}.0`, 'text', 'style="max-width:60px"')}${lvIn(`pa2ris.${i}.1`, 'text', 'style="max-width:220px"')}${lvIn(`pa2ris.${i}.2`, 'text', 'class="grow"')}</div>`).join('')}</div>`,
    cat: `    <div class="card compact"><h3>📖 Répertoire d'exercices</h3><div class="muted" style="font-weight:700">Une ligne par exercice : muscle | exercice | effet ou précision | muscles sollicités (séparés par des virgules) | seg ou art</div>${lvIn('cat', 'area', 'rows="12" class="sv-mono"')}</div>`,
    am: `    <div class="card compact"><h3>🦴 Relation actions – muscles</h3><div class="muted" style="font-weight:700">Une ligne : zone | articulation | mouvement | muscles | localisation</div>${lvIn('am', 'area', 'rows="10" class="sv-mono"')}</div>`,
    quiz: `    <div class="card compact"><h3>🎯 Quiz « muscles fléchés »</h3><div class="lv-mgrid">${lvF('Nombre de questions', lvIn('quiz.n', 'num'))}${lvF('Ateliers utilisés', `<select data-field="lvSet" data-p="quiz.src" data-t="text"><option value="salle" ${V.quiz?.src === 'salle' ? 'selected' : ''}>Machines de la salle (muscle principal renseigné)</option><option value="tout" ${V.quiz?.src !== 'salle' ? 'selected' : ''}>Salle + répertoire d'exercices</option></select>`)}</div></div>`,
    aleas: `    <div class="card compact"><h3>🎲 Aléas (épreuve)</h3><div class="muted" style="font-weight:700">Proposés dans 📒 Carnet du jour de chaque leçon, affichés sur les tablettes.</div>${lvIn('aleas', 'lines', 'rows="4"')}</div>`
  };
  return (keys || Object.keys(P_)).map(k => P_[k] || '').join('');
}
/* ---------------------------------------------------------------------
   8. Bouton « espace enseignant » en haut à droite (toujours avec le code)
   --------------------------------------------------------------------- */
function svTopBtn(){
  if (!ROOT?.role) return '';
  if (isProfRole() && UI.profUnlocked) return (UI.view === 'prof' && UI.profTab === 'menu') ? `<button class="btn small" data-action="svLock" title="Verrouiller l'espace enseignant">🔒</button>` : '';
  if (isProfRole()) return UI.view === 'home' ? '' : `<button class="btn small" data-action="openProf">👩‍🏫 Mode enseignant</button>`;
  return `<button class="btn small tb-prof" data-action="svProfTop" title="Mode enseignant (code)">👩‍🏫 Mode enseignant</button>`;
}

/* ---------------------------------------------------------------------
   9. Actions et saisies
   --------------------------------------------------------------------- */
const SV_ACTIONS = {
  svProfTop: () => { if (isProfRole()) return openProf();
    pinPad(async () => { if (!(await confirmBox('Passer en espace enseignant ?', 'Cette tablette devient une tablette enseignant (les saisies des élèves restent dessus). Pour revenir : menu enseignant → 🧒 Passer en tablette élève.', 'Continuer', true))) return;
      ROOT.role = 'prof'; UI.profUnlocked = true; UI.profTab = 'menu'; save(); go('prof'); }, '🔒 Code enseignant'); },
  svLock: () => { UI.profUnlocked = false; go('home'); toast('🔒 Espace enseignant verrouillé'); },
  svOpen: () => { UI.svFrom = UI.view; go('savoirs'); },
  svTab: d => { UI.svTab = d.v; if (d.v === 'quiz') svQuizNew(); rerender(); },
  svCatG: d => { UI.svCat = d.v; rerender(); },
  svCatAdd: d => { const x = svCat().find(y => y.n === d.n); if (!x) return; const gm = { Biceps:'bras', Triceps:'bras', 'Avant-bras':'bras', Épaules:'epa', Pectoraux:'pec', Dos:'dos', Abdominaux:'tronc', Tronc:'tronc' };
    const g = gm[x.g] || 'jam'; ROOT.lv.mc.push({ id:'c_' + rnd(5), n:x.n, ico:'🏋️', g, k:'ch', mu:x.mus.join(', '), c:x.eff }); lvInstallMachines(); lvBump(); toast('✓ « ' + x.n + ' » ajouté aux machines de la salle (à régler dans 🏋️ Salle & ateliers)', 3000); },
  svQuizNew: () => { svQuizNew(); rerender(); },
  svQuizA: d => { const Q = SV_Q, it = Q.items[Q.i]; Q.ans = d.v; if (d.v === it.a) { Q.ok++; cxBeep(990, 0.15); } else cxBeep(300, 0.25); rerender(); },
  svQuizNext: () => { SV_Q.i++; SV_Q.ans = null; rerender(); },
  svRefSug: d => { updE(d.e, E => { E.ref = { kg:+d.v }; }); rerender(); flagSaved(); },
  svRefOk: d => { updE(d.e, E => { E.ref = { ...(E.ref || {}), ok:+d.v }; }); rerender(); flagSaved(); },
  svSn: d => { updE(d.e, E => { const a = E.sn || []; E.sn = a.includes(d.v) ? a.filter(x => x !== d.v) : [...a, d.v]; }); rerender(); flagSaved(); },
  svSi: d => { updE(d.e, E => { E.si = E.si === +d.v ? null : +d.v; }); rerender(); flagSaved(); },
  svMethR: d => { ROOT.mob = ROOT.mob || {}; const cur = MOB[d.m].methR || []; ROOT.mob[d.m] = { ...(ROOT.mob[d.m] || {}), methR: cur.includes(d.v) ? cur.filter(x => x !== d.v) : [...cur, d.v] }; applyMobParams(ROOT.mob); lvBump(); rerender(); },
  svPilPa: async () => { if (!(await confirmBox('Piliers PA2RIS ?', 'Posture et placement, Amplitude, Respiration, Rythme, Isolation, Symétrie (Dossier EP&S n°89). Les leçons déjà préparées gardent leurs piliers choisis.', 'Appliquer', true))) return;
    const map = { plac:0, ampl:1, fati:2, comp:3, equi:4, secu:5 }, icos = ['🧍','↕️','🌬️','🎵','🎯','⚖️'];
    ROOT.piliers.forEach(p => { const i = map[p.id]; if (i == null) return; const x = SV().pa2ris[i]; if (!x) return; p.n = x[1]; p.ico = icos[i]; p.cr = [...SV_PA_CR[i]]; });
    save(); render(); toast('✓ Piliers PA2RIS appliqués'); },
};
function svOnChange(t, d){
  const f = d.field; if (!f || !/^sv/.test(f)) return false;
  if (f === 'svRefKg') { const v = t.value === '' ? null : Math.max(0, +String(t.value).replace(',', '.')); updE(d.e, E => { E.ref = v ? { kg:v } : null; }); rerender(); flagSaved(); return true; }
  if (f === 'svRmTab') { const a = t.value.split(/[;,\s]+/).map(Number).filter(x => x > 0 && x <= 100); if (a.length) { ROOT.lv.rmTab = a; lvBump(); toast('✓ Table enregistrée', 900); } return true; }
  if (f === 'svRefReps') { const a = t.value.split(/[;,\s]+/).map(Number).filter(x => x > 0 && x <= 100); ROOT.lv.refReps = a; lvBump(); toast('✓ Enregistré', 900); return true; }
  if (f === 'svProf') { S.svProf = S.svProf || {}; if (t.value) S.svProf[d.sid] = t.value; else delete S.svProf[d.sid]; save(); return true; }
  return false;
}
