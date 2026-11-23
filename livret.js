/* =====================================================================
   Musculation — module « Livret d'entraînement » et « Échauffement »
   N'EPS numérique — CA5 — Emilie BIDAULT et Quentin DELISLE
   Chargé AVANT app.js : ce fichier ne fait que déclarer des données et des
   fonctions, appelées ensuite par app.js (qui en fournit les outils : ROOT, S,
   MOB, THEMES, esc, setRes, modal…).
   Tout ce qui vient du livret est un PARAMÈTRE modifiable par l'enseignant
   (ROOT.lv) et part sur les tablettes élèves avec le QR de la leçon.
   ===================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   1. Référentiel des thèmes d'entraînement (préréglage « Livret EPPCS »)
   s/r/rest/pct = valeurs proposées · sMin…sMax, rMin…rMax, restMin…restMax, pcts = fourchettes
   choice : l'élève choisit lui-même % de la RM, séries, répétitions et récupération dans les fourchettes
   zE / zCP / zM : zones recherchées sur les échelles de ressentis (1 → 5)
   --------------------------------------------------------------------- */
const SV_MOB_PRE = {
  vol: { snE:['Brûlure','Congestion'], methR:['bulgare','brulante','superset'], ordre:'Méthode bulgare : alterner deux muscles antagonistes pour augmenter la fatigue · récup 1\'20', cm:'rm' },
  p66: { snE:['Vide'], methR:['contraste','transpo'], ordre:'Transposition : alterner un exercice de musculation et un exercice proche de l\'activité pour garder l\'intelligence du mouvement · récup 2\'', cm:'rm' },
  p64: { snE:['Vide'], methR:['contraste','transpo'], ordre:'Transposition : alterner un exercice de musculation et un exercice proche de l\'activité · récup 2\'', cm:'rm' },
  ton: { snE:['Essoufflement','Chaleur'], methR:['circuit','recact'], ordre:'Circuit training : agoniste / antagoniste, alternance, global / local, symétrique, continuité, complet (membres inférieurs, supérieurs, tronc) · récup 40 s maximum', cm:'rm' },
  aff: { snE:['Essoufflement','Chaleur','Brûlure'], methR:['circuit','recact'], ordre:'Circuit training : travail complet et continu, alterner les zones du corps · récup 40 s maximum', cm:'rm' } };
const SV_ABDOS = ['Crunch, disque de 1 kg sur le bas du ventre','Disque sur la poitrine','Disque tenu sous la tête','Disque tenu bras tendus dans le prolongement du corps'];
const LV_MOB_LIVRET = {
  vol: { n:'Gain de volume', ico:'💎', s:4, sMin:3, sMax:5, r:10, rMin:8, rMax:12, rest:90, restMin:90, restMax:120, pct:70, pcts:[65,70,75], pctLow:null,
         ry:'Rythme lent (entre 3 et 5 secondes) = 4 temps / 4 temps', org:'6 ateliers : 2 par zone du corps', rule:'zone', per:2, inter:null, interMin:6, choice:true, ch:'rouge',
         goal:'Développement du volume musculaire : favoriser l\'hypertrophie (augmenter la section des fibres musculaires). Effort court avec charge lourde.',
         sens:'Tétanisation, tremblements, brûlures, congestion, lourdeur des membres · fatigue musculaire intense · fatigue nerveuse importante',
         zE:[3,4], zCP:null, zM:[3,4] },
  p66: { n:'Puissance · exemple 1', ico:'⚡', s:4, sMin:2, sMax:5, r:8, rMin:6, rMax:8, rest:150, restMin:120, restMax:180, pct:80, pcts:[80,85], pctLow:null,
         ry:'Rythme explosif = 1 temps / 4 temps', org:'6 ateliers : 2 par zone du corps', rule:'zone', per:2, inter:null, interMin:6, choice:true, ch:'bleu',
         goal:'Développement de la puissance musculaire : meilleur rapport force-vitesse, explosivité par la stimulation nerveuse des fibres.',
         sens:'Recherche d\'explosivité et de vitesse jusqu\'en fin de séance · fatigue musculaire modérée · fatigue nerveuse importante en fin de séance',
         zE:[2,4], zCP:null, zM:null },
  p64: { n:'Puissance · exemple 2', ico:'⚡', s:3, sMin:2, sMax:5, r:6, rMin:6, rMax:8, rest:150, restMin:120, restMax:180, pct:85, pcts:[80,85], pctLow:null,
         ry:'Rythme explosif = 1 temps / 4 temps', org:'6 ateliers : 2 par zone du corps', rule:'zone', per:2, inter:null, interMin:6, choice:true, ch:'bleu',
         goal:'Développement de la puissance musculaire : meilleur rapport force-vitesse, explosivité par la stimulation nerveuse des fibres.',
         sens:'Recherche d\'explosivité et de vitesse jusqu\'en fin de séance · fatigue musculaire modérée · fatigue nerveuse importante en fin de séance',
         zE:[2,4], zCP:null, zM:null },
  ton: { n:'Tonification · version entretien', ico:'🌿', s:4, sMin:3, sMax:6, r:15, rMin:15, rMax:20, rest:45, restMin:30, restMax:60, pct:60, pcts:[50,60], pctLow:null,
         ry:'Rythme régulier, dynamique (1 seconde) = 2 temps / 2 temps', org:'6 ateliers : 2 par zone du corps', rule:'zone', per:2, inter:null, interMin:6, choice:true, ch:'jaune',
         goal:'Tonification et endurance de force : contractions répétées d\'intensité modérée dans des efforts prolongés (entretien de la santé).',
         sens:'Transpiration modérée · chaleur · douleurs ou tensions locales · fatigue musculaire modérée · respiration cadencée par l\'effort',
         zE:[2,4], zCP:[2,3], zM:null },
  aff: { n:'Tonification · version affinement', ico:'🔥', s:5, sMin:3, sMax:6, r:20, rMin:15, rMax:20, rest:45, restMin:30, restMax:60, pct:50, pcts:[40,50], pctLow:null,
         ry:'Rythme régulier, dynamique (1 seconde) = 2 temps / 2 temps', org:'6 ateliers : 2 par zone du corps', rule:'zone', per:2, inter:null, interMin:6, choice:true, ch:'jaune',
         goal:'Tonification et endurance de force : effort long avec charge moyenne pour affiner / raffermir le relief musculaire.',
         sens:'Fatigue musculaire locale et générale · essoufflement important · transpiration très présente · chaleur · brûlures dans les muscles qui travaillent',
         zE:[2,4], zCP:[3,4], zM:null },
};
/* clés de paramètres d'un mobile (toutes modifiables) */
Object.keys(SV_MOB_PRE).forEach(k => Object.assign(LV_MOB_LIVRET[k], SV_MOB_PRE[k]));
const LV_MOB_KEYS = ['n','ico','s','sMin','sMax','r','rMin','rMax','rest','restMin','restMax','pct','pctLow','pcts','ry','org','rule','per','nbEx','inter','interMin','choice','ch','goal','sens','zE','zCP','zM','snE','methR','ordre','cm'];
const LV_RULES = { '2x2':'2 groupes × 2 exercices', diff:'Groupes tous différents', free:'Groupe libre', zone:'Par zone du corps (n ateliers par zone)' };
/* noms des thèmes des leçons (préréglage Livret) */
const LV_TH_LIVRET = {
  max:{ n:'Déterminer sa RM' }, vol:{ n:'Gain de volume' }, pui:{ n:'Puissance' }, ton:{ n:'Tonification · entretien' }, aff:{ n:'Tonification · affinement' },
  projet:{ n:'Construire sa séance' }, evf:{ n:'Évaluation' } };
const LV_CHAS = { rouge:'#E3262B', bleu:'#1E5FD8', jaune:'#FFD400', vert:'#1FA24A', orange:'#FF7A00', violet:'#8A2BE2', rose:'#FF4FA3', blanc:'#FFFFFF', noir:'#1A1A1A', gris:'#8A94A6' };

/* Piliers « du livret » : mêmes identifiants que les piliers de l'appli (les leçons déjà préparées restent valables) */
const LV_PIL_LIVRET = {
  plac:{ n:'Placement du dos', ico:'🧍', cr:['Dos droit (calé contre le siège ou à la verticale)', 'Tronc et bassin gainés pendant toute la série', 'Placement conservé au fil des séries'] },
  ampl:{ n:'Trajet moteur', ico:'↕️', cr:['Trajet complet, sans aller jusqu\'à l\'extension complète', 'Le trajet ne se raccourcit pas avec la difficulté', 'Mouvement contrôlé, sans à-coup'] },
  comp:{ n:'Rythme d\'exécution', ico:'🎵', cr:['Rythme du thème respecté (explosif · lent · régulier)', 'Retour contrôlé', 'Rythme tenu jusqu\'à la dernière répétition'] },
  fati:{ n:'Respiration', ico:'🌬️', cr:['Expire quand il soulève la charge (force)', 'Inspire sur le retour (relâche)', 'Garde son rythme respiratoire même en difficulté'] },
  enco:{ n:'Rôle de coach', ico:'📣', cr:['Prépare la séance avec son partenaire (besoins, RM)', 'Filme et commente la prestation', 'Formule un conseil : « c\'est bien, mais tu aurais pu… »'] },
  equi:{ n:'Charge adaptée', ico:'🏋️', cr:['Charge choisie selon le % de la RM', 'Charge ni sous-estimée ni surestimée', 'Charge régulée pendant la séance si besoin'] },
  secu:{ n:'Sécurité & hygiène', ico:'🛡️', cr:['Serviette sur la machine, gourde personnelle', 'Pareur sur les ateliers avec barre', 'Charge vérifiée et accompagnée jusqu\'au retour'] },
};

/* ---------------------------------------------------------------------
   2. Réglages du livret (ROOT.lv) : valeurs proposées, toutes modifiables
   --------------------------------------------------------------------- */
const LV_EX_BANK = [
  // cardio / montée en température
  { id:'mg', n:'Montées de genoux', ico:'🏃', cat:'cardio', m:'t', v:30, zo:'bas' },
  { id:'tf', n:'Talons-fesses', ico:'🏃‍♀️', cat:'cardio', m:'t', v:30, zo:'bas' },
  { id:'jj', n:'Jumping jack', ico:'🤸', cat:'cardio', m:'t', v:30, zo:'all' },
  { id:'cs', n:'Corde à sauter', ico:'🪢', cat:'cardio', m:'t', v:45, zo:'bas', mat:'Corde à sauter' },
  { id:'pc', n:'Pas chassés', ico:'↔️', cat:'cardio', m:'t', v:30, zo:'bas' },
  { id:'velo', n:'Vélo', ico:'🚲', cat:'cardio', m:'t', v:180, zo:'bas', mat:'Vélo' },
  { id:'tapis', n:'Tapis de course', ico:'🏃', cat:'cardio', m:'t', v:180, zo:'bas', mat:'Tapis de course' },
  { id:'ellip', n:'Elliptique', ico:'🚶', cat:'cardio', m:'t', v:180, zo:'all', mat:'Elliptique' },
  { id:'bu', n:'Burpees', ico:'🔥', cat:'cardio', m:'r', v:8, zo:'all' },
  // mobilisation articulaire
  { id:'rtete', n:'Rotations lentes de la tête', ico:'🙆', cat:'mob', m:'r', v:5, zo:'haut', z:['cou'] },
  { id:'repa', n:'Rotations des épaules (moulinets)', ico:'🔄', cat:'mob', m:'r', v:10, zo:'haut' },
  { id:'rpoi', n:'Rotations des poignets et des coudes', ico:'✋', cat:'mob', m:'r', v:10, zo:'haut' },
  { id:'rbas', n:'Rotations du bassin', ico:'⭕', cat:'mob', m:'r', v:10, zo:'tronc' },
  { id:'rbuste', n:'Rotations du buste', ico:'🌀', cat:'mob', m:'r', v:10, zo:'tronc' },
  { id:'rgen', n:'Rotations des genoux et des chevilles', ico:'🦶', cat:'mob', m:'r', v:10, zo:'bas' },
  // étirements dynamiques / gammes
  { id:'bal', n:'Balancés de jambes', ico:'🦵', cat:'dyn', m:'r', v:10, zo:'bas' },
  { id:'fen', n:'Fentes avant dynamiques', ico:'🦿', cat:'dyn', m:'r', v:10, zo:'bas' },
  { id:'ouv', n:'Ouvertures et croisés de bras', ico:'🙌', cat:'dyn', m:'r', v:10, zo:'haut' },
  { id:'flex', n:'Flexions / extensions du buste', ico:'🙇', cat:'dyn', m:'r', v:10, zo:'tronc' },
  // activation musculaire
  { id:'po', n:'Pompes', ico:'💪', cat:'act', m:'r', v:10, zo:'haut' },
  { id:'dipb', n:'Dips sur banc', ico:'🪑', cat:'act', m:'r', v:10, zo:'haut', mat:'Banc' },
  { id:'sq', n:'Squats', ico:'🦵', cat:'act', m:'r', v:15, zo:'bas' },
  { id:'mc', n:'Mountain climber', ico:'🧗', cat:'act', m:'t', v:30, zo:'all' },
  { id:'ab', n:'Crunchs (abdos)', ico:'🧘', cat:'act', m:'r', v:15, zo:'tronc', mat:'Tapis de sol' },
  // gainage
  { id:'ga', n:'Planche (gainage ventral)', ico:'🧱', cat:'gain', m:'t', v:30, zo:'tronc', mat:'Tapis de sol' },
  { id:'gl', n:'Gainage latéral', ico:'📐', cat:'gain', m:'t', v:30, zo:'tronc', mat:'Tapis de sol' },
  { id:'gd', n:'Gainage dorsal (pont)', ico:'🌉', cat:'gain', m:'t', v:30, zo:'tronc', mat:'Tapis de sol' },
  { id:'sup', n:'Superman', ico:'🦸', cat:'gain', m:'t', v:20, zo:'tronc', mat:'Tapis de sol' },
  // spécifique à la séance
  { id:'leg', n:'1 série légère sur une machine de ma séance', ico:'🏋️', cat:'spe', m:'r', v:15, zo:'all', d:'Charge très légère (30 à 40 % de la RM) pour répéter le geste' },
  { id:'elt', n:'Tirage à l\'élastique', ico:'🎗️', cat:'spe', m:'r', v:15, zo:'haut', mat:'Élastique' },
  { id:'ere', n:'Rotation externe d\'épaule à l\'élastique', ico:'🎗️', cat:'spe', m:'r', v:12, zo:'haut', mat:'Élastique' },
];
const LV_MC_SM = [
  { id:'s_squat', n:'Squat au poids de corps', ico:'🦵', g:'jam', k:'pdc', sm:true, mu:'Quadriceps · fessiers', c:'Pieds largeur d\'épaules, je descends les fesses en arrière, dos droit, genoux dans l\'axe des pieds. J\'expire en remontant.', niv:['Assis-debout sur une chaise','Squat au poids de corps','Squat sauté','Squat sur une jambe (assisté)'] },
  { id:'s_fente', n:'Fentes', ico:'🦿', g:'jam', k:'pdc', sm:true, mu:'Quadriceps · fessiers', c:'Grand pas, buste droit, le genou arrière descend près du sol, le genou avant reste au-dessus de la cheville.', niv:['Fente statique, main sur un mur','Fentes avant alternées','Fentes arrière + montée de genou','Fentes sautées'] },
  { id:'s_pont', n:'Pont fessier', ico:'🌉', g:'jam', k:'pdc', sm:true, mu:'Fessiers · ischios', c:'Allongé sur le dos, pieds à plat, je monte le bassin jusqu\'à aligner épaules, bassin et genoux, sans creuser le dos.', niv:['Pont sur 2 pieds','Pieds surélevés (banc)','Pont sur 1 jambe','1 jambe, pied surélevé'] },
  { id:'s_chaise', n:'Chaise contre le mur', ico:'🪑', g:'jam', k:'pdc', u:'s', sm:true, mu:'Quadriceps (isométrie)', c:'Dos plaqué au mur, cuisses à l\'horizontale, genoux au-dessus des chevilles. Max = temps tenu.', niv:['Genoux à 120°','Genoux à 90°','90°, une jambe tendue en alternance','90° avec un sac lesté'] },
  { id:'s_mollet', n:'Montées sur pointes (mollets)', ico:'🦶', g:'jam', k:'pdc', sm:true, mu:'Mollets (triceps sural)', c:'Je monte sur la pointe des pieds le plus haut possible, je redescends lentement.', niv:['2 pieds au sol','2 pieds sur une marche','1 pied sur une marche','1 pied + sac lesté'] },
  { id:'s_rowinv', n:'Tirage horizontal (rowing inversé)', ico:'🚣', g:'dos', k:'pdc', sm:true, mu:'Dorsaux · biceps', c:'Sous une barre basse ou une table solide, corps gainé, je tire la poitrine vers la barre en serrant les omoplates.', niv:['Corps presque vertical','Jambes fléchies','Jambes tendues','Pieds surélevés'] },
  { id:'s_super', n:'Superman (lombaires)', ico:'🦸', g:'dos', k:'pdc', sm:true, mu:'Lombaires', c:'À plat ventre, regard au sol, je décolle bras et jambes sans à-coup et sans creuser exagérément.', niv:['Bras le long du corps','Bras tendus devant','Bras et jambe opposés','Maintien 3 s en haut'] },
  { id:'s_glat', n:'Gainage latéral', ico:'📐', g:'tronc', k:'pdc', u:'s', sm:true, mu:'Obliques · tronc', c:'Sur le coude, épaule au-dessus du coude, corps aligné, bassin haut. Max = temps tenu de chaque côté.', niv:['Sur le genou et le coude','Sur le pied et le coude','Jambe du dessus levée','Avec rotation du buste'] },
  { id:'s_crunch', n:'Crunch', ico:'🧘', g:'tronc', k:'pdc', sm:true, mu:'Abdominaux (grand droit)', c:'J\'enroule le buste sans tirer sur la nuque, le bas du dos reste au sol. J\'expire en montant.', niv:['Bras tendus vers les genoux','Bras croisés sur la poitrine','Mains aux tempes','Jambes levées à 90°'] },
  { id:'s_pike', n:'Pompes piquées (épaules)', ico:'🔺', g:'epa', k:'pdc', sm:true, mu:'Épaules (deltoïdes)', c:'Bassin haut, corps en V inversé, je descends la tête vers le sol entre les mains, coudes vers l\'arrière.', niv:['Mains sur un banc, pieds au sol','Au sol','Pieds sur un banc','Pieds plus hauts, amplitude complète'] },
];
function lvDefaults(){
  return {
    v: 1,
    strict: false,
    zones: [ { k:'haut', n:'Haut du corps · bras', g:['bras'] }, { k:'tronc', n:'Tronc', g:['pec','dos','epa','tronc'] }, { k:'bas', n:'Bas du corps · jambes', g:['jam'] } ],
    rs: { mode:'livret', early:2, sc:[
      { k:'e', n:'Perception de l\'effort', ico:'💪', lv:['Très facile','Assez facile','Assez difficile','Difficile','Très difficile'] },
      { k:'cp', n:'Ressenti cardio-pulmonaire', ico:'🫁', lv:['Très peu essoufflé, parle aisément','Peu essoufflé, parle','Essoufflé, quelques difficultés à parler, rougeurs','Difficultés à reprendre son souffle','Très essoufflé, ne peut plus parler'] },
      { k:'m', n:'Ressenti musculaire', ico:'🔥', lv:['Aucune douleur','Quelques picotements légers','« Ça chauffe »','Douleurs dans les muscles « ça tire »','Durcissement du muscle (tétanie) « ça brûle »'] } ] },
    cq: [
      { id:'mobi', q:'Pourquoi choisis-tu ce thème d\'entraînement ? (ton mobile personnel)', w:'deb', on:true, th:['vol','pui','ton','aff','projet','evi','evf'] },
      { id:'sens', q:'Sensations au début de cette séance', w:'deb', on:true, th:[] },
      { id:'calm', q:'Retour au calme : étirements réalisés', w:'fin', on:true, th:[] },
      { id:'aime', q:'As-tu aimé ce mobile ? Pourquoi ?', w:'fin', on:true, th:['vol','pui','ton','aff'] },
      { id:'chg', q:'Que vas-tu changer la semaine prochaine dans ton entraînement ? Pourquoi ?', w:'fin', on:true, th:['projet','evi','evf','coach'] } ],
    exTxt: { on:true, an:'Analyse (prévu / réalisé, difficultés, adaptations)', ju:'Justification de mes choix' },
    tips: {
      att: ['La respiration · Le trajet moteur', 'Le rythme d\'exécution · La récupération', 'La charge · L\'entraînement adapté au thème', 'Les ressentis · Le rôle de coach', 'Les paramètres d\'entraînement', 'Le placement du dos · Le choix de la charge (sécurité)'],
      tr: [
        'TONIFICATION ET ENDURANCE DE FORCE : contraction répétée d\'intensité modérée inscrite dans des efforts prolongés. Le travail vise aussi la tonification générale et l\'équilibre, notamment s\'il implique le tronc, les muscles profonds et les chaînes musculaires.',
        'LA RECHERCHE DE GAIN DE VOLUME : favorise l\'hypertrophie musculaire, c\'est-à-dire l\'augmentation de la section des fibres musculaires. Effort court avec charge lourde.',
        'LA PUISSANCE : c\'est la recherche du meilleur rapport force-vitesse. On cherche l\'explosivité par l\'efficacité de la stimulation nerveuse des fibres musculaires.',
        'LE RÔLE DE COACH : le coach prépare la séance de son partenaire selon son thème, le filme sur une série complète et l\'aide à se situer (respiration, placement du dos, trajet moteur).',
        'Le renforcement des muscles antagonistes (biceps / triceps, quadriceps / ischios, abdominaux / lombaires) évite les déséquilibres musculaires et protège des blessures.' ],
      di: [
        'Après l\'effort : le stretching aide à regagner en souplesse, décontracte le muscle et redonne de la mobilité aux articulations. Associé à la musculation, il en renforce l\'intérêt.',
        'Quand la soif arrive, le corps a déjà commencé à se déshydrater. Pendant l\'effort, boire souvent (au moins toutes les 20 min) de petites quantités (10 à 20 cl).',
        'Ne pas sauter de repas, privilégier les protéines pauvres en lipides, des fruits et des légumes verts à chaque repas.',
        'Le dernier repas avant un effort important se prend, si possible, 3 heures avant : la digestion doit être terminée quand l\'effort commence.',
        'Le magnésium favorise l\'effort musculaire (cacao, céréales complètes, amandes, poisson). Privilégier les sucres lents (féculents, pain, céréales).' ] },
    thTips: { ton:{ att:0, tr:0, di:0 }, aff:{ att:0, tr:0, di:0 }, vol:{ att:1, tr:1, di:1 }, pui:{ att:2, tr:2, di:2 }, coach:{ att:3, tr:3, di:3 }, projet:{ att:4, tr:4, di:4 }, max:{ att:5, tr:-1, di:-1 } },
    mi: svMi({
      dc:{ mu:'Pectoraux (+ triceps)', c:'Je m\'allonge sur le dos, les yeux sous la barre, les pieds posés sur le banc. Mains à égale distance du repère. Je laisse descendre lentement la barre au-dessus de la poitrine, sans la faire rebondir. Je gaine mon tronc et mon bassin. J\'expire quand je pousse la barre.' },
      butterfly:{ mu:'Pectoraux', c:'J\'ai le dos calé contre le siège. Mes bras ouverts ne dépassent pas le plan des épaules. J\'expire quand je rapproche les barres.' },
      rowing:{ mu:'Dorsaux', c:'Je garde mon dos droit (à la verticale), les genoux légèrement fléchis, les pieds calés contre la machine. J\'expire quand je tire le câble.' },
      tirage_vertical:{ mu:'Dorsaux', c:'Tirage poitrine : je saisis la barre par-dessus, mains écartées de la largeur des épaules, je penche un peu le buste en arrière et j\'amène la barre au-dessus de ma poitrine. J\'expire quand je tire le câble.' },
      tirage_assis:{ mu:'Dorsaux', c:'Je garde le dos droit, les genoux légèrement fléchis. Je tire vers le ventre en serrant les omoplates. J\'expire quand je tire.' },
      presse:{ mu:'Quadriceps', c:'Dos calé contre le siège, mains sur les poignées, pieds largeur de bassin légèrement tournés vers l\'extérieur. Je repousse la plate-forme sans décoller les talons ni aller jusqu\'à l\'extension complète, puis je plie lentement.' },
      legcurl:{ mu:'Quadriceps', c:'Leg extension : dos calé contre le siège, mains sur les côtés. Je tends les jambes presque jusqu\'à l\'horizontale, sans extension complète, puis je redescends lentement.' },
      ischios:{ mu:'Ischios', c:'Leg curl : à plat ventre, mains sur les poignées, jambes coincées sous les rondins au niveau du mollet. Je plie les jambes jusqu\'à 90° environ, je reviens doucement en contrôlant. Je ne creuse pas le bas du dos.' },
      squat:{ mu:'Quadriceps', c:'½ squat : la barre sur les épaules, pieds écartés largeur d\'épaules. Je descends les fesses en arrière (genoux sans dépasser la pointe des pieds), je m\'arrête à mi-hauteur et je remonte. Pareur obligatoire.' },
      biceps_curl:{ mu:'Biceps', c:'Bras quasi tendus au départ, coudes fixes. Je fléchis les bras en gardant le dos droit et gainé, je redescends lentement sans extension complète. J\'expire en montant.' },
      shoulder:{ mu:'Épaules (deltoïdes)', c:'Dos calé contre le dossier, je pousse vers le haut sans verrouiller les coudes, je redescends lentement. J\'expire en poussant.' },
      abdos:{ mu:'Abdominaux', c:'Je contracte les abdominaux sans tirer sur la nuque, le bas du dos reste en contact. J\'expire en m\'enroulant.' }  }),
    mc: [
      { id:'c_poulh', n:'Poulie haute (triceps)', ico:'🔽', g:'bras', k:'ch', mu:'Triceps', c:'De face : debout face à la poulie haute, pieds parallèles, j\'amène la poignée vers le bas. De dos : en fente avant, coudes fléchis, j\'amène la poignée vers le haut et l\'avant. J\'expire quand je tire le câble.' },
      { id:'c_poulb', n:'Poulie basse (biceps)', ico:'🔼', g:'bras', k:'ch', mu:'Biceps', c:'Je garde le dos droit pour ramasser la poulie (je fléchis mes appuis). Bras quasi tendus, je ramène la poulie vers moi en me gainant.' },
      { id:'c_ext', n:'Extension des avant-bras (haltères)', ico:'💪', g:'bras', k:'ch', pm:true, mu:'Triceps', c:'Allongé sur un banc, un haltère dans chaque main, bras tendus au-dessus de la tête. Je descends lentement les haltères jusqu\'au niveau des oreilles puis je tends les bras. Bras verticaux, je ne creuse pas le bas du dos.' },
      { id:'c_kick', n:'Kick back (haltère)', ico:'🦾', g:'bras', k:'ch', pm:true, mu:'Triceps', c:'Une main et un genou sur le banc, coude à 90°. Je monte l\'haltère vers l\'arrière jusqu\'à tendre le bras, puis je redescends progressivement. Épaule fixe, dos droit, sans à-coup.' },
      { id:'c_flex', n:'Flexion des avant-bras (barre)', ico:'🏋️', g:'bras', k:'ch', pm:true, mu:'Biceps', c:'Debout, le bas du dos collé au mur, mains largeur d\'épaules. Je fléchis les bras coudes collés au corps jusqu\'aux épaules, je redescends en gardant les bras légèrement fléchis.' },
      { id:'c_curl', n:'Curl (haltère)', ico:'💪', g:'bras', k:'ch', pm:true, mu:'Biceps', c:'Assis, buste légèrement penché, coude contre l\'intérieur de la cuisse. Je plie l\'avant-bras jusqu\'à l\'épaule et redescends progressivement sans extension complète ni à-coup.' },
      { id:'c_rowh', n:'Rowing (haltère)', ico:'🚣', g:'dos', k:'ch', pm:true, mu:'Dorsaux', c:'Une main et un genou sur un banc, bras tendu vers le sol. J\'amène l\'haltère vers l\'épaule en tirant le coude jusqu\'à 90°, puis je reviens progressivement.' },
      { id:'c_elev', n:'Élévations latérales (haltères)', ico:'🙆', g:'epa', k:'ch', pm:true, mu:'Épaules (deltoïdes)', c:'Debout, un haltère dans chaque main. Je lève les bras jusqu\'à l\'horizontale (coudes légèrement fléchis), je redescends lentement. Buste droit, sans balancement.' },
      { id:'c_pull', n:'Pull-over (haltère)', ico:'🙌', g:'pec', k:'ch', pm:true, mu:'Pectoraux', act:'Flexion des coudes en arrière, bras qui reviennent à la verticale', prec:'Coudes bien serrés, contrôle de la descente', bles:'Coudes, dos', c:'Allongé, un haltère entre les 2 mains, bras tendus vers l\'arrière. Je remonte les bras tendus jusqu\'à la verticale puis je redescends. Sans à-coup, sans creuser le bas du dos.' },
      { id:'c_nuque', n:'Tirage nuque', ico:'🔽', g:'dos', k:'ch', mu:'Dorsaux', c:'Prise par-dessus, mains largeur d\'épaules, buste un peu penché en avant, regard devant. J\'amène la barre au-dessus de ma nuque. J\'expire quand je tire.' },
      { id:'c_plank', n:'Gainage (planche)', ico:'🧱', g:'tronc', k:'pdc', u:'s', sm:true, mu:'Abdominaux · tronc', c:'Sur les coudes, j\'aligne épaules – bassin – pieds. Je contracte mes abdominaux et je serre les fesses. Max = temps maximal tenu.' },
      ...LV_MC_SM.map(x => ({ ...x, niv:[...x.niv] })) ],
    mcV: 2,
    niv: { pompes:['Mains sur un banc','Sur les genoux','Pompes classiques','Pieds surélevés'], dips:['Sur un banc, genoux fléchis','Sur un banc, jambes tendues','Aux barres, assisté','Aux barres'],
      tractions:['Tractions australiennes (barre basse)','Avec élastique','Descente lente seule (excentrique)','Tractions complètes'], abdos:SV_ABDOS.slice(),
      chaise_romaine:['Genoux fléchis','Jambes groupées','Jambes tendues','Jambes tendues + rotation'], c_plank:['Sur les genoux','Coudes et pieds','Un bras ou une jambe levé','Bras et jambe opposés levés'] },
    diffTxt: 'Démarche commune avec et sans matériel : sans matériel, on règle la difficulté au lieu de la charge. Pour rendre un exercice plus difficile : allonger le bras de levier, réduire le nombre d\'appuis, surélever les pieds, rendre l\'appui instable, ralentir le tempo ou marquer un temps d\'arrêt, augmenter l\'amplitude, ajouter un lest (sac à dos).',
    methOn: true,
    meth: [ { k:'simple', n:'Séries simples', d:'Toutes les séries sur le même atelier, avec récupération entre les séries' },
      { k:'circuit', n:'Circuit training', d:'Un atelier après l\'autre sans pause, puis récupération à la fin du tour' },
      { k:'superset', n:'Superset agoniste / antagoniste', d:'Enchaîner deux ateliers opposés (biceps puis triceps, quadriceps puis ischios)' },
      { k:'pyramide', n:'Pyramide', d:'La charge augmente et les répétitions diminuent à chaque série' },
      { k:'degress', n:'Séries dégressives', d:'À l\'échec, on allège la charge et on continue sans pause' },
      { k:'prefat', n:'Pré-fatigue', d:'Un exercice d\'isolation avant l\'exercice poly-articulaire du même muscle' },
      { k:'iso', n:'Isométrie', d:'Maintenir une position sans bouger (gainage, chaise)' },
      { k:'excent', n:'Excentrique accentué', d:'Phase de retour (freinage) très lente' }, ...SV_METH.map(x => ({ ...x })) ],
    forme: { on:true, pct:10 },
    tm: { work:45, rest:15, rounds:3, restR:60, voice:true, ex:['Planche (gainage ventral)','Gainage latéral droit','Gainage latéral gauche','Pont fessier','Superman'] },
    ...svDefaults(),
    bars: 'Rappel du poids des barres : haltères vides = 2 kg · petite barre = 6 kg · barre blanche ou alu sans anneau = 9 kg · avec anneau = 10 kg',
    rmTxt: 'RM = la charge que l\'on est capable de soulever une seule et unique fois sur un mouvement quasi complet. Trouver sa RM : effectuer 3 répétitions, puis augmenter la charge au niveau supérieur après 3 mouvements complets. Attention au placement du dos et au choix de la charge (sécurité).',
    resp: 'Expiration : je souffle quand je soulève la charge (force). Inspiration : je reprends mon souffle sur le retour (relâche).',
    proto: [
      { t:'🧼 Hygiène', l:['Je place ma serviette sur la machine avant de l\'utiliser', 'Je m\'hydrate régulièrement (gourde personnelle)'] },
      { t:'🏋️ Charge', l:['Sur les ateliers avec BARRE : obligation d\'avoir un pareur', 'Je choisis des charges adaptées à mes capacités'] },
      { t:'🛡️ Sécurité', l:['Je sais me préparer et m\'échauffer avant de commencer', 'Je place mon dos droit et je me gaine', 'Le mouvement ne va jamais jusqu\'à l\'extension complète'] },
      { t:'🌬️ Respiration', l:['Expiration : je souffle quand je soulève la charge (force)', 'Inspiration : je reprends mon souffle sur le mouvement du retour (relâche)'] } ],
    fce: { base:220, zones:[ { n:'Entretien de la santé', lo:50, hi:65 }, { n:'Raffermissement', lo:60, hi:75 } ] },
    table: { min:5, max:150, step:5, round:0.5 },
    wf: {
      title:'Échauffement', durMin:10, durMax:15, nbMin:4, nbMax:10, s:2, sMin:1, sMax:4, rx:15, rs:60, secRep:2, nbMat:5,
      showObj:true, showMat:true, showJust:true, showBilan:true, minCats:3, orient:true, prev:false,
      vig:['Attention au vocabulaire utilisé (vocabulaire spécifique à l\'activité)', 'Attention aux fautes d\'orthographe (essayer de se corriger ou de se faire relire avant d\'imprimer son document)'],
      cons:'Dans vos justifications, il sera apprécié de justifier votre proposition au regard de votre profil sportif et de celui du groupe (niveau, caractéristiques), des attentes (obligations données par l\'enseignant), de l\'activité (musculation), des contraintes de pratique (salle de musculation, matériel à disposition) et des ressources mises à disposition dans le carnet.',
      bilanQ:'Ce que j\'ai réussi, ce qui me plaît, ce que je changerais à la prochaine séance…',
      aide:'S\'échauffer, pour quoi faire ? Ce n\'est pas « pour les faibles » : s\'échauffer améliore la qualité des séances et réduit les risques de blessures.',
      fx: [
        { k:'temp', ico:'🌡️', n:'Augmentation de la température corporelle, qui favorise la production d\'énergie' },
        { k:'nerv', ico:'🧠', n:'Augmentation de la vitesse de transmission de l\'information par le système nerveux' },
        { k:'oxy', ico:'🫁', n:'Dilatation des vaisseaux sanguins et meilleur transport de l\'oxygène aux muscles' },
        { k:'soup', ico:'🧬', n:'Augmentation de la souplesse des muscles et de l\'élasticité des tendons' },
        { k:'art', ico:'💧', n:'Lubrification des articulations par la production de liquide synovial' } ],
      cats: [
        { k:'cardio', n:'Cardio · montée en température', ico:'❤️', fx:['temp','oxy'] },
        { k:'mob', n:'Mobilisation articulaire', ico:'🔄', fx:['art'] },
        { k:'dyn', n:'Étirements dynamiques · gammes', ico:'🦵', fx:['soup','art'] },
        { k:'act', n:'Activation musculaire', ico:'💪', fx:['temp','nerv'] },
        { k:'gain', n:'Gainage', ico:'🧱', fx:['nerv'] },
        { k:'spe', n:'Spécifique à ma séance', ico:'🎯', fx:['nerv','art'] } ],
      bank: LV_EX_BANK.map(x => ({ ...x })),
      deg: ['Échauffement peu pertinent, voire inexistant', 'Échauffement incomplet et peu structuré', 'Échauffement structuré et complet (durée, variété des exercices)', 'Échauffement structuré et complet (durée, variété des exercices) et orienté en fonction de la séance'] },
  };
}
/* complète un objet de réglages avec les valeurs proposées (clés ajoutées dans une version plus récente) */
function lvFill(o, d){
  if (o == null || typeof o !== 'object' || Array.isArray(o)) return JSON.parse(JSON.stringify(d));
  Object.keys(d).forEach(k => { if (o[k] === undefined) o[k] = JSON.parse(JSON.stringify(d[k]));
    else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k]) && o[k] && typeof o[k] === 'object' && !Array.isArray(o[k])) lvFill(o[k], d[k]); });
  return o;
}
const LV = () => ROOT.lv;
const WF = () => ROOT.lv.wf;

/* chargement : réglages, préréglage, ateliers du livret, noms des thèmes */
let LV_TH_ORIG = null;
function lvLoad(){
  const svOld = ROOT.lv && !ROOT.lv.svV;
  ROOT.lv = lvFill(ROOT.lv, lvDefaults());
  if (svOld) { SV_METH.forEach(x => { if (!ROOT.lv.meth.some(y => y.k === x.k)) ROOT.lv.meth.push({ ...x }); });
    if (JSON.stringify(ROOT.lv.niv?.abdos) === JSON.stringify(['Bras tendus','Bras croisés','Mains aux tempes','Jambes levées'])) ROOT.lv.niv.abdos = SV_ABDOS.slice(); }
  if ((ROOT.lv.mcV || 1) < 2) { LV_MC_SM.forEach(x => { if (!ROOT.lv.mc.some(y => y.id === x.id)) ROOT.lv.mc.push({ ...x, niv:[...x.niv] }); }); const pl = ROOT.lv.mc.find(y => y.id === 'c_plank'); if (pl) pl.sm = true; ROOT.lv.mcV = 2; }
  if (!ROOT.mobPreset) ROOT.mobPreset = 'livret';
  if (!ROOT.thN) ROOT.thN = {};
  lvInstallMachines(); lvApplyThemes();
}
function lvApplyThemes(){
  if (!LV_TH_ORIG) LV_TH_ORIG = JSON.parse(JSON.stringify(THEMES));
  Object.keys(LV_TH_ORIG).forEach(k => { const o = { ...LV_TH_ORIG[k], ...(ROOT.mobPreset === 'neps' ? {} : LV_TH_LIVRET[k] || {}), ...((ROOT.thN || {})[k] || {}) };
    THEMES[k].n = o.n; THEMES[k].ico = o.ico; THEMES[k].c = o.c; });
}
/* ateliers du livret / de l'enseignant ajoutés aux machines de la salle */
function lvZonesOfGroup(g){ return g === 'bras' ? ['brD','brG','maD','maG','epD','epG'] : g === 'jam' ? [...Z_LEGS, 'han'] : g === 'tronc' ? ['ven','lom','dos'] : g === 'dos' ? [...Z_ARMS, 'dos'] : [...Z_ARMS]; }
function lvInstallMachines(){
  for (let i = MACHINES.length - 1; i >= 0; i--) if (MACHINES[i].cu) MACHINES.splice(i, 1);
  (LV().mc || []).forEach(x => { if (!x || !x.id || !x.n) return; const i = MACHINES.findIndex(m => m.g === 'cardio');
    MACHINES.splice(i < 0 ? MACHINES.length : i, 0, { id:x.id, n:x.n, ico:x.ico || '🏋️', g:GROUPS[x.g] ? x.g : 'tronc', k:x.k === 'pdc' ? 'pdc' : 'ch', u:x.u || '', pm:!!x.pm, z:lvZonesOfGroup(x.g), cu:true }); });
}
const lvUnit = mid => machine(mid)?.u === 's' ? 's' : 'rép.';
const lvZoneOf = g => (LV().zones.find(z => (z.g || []).includes(g)) || {}).k || null;
const lvMobRange = (M, k) => [M[k + 'Min'] ?? M[k], M[k + 'Max'] ?? M[k]];
const lvPcts = M => (Array.isArray(M.pcts) && M.pcts.length ? M.pcts : [M.pctLow, M.pct].filter(v => v != null)).slice().sort((a, b) => a - b);
const lvChasHTML = M => M?.ch ? `<span class="lv-chas" style="--cc:${LV_CHAS[M.ch] || '#ccc'}" title="Chasuble ${esc(M.ch)}">🎽 ${esc(M.ch)}</span>` : '';

/* ---------------------------------------------------------------------
   3. Choix des paramètres par l'élève (% de la RM, séries, répétitions, récupération)
   E.cp / E.cs / E.cr / E.crs : valeurs choisies sur l'exercice
   --------------------------------------------------------------------- */
function lvChoiceOn(n, sid, E){ if (E.k !== 'th') return null; const M = mobP(n, E.mob || mobOf(n, sid)); return M && M.choice ? M : null; }
function lvCoherence(M, t){
  const out = [], [s0, s1] = lvMobRange(M, 's'), [r0, r1] = lvMobRange(M, 'r'), [q0, q1] = lvMobRange(M, 'rest'), P = lvPcts(M);
  if (t.s < s0 || t.s > s1) out.push(`séries : ${s0} à ${s1}`);
  if (!t.pdc && (t.r < r0 || t.r > r1)) out.push(`répétitions : ${r0} à ${r1}`);
  if (t.rest < q0 || t.rest > q1) out.push(`récupération : ${fmtRest(q0)} à ${fmtRest(q1)}`);
  if (!t.pdc && P.length && (t.pct < P[0] || t.pct > P[P.length - 1])) out.push(`% de la RM : ${P.join(', ')} %`);
  return out;
}
function lvChoiceHTML(n, sid, E, t){
  const M = lvChoiceOn(n, sid, E); if (!M || !t) return '';
  const P = lvPcts(M), [s0, s1] = lvMobRange(M, 's'), [r0, r1] = lvMobRange(M, 'r'), [q0, q1] = lvMobRange(M, 'rest');
  const st = (f, v, lab, sub, d) => `<div class="lv-ch-f"><span class="lbl">${lab}</span><div class="kg-step sm"><button data-action="lvCh" data-e="${E.id}" data-f="${f}" data-d="-${d}">−</button><span class="kg-val">${esc(v)}</span><button data-action="lvCh" data-e="${E.id}" data-f="${f}" data-d="${d}">+</button></div><small class="muted">${sub}</small></div>`;
  const bad = lvCoherence(M, t);
  return `<div class="lv-choice"><div class="lv-ch-h">🎛️ Je choisis mes paramètres <small class="muted">(fourchettes du thème ${esc(M.n)})</small></div>
    <div class="lv-ch-grid">${t.pdc || t.ref ? '' : `<div class="lv-ch-f"><span class="lbl">% de la RM</span><div class="seg lv-pct">${P.map(p => `<button class="${t.pct === p ? 'on norm' : ''}" data-action="lvPct" data-e="${E.id}" data-v="${p}">${p} %</button>`).join('')}</div></div>`}
      ${st('cs', t.s, 'Séries', `${s0} à ${s1}`, 1)}${t.pdc ? '' : st('cr', t.r, 'Répétitions', `${r0} à ${r1}`, 1)}${st('crs', fmtRest(t.rest), 'Récupération', `${fmtRest(q0)} à ${fmtRest(q1)}`, 15)}</div>
    ${bad.length ? `<div class="advice warn">⚠️ Hors des paramètres du thème (${esc(bad.join(' · '))}). Justifie ce choix ou reviens dans la fourchette.</div>` : `<div class="lv-ok">✓ Paramètres cohérents avec le thème</div>`}</div>`;
}
function lvChStep(d){
  const n = curLesson(), sid = UI.sid, E0 = findE(n, sid, d.e); if (!E0) return;
  const M = lvChoiceOn(n, sid, E0); if (!M) return; const t = target(n, sid, E0);
  const cur = { cs:t.s, cr:t.r, crs:t.rest }[d.f], step = +d.d, rg = lvMobRange(M, { cs:'s', cr:'r', crs:'rest' }[d.f]);
  let v = cur + step; const lo = LV().strict ? rg[0] : (d.f === 'crs' ? 0 : 1), hi = LV().strict ? rg[1] : (d.f === 'crs' ? 600 : 50);
  v = Math.max(lo, Math.min(hi, v));
  updE(d.e, E => { E[d.f] = v; }); rerender(); flagSaved();
}

/* ---------------------------------------------------------------------
   4. Échelles des ressentis du livret : effort (E), cardio-pulmonaire (CP), musculaire (M) · 1 → 5
   E.rs = { e:[par série], cp:[…], m:[…] }
   --------------------------------------------------------------------- */
const LV_RS_C = ['#1E8E3E','#86DC96','#FFD000','#F07000','#D0161B'];
const LV_RS_F = ['#fff','#0A1633','#0A1633','#fff','#fff'];
const lvRsMode = () => LV().rs.mode || 'livret';
const lvZoneKey = k => ({ e:'zE', cp:'zCP', m:'zM' })[k];
function lvRsHTML(n, E, i){
  const R = LV().rs, M = mobP(n, E.mob || mobOf(n, UI.sid)), rs = E.rs || {};
  const lines = R.sc.map(sc => { const v = rs[sc.k]?.[i] ?? null, z = M?.[lvZoneKey(sc.k)];
    return `<div class="lv-rs-row"><div class="lv-rs-h">${sc.ico} <b>${esc(sc.n)}</b>${z ? ` <span class="lv-zone" title="Zone recherchée pour ce thème">🎯 ${z[0]}${z[1] !== z[0] ? '–' + z[1] : ''}</span>` : ''}</div>
      <div class="lv-rs-opts">${sc.lv.map((t, k) => { const on = v === k + 1, inZ = z && k + 1 >= z[0] && k + 1 <= z[1];
        return `<button class="lv-rs-b ${on ? 'on' : ''} ${inZ ? 'zone' : ''}" style="${on ? `background:${LV_RS_C[k]};color:${LV_RS_F[k]};border-color:${LV_RS_C[k]}` : ''}" data-action="lvRs" data-e="${E.id}" data-i="${i}" data-k="${sc.k}" data-v="${k + 1}"><b>${k + 1}</b><span>${esc(t)}</span></button>`; }).join('')}</div></div>`; }).join('');
  return `<div class="lv-rs"><div class="fq-h">🗣️ Ressentis · on demande à l'élève de se situer (zones 🎯 recherchées pour le thème)</div>${lines}${lvRsAdvice(n, E, i, M)}</div>`;
}
/* sensation perçue trop tôt (séries 1-2) au-dessus de la zone recherchée → hypothèses de régulation */
function lvRsAdvice(n, E, i, M){
  if (!M) return ''; const R = LV().rs, early = +R.early || 2, serie = lesson(n).suivi === 's';
  const msgs = [];
  R.sc.forEach(sc => { const z = M[lvZoneKey(sc.k)], v = E.rs?.[sc.k]?.[i]; if (!z || v == null) return;
    if (v > z[1] && (!serie || i < early)) msgs.push(`${sc.ico} ${esc(sc.n)} à ${v} ${serie ? `dès la série ${i + 1}` : ''} (zone recherchée ${z[0]}–${z[1]}) : charge trop lourde ? récupération trop courte ? rythme non respecté ?`);
    else if (v < z[0] && (!serie || i >= (target(n, UI.sid, E)?.s || 1) - 1)) msgs.push(`${sc.ico} ${esc(sc.n)} à ${v} ${serie ? 'en fin d\'exercice' : ''} (zone recherchée ${z[0]}–${z[1]}) : charge trop légère ? peux-tu augmenter le % ou les répétitions ?`); });
  return msgs.length ? `<div class="advice warn lv-reg">🔧 <b>Hypothèses de régulation</b><ul>${msgs.map(m => `<li>${m}</li>`).join('')}</ul></div>` : '';
}
function lvRsSet(d){ updE(d.e, E => { E.rs = E.rs || {}; E.rs[d.k] = E.rs[d.k] || []; const i = +d.i, v = +d.v; E.rs[d.k][i] = E.rs[d.k][i] === v ? null : v; if (S.curObs && !noObs(curLesson())) E.by = S.curObs; }); rerender(); flagSaved(); }
const lvRsMean = (E, k) => avg(vals(E.rs?.[k]));
function lvRsChips(E){ if (!E.rs) return ''; return LV().rs.sc.map(sc => { const v = lvRsMean(E, sc.k); if (v == null) return ''; const c = Math.max(1, Math.min(5, Math.round(v))) - 1;
  return `<span class="lv-rsc" style="background:${LV_RS_C[c]};color:${LV_RS_F[c]}" title="${esc(sc.n)}">${sc.k.toUpperCase()} ${fmt(v)}</span>`; }).join(''); }
const lvHasRs = E => !!E.rs && LV().rs.sc.some(sc => vals(E.rs[sc.k]).length);

/* ---------------------------------------------------------------------
   5. Carnet : points d'attention / conseils du jour, questions, analyse & justification par atelier,
      consignes des ateliers, protocole de RM
   --------------------------------------------------------------------- */
function lvTipsOf(n){
  const L = lesson(n), B = LV().tips, D = LV().thTips[L.th] || {}, P = L.tp || {};
  const pick = k => P[k] != null ? P[k] : (D[k] != null && D[k] >= 0 ? (B[k][D[k]] || '') : '');
  return { att: pick('att'), tr: pick('tr'), di: pick('di'), al: P.al || '' };
}
function lvTipsHTML(n){
  const T = lvTipsOf(n); if (!T.att && !T.tr && !T.di && !T.al) return '';
  const open = UI.open.lvTips ?? false;
  return `<section class="lv-tips ${open ? '' : 'folded'}"><h2 data-action="fold" data-k="lvTips">📒 Le carnet du jour${T.al ? ' <span class="tag mod">🎲 aléa</span>' : ''}${T.att ? ` <span class="fold-sum">📌 ${esc(T.att)}</span>` : ''}<span class="fold-ico">${open ? '▲' : '▼'}</span></h2>
    ${open ? `${T.att ? `<div class="lv-tip"><b>📌 Points d'attention du cours</b><div>${esc(T.att)}</div></div>` : ''}${T.tr ? `<div class="lv-tip"><b>🏋️ Conseils d'entraînement</b><div>${esc(T.tr)}</div></div>` : ''}${T.di ? `<div class="lv-tip"><b>🥗 Conseils diététiques du jour</b><div>${esc(T.di)}</div></div>` : ''}${T.al ? `<div class="lv-tip sv-alea"><b>🎲 Aléa du jour</b><div>${esc(T.al)}</div></div>` : ''}
      <div class="btn-row"><button class="btn small" data-action="lvProto">📜 Protocole en musculation</button><button class="btn small" data-action="lvTable">📊 Table des charges</button></div>` : ''}</section>`;
}
function lvCqList(n, w){ const L = lesson(n); if (L.cqOff) return []; const th = L.th;
  return (LV().cq || []).filter(q => q.on && q.q && (!w || q.w === w) && (!q.th || !q.th.length || q.th.includes(th))); }
function lvCqHTML(n, sid, r, w){
  const Q = lvCqList(n, w); if (!Q.length) return '';
  const a = r.cq || {};
  return `<section class="lv-cq"><h2>📒 Mon carnet · ${w === 'deb' ? 'début de séance' : 'fin de séance'}</h2>${Q.map(q => `<label class="field">${esc(q.q)}<textarea data-field="lvCq" data-q="${q.id}" placeholder="J'écris ma réponse…">${esc(a[q.id] || '')}</textarea></label>`).join('')}</section>`;
}
function lvExTxtHTML(n, sid, E){
  const X = LV().exTxt; if (!X.on || E.k === 'max') return '';
  return `<div class="lv-extxt"><label class="field">📝 ${esc(X.an)}<textarea data-field="lvAn" data-e="${E.id}" placeholder="Ce que j'ai prévu / réalisé, mes ressentis, ce que j'ai adapté…">${esc(E.an || '')}</textarea></label>
    <label class="field">💬 ${esc(X.ju)}<textarea data-field="lvJu" data-e="${E.id}" placeholder="Pourquoi cet atelier, ce %, ces séries… au regard de mon thème et de mon mobile">${esc(E.ju || '')}</textarea></label></div>`;
}
function lvConsHTML(mid){
  const m = machine(mid); if (!m) return '';
  const i = m.cu ? (LV().mc.find(x => x.id === mid) || {}) : (LV().mi[mid] || {});
  if (!i.c && !i.mu && !m.pm && !i.act) return '';
  const kf = SV_KF.filter(([k]) => k !== 'mu' && i[k]).map(([k, t]) => `<div><b>${t} :</b> ${esc(i[k])}</div>`).join('');
  return `<details class="lv-cons"><summary>📘 Connaître l'atelier${i.mu ? ` · muscle principal : <b>${esc(i.mu)}</b>` : ''}</summary>${i.c ? `<p>${esc(i.c)}</p>` : ''}${kf ? `<div class="sv-kf">${kf}</div>` : ''}${LV().resp ? `<p class="muted">🌬️ ${esc(LV().resp)}</p>` : ''}${m.pm && LV().bars ? `<p class="lv-bars">⚖️ ${esc(LV().bars)}</p>` : ''}</details>`;
}
const lvRmHTML = mid => LV().rmTxt ? `<div class="advice info lv-rm">📏 ${esc(LV().rmTxt)}</div>${machine(mid)?.pm && LV().bars ? `<div class="lv-bars">⚖️ ${esc(LV().bars)}</div>` : ''}` : '';
function lvCarnetDet(n, sid, r){
  if (!r) return ''; const out = [];
  const Q = LV().cq || []; Object.entries(r.cq || {}).forEach(([id, t]) => { if (!t) return; const q = Q.find(x => x.id === id); out.push(`<div class="lv-det">📒 <b>${esc(q ? q.q : id)}</b> ${esc(t)}</div>`); });
  (r.ex || []).forEach(E => { if (E.an || E.ju) out.push(`<div class="lv-det">📝 <b>${esc(E.m ? mName(E.m) : E.nm || '')}</b>${E.an ? ' · ' + esc(E.an) : ''}${E.ju ? ' · 💬 ' + esc(E.ju) : ''}</div>`); });
  const f = r.wu?.f; if (f) { const a = lvWfAnalyse(n, sid, f); out.push(`<div class="lv-det">🔥 <b>Fiche d'échauffement</b> · ${f.ex.length} exercice(s) · ${lvDurTxt(a.tot)} · degré indicatif ${a.deg}/4${f.bilan ? ' · bilan : ' + esc(f.bilan) : ''}</div>`); }
  return out.join('');
}

/* ---------------------------------------------------------------------
   6. ÉCHAUFFEMENT préparé par l'élève (modèle de la fiche du livret)
   Leçon : L.wu = { t:'fiche', c:{ contraintes de l'enseignant } }
   Élève : r.wu = { t:'fiche', ok, f:{ obj, mat[], ex[{k,id,n,ico,cat,m:'t'|'r',v,j}], s, rx, rs, just, bilan } }
   --------------------------------------------------------------------- */
const LV_WF_CK = ['durMin','durMax','nbMin','nbMax','sMin','sMax','s','work','rx','rs','txt'];
function lvWfC(n){ const W = WF(), c = lesson(n).wu?.c || {};
  const o = { durMin:W.durMin, durMax:W.durMax, nbMin:W.nbMin, nbMax:W.nbMax, sMin:W.sMin, sMax:W.sMax, s:null, work:null, rx:null, rs:null, txt:'' };
  LV_WF_CK.forEach(k => { if (c[k] !== undefined && c[k] !== '') o[k] = c[k]; }); return o; }
const lvBankItem = id => WF().bank.find(x => x.id === id) || null;
const lvCat = k => WF().cats.find(c => c.k === k) || null;
const lvDurTxt = s => { s = Math.round(s || 0); const m = Math.floor(s / 60), r = s % 60; return m ? `${m} min${r ? ' ' + String(r).padStart(2, '0') + ' s' : ''}` : `${r} s`; };
function lvWfNew(n){ const W = WF(), c = lvWfC(n); return { obj:'', mat:[], ex:[], s: c.s ?? W.s, rx: c.rx ?? W.rx, rs: c.rs ?? W.rs, just:'', bilan:'' }; }
function lvWfGet(n, sid){ const f = res(n, sid)?.wu?.f; return f ? { ...lvWfNew(n), ...JSON.parse(JSON.stringify(f)) } : lvWfNew(n); }
function lvWfSave(fn, n = curLesson(), sid = UI.sid){
  const f = lvWfGet(n, sid); fn(f);
  setRes(n, sid, r => { const coach = thOf(n) === 'coach'; r.wu = { ...(r.wu || {}), t: coach ? 'fiche' : (lesson(n).wu.t || 'fiche'), f }; });
}
/* valeurs effectives (contraintes imposées par l'enseignant) */
function lvWfEff(n, f){ const c = lvWfC(n), W = WF();
  const s = Math.max(c.sMin || 1, Math.min(c.sMax || 20, c.s ?? f.s ?? W.s));
  return { c, s, rx: c.rx ?? f.rx ?? 0, rs: c.rs ?? f.rs ?? 0, work: x => c.work ? +c.work : x.m === 'r' ? (+x.v || 0) * (+W.secRep || 2) : (+x.v || 0) }; }
const lvExZo = x => x.zo || lvBankItem(x.id)?.zo || 'all';
function lvExZ(x){ const b = lvBankItem(x.id); if (b?.z) return b.z; const zo = lvExZo(x);
  return zo === 'haut' ? [...Z_ARMS] : zo === 'bas' ? [...Z_LEGS, 'han'] : zo === 'tronc' ? ['lom','ven','dos'] : []; }
function lvWfBlocked(n, sid, x){ const z = zonesOf(n, sid); if (!z.length) return null; return lvExZ(x).some(k => z.includes(k)) ? 'inaptitude' : null; }
/* zones du corps travaillées dans la séance (exercices saisis, exercices du jour, sinon projet) */
function lvSeanceZones(n, sid){
  const r = res(n, sid) || {}, ids = new Set();
  (r.ex || []).forEach(E => { if (E.m && E.k !== 'max') ids.add(E.m); });
  if (!ids.size) lesson(n).ex.forEach(id => ids.add(id));
  if (!ids.size && S.projects[sid]?.ms) S.projects[sid].ms.forEach(id => ids.add(id));
  const zs = new Set(); ids.forEach(id => { const z = lvZoneOf(machine(id)?.g); if (z) zs.add(z); });
  return [...zs];
}
function lvWfAnalyse(n, sid, f){
  const W = WF(), e = lvWfEff(n, f), c = e.c, ex = f.ex || [], nb = ex.length;
  const workSum = ex.reduce((a, x) => a + e.work(x), 0);
  const tour = workSum + e.rx * Math.max(0, nb - 1), tot = nb ? e.s * tour + Math.max(0, e.s - 1) * e.rs : 0;
  const cats = new Set(ex.map(x => x.cat || lvBankItem(x.id)?.cat).filter(Boolean));
  const fx = new Set(); cats.forEach(k => (lvCat(k)?.fx || []).forEach(x => fx.add(x)));
  const zo = new Set(); ex.forEach(x => { const z = lvExZo(x); if (z === 'all') LV().zones.forEach(q => zo.add(q.k)); else zo.add(z); });
  const need = lvSeanceZones(n, sid), miss = need.filter(z => !zo.has(z));
  const okDur = tot >= c.durMin * 60 && tot <= c.durMax * 60, okNb = nb >= c.nbMin && nb <= c.nbMax;
  const justN = ex.filter(x => (x.j || '').trim()).length, okJust = !W.showJust || justN >= Math.ceil(nb / 2) || (f.just || '').trim().length > 20;
  const issues = [];
  if (!nb) issues.push('Ajoute tes exercices.');
  else {
    if (!okNb) issues.push(`Nombre d'exercices : ${nb} (attendu : ${c.nbMin === c.nbMax ? c.nbMin : c.nbMin + ' à ' + c.nbMax}).`);
    if (!okDur) issues.push(`Durée estimée ${lvDurTxt(tot)} : vise ${c.durMin} à ${c.durMax} minutes${tot < c.durMin * 60 ? ' (ajoute un exercice, une série ou allonge le temps de travail)' : ' (enlève un exercice ou une série)'}.`);
    if (cats.size < W.minCats) issues.push(`Varie tes exercices : ${cats.size} type(s) d'exercices sur ${W.minCats} attendus (cardio, mobilisation, activation, gainage…).`);
    const fxMiss = W.fx.filter(x => !fx.has(x.k)); if (fxMiss.length && fxMiss.length < W.fx.length) issues.push(`Effets pas encore recherchés : ${fxMiss.map(x => x.ico).join(' ')} ${fxMiss.map(x => x.n.split(',')[0].toLowerCase()).join(' · ')}.`);
    if (W.orient) { if (!need.length) issues.push('Ajoute d\'abord les ateliers de ta séance (ou ton projet) pour vérifier que ton échauffement les prépare.');
      else if (miss.length) issues.push(`Ta séance fait travailler : ${miss.map(k => LV().zones.find(z => z.k === k)?.n).join(', ')}. Ajoute un exercice qui prépare cette zone.`); }
    if (!okJust) issues.push('Justifie tes choix (au moins la moitié des exercices, ou une justification générale).');
  }
  let deg = 1;
  if (nb >= 2 && tot >= c.durMin * 30) deg = 2;
  if (deg === 2 && okDur && okNb && cats.size >= W.minCats) deg = 3;
  if (deg === 3 && (!W.orient || (need.length && !miss.length)) && okJust) deg = 4;
  return { tot, tour, nb, cats, fx, zo, need, miss, okDur, okNb, okJust, issues, deg, e };
}
const lvDegChip = d => `<span class="lv-deg d${d}" title="${esc(WF().deg[d - 1] || '')}">Degré ${d}</span>`;
function lvGauge(a, c){
  const max = Math.max(c.durMax * 60 * 1.3, a.tot), pct = v => Math.min(100, v / max * 100);
  return `<div class="lv-gauge"><div class="lv-g-zone" style="left:${pct(c.durMin * 60)}%;width:${pct(c.durMax * 60) - pct(c.durMin * 60)}%"></div><div class="lv-g-bar ${a.okDur ? 'ok' : a.tot > c.durMax * 60 ? 'over' : ''}" style="width:${pct(a.tot)}%"></div>
    <span class="lv-g-l">⏱ ${lvDurTxt(a.tot)} <small>(visé : ${c.durMin} à ${c.durMax} min)</small></span></div>`;
}
function lvWfAnalysisHTML(n, sid, f, a){
  const W = WF(), c = a.e.c;
  return `<div class="lv-ana">${lvGauge(a, c)}
    <div class="lv-ana-row"><b>🎯 Effets recherchés</b> ${W.fx.map(x => `<span class="lv-fx ${a.fx.has(x.k) ? 'on' : ''}" title="${esc(x.n)}">${x.ico}</span>`).join('')}
      <b style="margin-left:10px">🧩 Variété</b> ${W.cats.map(k => `<span class="lv-fx ${a.cats.has(k.k) ? 'on' : ''}" title="${esc(k.n)}">${k.ico}</span>`).join('')}</div>
    <div class="lv-ana-row"><b>🧍 Zones préparées</b> ${LV().zones.map(z => { const nd = a.need.includes(z.k), ok = a.zo.has(z.k); return `<span class="lv-zchip ${ok ? 'ok' : nd ? 'miss' : ''}">${ok ? '✓' : nd ? '✗' : '·'} ${esc(z.n)}${nd ? ' <small>(séance)</small>' : ''}</span>`; }).join('')}</div>
    <div class="lv-ana-row"><b>📊 Niveau indicatif</b> ${lvDegChip(a.deg)} <span class="muted">${esc(W.deg[a.deg - 1] || '')}</span></div>
    ${a.issues.length ? `<ul class="lv-issues">${a.issues.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<div class="lv-ok">✓ Échauffement complet : durée, variété et orientation vers ta séance.</div>'}</div>`;
}
/* bloc dans la fiche de séance */
function lvWuFicheBlock(n, sid, r, coach){
  const w = r.wu || {}, f = w.f, ok = !!w.ok, open = UI.open['wu'] ?? !ok, c = lvWfC(n), W = WF();
  const a = f ? lvWfAnalyse(n, sid, f) : null;
  const sum = f && f.ex.length ? `${f.ex.length} exercice(s) · ${lvDurTxt(a.tot)}` : '';
  const seg = coach ? `<div class="seg" style="max-width:640px;margin-bottom:8px">${['circuit','3x3','fiche'].map(k => `<button class="${(w.t || 'fiche') === k ? 'on norm' : ''}" data-action="wuType" data-t="${k}">${esc(WU_TYPES[k])}</button>`).join('')}</div>` : '';
  const body = !f || !f.ex.length ? `<div class="advice info">📝 ${coach ? 'Prépare l\'échauffement de ton cobaye' : 'Prépare ton échauffement'} sur le modèle de la fiche : ${c.nbMin === c.nbMax ? c.nbMin : c.nbMin + ' à ' + c.nbMax} exercices, ${c.durMin} à ${c.durMax} minutes${c.txt ? ' · ' + esc(c.txt) : ''}.</div>`
    : `<div class="lv-wf-list">${f.ex.map((x, i) => `<span class="lv-wf-it">${esc(x.ico || lvBankItem(x.id)?.ico || '✏️')} ${esc(x.n || '?')} <small>${c.work ? c.work + ' s' : x.m === 'r' ? x.v + ' rép.' : x.v + ' s'}</small></span>`).join('')}</div>
      <div class="muted" style="font-weight:700">${a.e.s} série(s) · récup ${a.e.rx} s entre les exercices · ${a.e.rs} s entre les séries</div>${lvWfAnalysisHTML(n, sid, f, a)}`;
  return `<section class="wu-sec ${ok ? 'ok' : ''} ${open ? '' : 'folded'}"><h2 data-action="fold" data-k="wu">🔥 ${coach ? 'Échauffement que je fais faire à mon cobaye' : esc(W.title)} · fiche${!open && sum ? ` <span class="fold-sum">${esc(sum)}</span>` : ''}${ok ? ' <span class="tag ok">✓ fait</span>' : ''}${a ? ' ' + lvDegChip(a.deg) : ''}<span class="fold-ico">${open ? '▲' : '▼'}</span></h2>
    ${open ? seg + body + `<div class="btn-row" style="margin-top:10px"><button class="btn primary" data-action="wfEdit">✏️ ${f && f.ex.length ? 'Modifier ma fiche' : 'Préparer ma fiche'}</button>
      ${f && f.ex.length ? `<button class="btn orange" data-action="wfRun">▶️ Lancer l'échauffement</button><button class="btn small" data-action="wfPrint">🖨️ Imprimer</button>` : ''}
      <button class="btn ${ok ? 'green' : ''}" data-action="wuDone">${ok ? '✓ Échauffement fait' : '✓ J\'ai fini mon échauffement'}</button></div>
      ${ok && W.showBilan ? `<label class="field" style="margin-top:10px">📝 Bilan de mon échauffement <small class="muted">(${esc(W.bilanQ)})</small><textarea data-field="lvWf" data-f="bilan">${esc(f?.bilan || '')}</textarea></label>` : ''}` : ''}</section>`;
}
/* éditeur de la fiche (page entière) */
function viewWuPick(){
  const n = curLesson(), list = sortedStudents().filter(s => present(n, s.id) && passFilter(s));
  return `<div class="card strong"><h2>🔥 Préparer mon échauffement · leçon ${n}</h2><div class="muted" style="font-weight:700">Touche ton prénom.</div></div>
    <div class="tiles">${list.map(s => { const f = res(n, s.id)?.wu?.f; return `<button class="tile" data-action="wfOpen" data-sid="${s.id}">${band(s.id)}<span class="name">${esc(nameOf(s.id))}</span><span class="meta">${f && f.ex.length ? `📝 ${f.ex.length} exercice(s) · ${lvDurTxt(lvWfAnalyse(n, s.id, f).tot)}` : 'fiche à préparer'}</span></button>`; }).join('') || '<p>Aucun élève.</p>'}</div>`;
}
function viewWuEdit(){
  const n = curLesson(), sid = UI.sid, s = student(sid); if (!s) return '<p>Élève introuvable.</p>';
  const W = WF(), f = lvWfGet(n, sid), a = lvWfAnalyse(n, sid, f), c = a.e.c, coach = thOf(n) === 'coach';
  const prev = lvWfPrev(n, sid);
  const lock = '<span class="lv-lock" title="Imposé par l\'enseignant">🔒</span>';
  const stp = (act, v, k, extra = '') => `<div class="kg-step sm"><button data-action="${act}" ${k ? `data-k="${k}"` : ''} data-d="-1" ${extra}>−</button><span class="kg-val">${esc(v)}</span><button data-action="${act}" ${k ? `data-k="${k}"` : ''} data-d="1" ${extra}>+</button></div>`;
  const sugg = [...new Set(f.ex.map(x => lvBankItem(x.id)?.mat).filter(Boolean))].filter(m => !(f.mat || []).some(t => (t || '').toLowerCase() === m.toLowerCase()));
  const nbMat = Math.max(+W.nbMat || 5, (f.mat || []).length);
  return `<div class="entry-name">${band(sid)}<div class="who">${esc(nameOf(sid))}</div><span class="saved" id="saved-flag"></span>
      <span class="theme-badge" style="background:#E3401B">🔥 ${esc(W.title)}</span><span class="muted" style="font-weight:800">Leçon ${n} · ${new Date().toLocaleDateString('fr-FR')}</span>
      <button class="btn" data-action="wfBack" style="margin-left:auto">← Retour</button></div>
    <div class="card compact lv-c"><b>📏 Ce qui est attendu</b> · ${c.nbMin === c.nbMax ? c.nbMin : c.nbMin + ' à ' + c.nbMax} exercices · ${c.durMin} à ${c.durMax} minutes${c.s ? ` · ${c.s} série(s)` : ''}${c.work ? ` · ${c.work} s d'effort par exercice` : ''}${c.rx != null ? ` · ${c.rx} s de récup entre les exercices` : ''}${c.rs != null ? ` · ${c.rs} s entre les séries` : ''}
      ${c.txt ? `<div class="lv-ctxt">👩‍🏫 ${esc(c.txt)}</div>` : ''}<div class="muted lv-aide">💡 ${esc(W.aide)}</div>
      ${prev && !f.ex.length ? `<div class="btn-row" style="margin-top:6px"><button class="btn small primary" data-action="wfPrev">📋 Reprendre mon échauffement de la leçon ${prev.n}</button></div>` : ''}</div>
    ${W.showObj ? `<div class="card compact"><label class="field">🎯 Objectif <small class="muted">(facultatif)</small><textarea data-field="lvWf" data-f="obj" placeholder="Ex. : préparer mes épaules et mes jambes pour ma séance de gain de volume">${esc(f.obj)}</textarea></label></div>` : ''}
    <div class="card compact"><h2>🏃 Exercices prévus <small class="muted">(temps de travail ou nombre de répétitions)</small></h2>
      <div class="lv-wf-rows">${f.ex.map((x, i) => { const b = lvWfBlocked(n, sid, x), bi = lvBankItem(x.id);
        return `<div class="lv-wf-row ${b ? 'blk' : ''}"><span class="lv-wf-n">${i + 1}.</span><span class="lv-wf-ico">${esc(x.ico || bi?.ico || '✏️')}</span>
          <div class="lv-wf-main">${x.id ? `<b>${esc(x.n)}</b>${bi?.d ? `<small class="muted"> · ${esc(bi.d)}</small>` : ''}` : `<input type="text" data-field="lvWfX" data-f="n" data-k="${x.k}" value="${esc(x.n)}" placeholder="Nom de l'exercice">
            <select data-field="lvWfX" data-f="cat" data-k="${x.k}"><option value="">Type ?</option>${W.cats.map(k => `<option value="${k.k}" ${x.cat === k.k ? 'selected' : ''}>${k.ico} ${esc(k.n)}</option>`).join('')}</select>
            <select data-field="lvWfX" data-f="zo" data-k="${x.k}">${[['all','Tout le corps'], ...LV().zones.map(z => [z.k, z.n])].map(([k, t]) => `<option value="${k}" ${lvExZo(x) === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`}
            ${b ? '<span class="tag inapte">🩹 inaptitude</span>' : ''}
            ${W.showJust ? `<input type="text" class="lv-j" data-field="lvWfX" data-f="j" data-k="${x.k}" value="${esc(x.j || '')}" placeholder="Justification : pourquoi cet exercice ?">` : ''}</div>
          <div class="lv-wf-val">${c.work ? `<b>${c.work} s</b> ${lock}` : `<div class="seg lv-mode"><button class="${x.m !== 'r' ? 'on norm' : ''}" data-action="wfMode" data-k="${x.k}" data-m="t">⏱ temps</button><button class="${x.m === 'r' ? 'on norm' : ''}" data-action="wfMode" data-k="${x.k}" data-m="r">🔁 rép.</button></div>
            ${stp('wfStep', x.m === 'r' ? x.v + ' rép.' : x.v + ' s', x.k)}`}</div>
          <div class="lv-wf-act"><button class="btn small ghost" data-action="wfMove" data-k="${x.k}" data-d="-1" ${i ? '' : 'disabled'}>↑</button><button class="btn small ghost" data-action="wfMove" data-k="${x.k}" data-d="1" ${i < f.ex.length - 1 ? '' : 'disabled'}>↓</button><button class="btn small red" data-action="wfDel" data-k="${x.k}">🗑</button></div></div>`; }).join('')}</div>
      <div class="btn-row" style="margin-top:8px"><button class="btn primary" data-action="wfAdd" ${f.ex.length >= c.nbMax ? 'disabled' : ''}>➕ Ajouter un exercice</button><button class="btn" data-action="wfFree" ${f.ex.length >= c.nbMax ? 'disabled' : ''}>✏️ Exercice de mon choix</button>
        <span class="muted" style="font-weight:800">${f.ex.length} / ${c.nbMax}</span></div></div>
    <div class="card compact"><h2>🔁 Organisation</h2><div class="lv-org">
      <div class="cf"><span class="lbl">Nombre de séries</span>${c.s ? `<b>${c.s}</b> ${lock}` : stp('wfS', a.e.s)}</div>
      <div class="cf"><span class="lbl">Récupération entre chaque exercice</span>${c.rx != null ? `<b>${c.rx} s</b> ${lock}` : stp('wfRx', a.e.rx + ' s')}</div>
      <div class="cf"><span class="lbl">Récupération entre chaque série</span>${c.rs != null ? `<b>${c.rs} s</b> ${lock}` : stp('wfRs', a.e.rs + ' s')}</div></div>
      ${!c.work && f.ex.some(x => x.m === 'r') ? `<div class="muted" style="font-weight:700;font-size:14px">Pour estimer la durée, une répétition compte ${W.secRep} s.</div>` : ''}</div>
    <div class="card compact strong"><h2>🔎 Mon échauffement est-il complet ?</h2>${lvWfAnalysisHTML(n, sid, f, a)}</div>
    ${W.showMat ? `<div class="card compact"><h2>🧰 Matériel nécessaire</h2>${sugg.length ? `<div class="btn-row" style="margin-bottom:6px"><span class="muted" style="font-weight:800">Suggestions :</span>${sugg.map(m => `<button class="btn small" data-action="wfMat" data-v="${esc(m)}">＋ ${esc(m)}</button>`).join('')}</div>` : ''}
      <div class="lv-mat">${Array.from({ length: nbMat }, (_, i) => `<input type="text" data-field="lvWfM" data-i="${i}" value="${esc(f.mat?.[i] || '')}" placeholder="•">`).join('')}</div></div>` : ''}
    ${W.showJust ? `<div class="card compact"><label class="field">💬 Justifications <small class="muted">(profil sportif, groupe, attentes, activité, contraintes de la salle, ressources du carnet)</small><textarea data-field="lvWf" data-f="just" rows="4">${esc(f.just)}</textarea></label></div>` : ''}
    <div class="card compact lv-vig"><b>⚠️ Points de vigilance</b><ul>${W.vig.filter(Boolean).map(v => `<li>${esc(v)}</li>`).join('')}</ul>${W.cons ? `<div><b>💡 Conseils :</b> ${esc(W.cons)}</div>` : ''}</div>
    ${W.showBilan ? `<div class="card compact"><label class="field">📝 Bilan de mon échauffement <small class="muted">(${esc(W.bilanQ)})</small><textarea data-field="lvWf" data-f="bilan" rows="3">${esc(f.bilan)}</textarea></label></div>` : ''}
    <div class="nav-bottom"><button class="btn" data-action="wfBack">← Retour</button>${f.ex.length ? `<button class="btn small" data-action="wfPrint">🖨️ Imprimer ma fiche</button><button class="btn orange" data-action="wfRun">▶️ Lancer l'échauffement</button>` : ''}</div>`;
}
/* dernier échauffement de l'élève (leçons précédentes sur cet appareil ou reçu avec le QR) */
function lvWfPrev(n, sid){
  for (let k = n - 1; k >= 1; k--) { const f = res(k, sid)?.wu?.f; if (f && f.ex?.length) return { n:k, f }; }
  const p = S.wfPrev?.[sid]; return p && p.f?.ex?.length ? p : null;
}
function lvWfPicker(){
  const n = curLesson(), sid = UI.sid, W = WF(), f = lvWfGet(n, sid), have = new Set(f.ex.map(x => x.id).filter(Boolean));
  const m = modal(`<h2>➕ Ajouter un exercice d'échauffement</h2><div class="muted" style="font-weight:700">Touche un exercice : il s'ajoute à ta fiche avec un temps ou un nombre de répétitions proposé, que tu peux modifier.</div>
    ${W.cats.map(k => { const items = W.bank.filter(x => x.cat === k.k); if (!items.length) return '';
      return `<h3 style="margin-top:12px">${k.ico} ${esc(k.n)} <small class="muted">${(k.fx || []).map(x => W.fx.find(y => y.k === x)?.ico || '').join(' ')}</small></h3><div class="wu-grid">${items.map(x => { const b = lvWfBlocked(n, sid, x);
        return `<button class="wu-chip ${have.has(x.id) ? 'on' : ''} ${b ? 'blk' : ''}" data-pick="${x.id}" ${b ? 'disabled' : ''} title="${b ? 'inaptitude' : esc(x.d || '')}"><span class="wu-ico">${esc(x.ico || '•')}</span><span>${esc(x.n)}<small class="muted"> · ${x.m === 'r' ? x.v + ' rép.' : x.v + ' s'}</small></span></button>`; }).join('')}</div>`; }).join('')}
    <div class="btn-row spread" style="margin-top:12px"><button class="btn" data-p="close">Fermer</button></div>`, { wide:true });
  m.querySelector('[data-p="close"]').onclick = () => { closeModal(); rerender(); };
  m.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { const x = lvBankItem(b.dataset.pick); if (!x) return;
    const c = lvWfC(n); if (lvWfGet(n, sid).ex.length >= c.nbMax) return toast(`${c.nbMax} exercices maximum`);
    lvWfSave(F => F.ex.push({ k:rnd(5), id:x.id, n:x.n, ico:x.ico, cat:x.cat, m:x.m, v:x.v, j:'' })); b.classList.add('on'); toast('✓ ' + x.n); rerender(); });
}
/* ---- chrono de l'échauffement (moteur commun : cxRun, dans cycle.js) ---- */
function lvWfSteps(n, f){
  const e = lvWfEff(n, f), out = [], ex = f.ex.map(x => ({ ...x, ico: x.ico || lvBankItem(x.id)?.ico || '' }));
  for (let t = 1; t <= e.s; t++) { ex.forEach((x, i) => { out.push({ ty:'w', x, t, i, sec: e.work(x), reps: !e.c.work && x.m === 'r' ? x.v : null });
      if (i < ex.length - 1 && e.rx > 0) out.push({ ty:'rx', sec:e.rx, t, nx:ex[i + 1] }); });
    if (t < e.s && e.rs > 0) out.push({ ty:'rs', sec:e.rs, t, nx:ex[0] }); }
  return { steps:out, s:e.s };
}
function lvWfRun(){
  const n = curLesson(), sid = UI.sid, f = lvWfGet(n, sid); if (!f.ex.length) return toast('Ajoute d\'abord des exercices');
  const { steps, s } = lvWfSteps(n, f);
  cxRun(steps, { title:'🔥 ' + nameOf(sid), tours:s, onEnd: fin => { if (fin) { setRes(n, sid, r => { r.wu = { ...(r.wu || {}), ok:true }; }); toast('🎉 Échauffement terminé !', 3000); UI.open.wu = true; } rerender(); } });
}
/* ---- impression de la fiche (modèle du livret) ---- */
function lvWfPrintHTML(n, sid, blank){
  const W = WF(), c = lvWfC(n), f = blank ? lvWfNew(n) : lvWfGet(n, sid), a = blank ? null : lvWfAnalyse(n, sid, f), e = lvWfEff(n, f);
  const rows = Math.max(blank ? c.nbMax : f.ex.length, blank ? 0 : 1);
  const exL = i => { const x = f.ex[i]; if (!x) return '&nbsp;'; return `<b>${esc(x.n)}</b> · ${c.work ? c.work + ' s' : x.m === 'r' ? x.v + ' répétitions' : x.v + ' s'}`; };
  const mat = blank ? [] : (f.mat || []).filter(Boolean);
  return `<div class="print-page wfp"><table class="wfp-head"><tr><td>NOM Prénom : <b>${blank ? '' : esc(nameOf(sid))}</b></td><td class="wfp-cls">Classe : <b>${esc(className())}</b></td></tr></table>
    <div class="wfp-trow"><div class="wfp-title">${esc(W.title)}</div><div class="wfp-date"><div>Date</div><b>${blank ? '' : new Date().toLocaleDateString('fr-FR')}</b></div></div>
    <div class="wfp-2col">${W.showObj ? `<div class="wfp-box"><div class="wfp-bh">Objectif (facultatif)</div><div class="wfp-txt">${blank ? '' : esc(f.obj)}</div></div>` : ''}
      ${W.showMat ? `<div class="wfp-box"><div class="wfp-bh">Matériel nécessaire :</div><ul>${Array.from({ length: Math.max(+W.nbMat || 5, mat.length) }, (_, i) => `<li>${esc(mat[i] || '')}&nbsp;</li>`).join('')}</ul></div>` : ''}</div>
    <table class="wfp-main"><tr><th>Échauffement <i>(${c.durMin} à ${c.durMax} minutes)</i></th>${W.showJust ? '<th>Justifications</th>' : ''}</tr>
      <tr><td colspan="${W.showJust ? 2 : 1}" class="wfp-sub">Exercices prévus (temps de travail ou nombre de répétitions) :${c.txt ? ` <i>${esc(c.txt)}</i>` : ''}</td></tr>
      ${Array.from({ length: rows }, (_, i) => `<tr class="wfp-ex"><td>• ${exL(i)}</td>${W.showJust ? `<td>${blank ? '' : esc(f.ex[i]?.j || '')}</td>` : ''}</tr>`).join('')}
      <tr><td>Nombre de séries : <b>${blank ? (c.s || '______') : e.s}</b><br>Temps de récupération :<ul><li>Entre chaque exercice : <b>${blank ? (c.rx != null ? c.rx + ' s' : '______') : e.rx + ' s'}</b> <i>(en secondes ou minutes)</i></li><li>Entre chaque série : <b>${blank ? (c.rs != null ? c.rs + ' s' : '______') : e.rs + ' s'}</b> <i>(en secondes ou minutes)</i></li></ul>
        ${a ? `<div class="wfp-est">Durée estimée : <b>${lvDurTxt(a.tot)}</b></div>` : ''}</td>${W.showJust ? `<td>${blank ? '' : esc(f.just)}</td>` : ''}</tr></table>
    <div class="wfp-vig"><b>Points de vigilance :</b><ul>${W.vig.filter(Boolean).map(v => `<li>${esc(v)}</li>`).join('')}</ul>${W.cons ? `<p><u><b>Conseils :</b></u> <i>${esc(W.cons)}</i></p>` : ''}</div>
    ${W.showBilan ? `<div class="wfp-box wfp-bilan"><div class="wfp-bh">Bilan de mon échauffement<div><i>(${esc(W.bilanQ)})</i></div></div><div class="wfp-txt">${blank ? '' : esc(f.bilan)}</div></div>` : ''}</div>`;
}
function lvWfAideHTML(){
  const W = WF();
  return `<div class="print-page wfp"><div class="wfp-title" style="margin-bottom:10px">Document d'aide à la préparation d'un échauffement</div><p><b>${esc(W.aide)}</b></p>
    <table class="wfp-main"><tr><th>Effets de l'échauffement</th></tr>${W.fx.map(x => `<tr><td>${x.ico} ${esc(x.n)}</td></tr>`).join('')}</table>
    <table class="wfp-main" style="margin-top:10px"><tr><th>Type d'exercice</th><th>Effets</th><th>Exemples</th></tr>${W.cats.map(k => `<tr><td>${k.ico} <b>${esc(k.n)}</b></td><td>${(k.fx || []).map(x => W.fx.find(y => y.k === x)?.ico || '').join(' ')}</td><td>${W.bank.filter(x => x.cat === k.k).slice(0, 6).map(x => esc(x.n)).join(' · ')}</td></tr>`).join('')}</table></div>`;
}
function lvPrint(html){
  let root = document.getElementById('print-root'); if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
  root.innerHTML = html; document.body.classList.add('printing');
  setTimeout(() => { window.print(); setTimeout(() => { document.body.classList.remove('printing'); root.innerHTML = ''; }, 500); }, 300);
}
/* ---- enseignant : les fiches de la leçon ---- */
function lvProfWu(){
  const n = curLesson(), L = lesson(n), W = L.wu || {};
  if (W.t !== 'fiche' && thOf(n) !== 'coach') return `<div class="card strong"><h2>🔥 Échauffements · leçon ${n}</h2><div class="advice info">Cette leçon n'utilise pas la fiche d'échauffement. Dans ✏️ Modifier la leçon, choisissez l'échauffement « ${esc(WU_TYPES.fiche)} ».</div>
    <div class="btn-row"><button class="btn small" data-action="wfPrintBlank">🖨️ Imprimer une fiche vierge</button></div></div>`;
  L.wfEv = L.wfEv || {};
  const list = sortedStudents().filter(s => present(n, s.id)), W2 = WF();
  const rows = list.map(s => { const r = res(n, s.id), f = r?.wu?.f, a = f ? lvWfAnalyse(n, s.id, f) : null, ev = L.wfEv[s.id] || {};
    return `<tr><td>${band(s.id)} <b>${esc(nameOf(s.id))}</b></td><td class="c">${f ? f.ex.length : '—'}</td><td class="c">${a ? `<span class="${a.okDur ? 'up' : 'down'}">${lvDurTxt(a.tot)}</span>` : '—'}</td>
      <td>${a ? W2.cats.map(k => `<span class="lv-fx ${a.cats.has(k.k) ? 'on' : ''}" title="${esc(k.n)}">${k.ico}</span>`).join('') : ''}</td>
      <td>${a ? (a.need.length ? (a.miss.length ? `<span class="down">✗ ${a.miss.length} zone(s)</span>` : '<span class="up">✓ orienté</span>') : '<span class="muted">séance ?</span>') : ''}</td>
      <td class="c">${a ? lvDegChip(a.deg) : '—'}</td><td class="c">${r?.wu?.ok ? '✓' : ''}</td>
      <td><select data-field="wfEv" data-sid="${s.id}"><option value="">—</option>${[1,2,3,4].map(d => `<option value="${d}" ${+ev.d === d ? 'selected' : ''}>Degré ${d}</option>`).join('')}</select></td>
      <td>${f ? `<button class="btn small" data-action="wfView" data-sid="${s.id}">👁</button>` : ''}</td></tr>`; }).join('');
  return `<div class="card strong"><h2>🔥 Échauffements préparés · leçon ${n}</h2><div class="muted" style="font-weight:700">Le degré indicatif est calculé par l'appli (durée, nombre et variété des exercices, orientation vers la séance, justifications). Le degré retenu est le vôtre.</div>
      <div class="btn-row" style="margin-top:8px"><button class="btn small" data-action="wfCModal" data-n="${n}">⚙️ Contraintes de la leçon</button><button class="btn small" data-action="wfPrintAll">🖨️ Imprimer les fiches</button><button class="btn small" data-action="wfPrintBlank">🖨️ Fiche vierge</button></div></div>
    <div class="card"><div class="pj-table-wrap"><table class="pj-table"><tr><th>Élève</th><th class="c">Exercices</th><th class="c">Durée</th><th>Variété</th><th>Séance</th><th class="c">Indicatif</th><th class="c">Fait</th><th>Degré retenu</th><th></th></tr>${rows || '<tr><td colspan="9">Aucun élève présent.</td></tr>'}</table></div>
      <div class="muted" style="margin-top:8px;font-size:14px">${W2.deg.map((t, i) => `<div>${lvDegChip(i + 1)} ${esc(t)}</div>`).join('')}</div></div>`;
}
/* contraintes de la leçon (modèle du livret, leçon 5 : 5 exercices × 3 ou 6 × 2, 45 s / 15 s) */
function lvWfCModal(n){
  if (guardLock(n)) return; const L = lesson(n), W = WF(); L.wu.c = L.wu.c || {}; const c = L.wu.c;
  const fld = (k, lab, ph) => `<label class="field">${lab}<input type="number" data-c="${k}" value="${c[k] ?? ''}" placeholder="${ph}"></label>`;
  const m = modal(`<h2>⚙️ Échauffement de la leçon ${n} · contraintes</h2><div class="muted" style="font-weight:700">Laissez vide pour garder les réglages généraux (menu enseignant → 3. Échauffement) ou laisser le choix à l'élève.</div>
    <div class="lv-cgrid">${fld('durMin', 'Durée minimale (min)', W.durMin)}${fld('durMax', 'Durée maximale (min)', W.durMax)}${fld('nbMin', 'Exercices minimum', W.nbMin)}${fld('nbMax', 'Exercices maximum', W.nbMax)}
      ${fld('sMin', 'Séries minimum', W.sMin)}${fld('sMax', 'Séries maximum', W.sMax)}${fld('s', 'Séries imposées', 'libre')}${fld('work', 'Temps d\'effort imposé (s)', 'libre')}${fld('rx', 'Récup entre exercices imposée (s)', 'libre')}${fld('rs', 'Récup entre séries imposée (s)', 'libre')}</div>
    <label class="field">Consigne affichée à l'élève<textarea data-c="txt" placeholder="Ex. : choisir 5 exercices à répéter 3 fois ou 6 exercices à répéter 2 fois">${esc(c.txt || '')}</textarea></label>
    <div class="btn-row"><button class="btn small" data-ex="l5">📘 Exemple leçon 5 du livret</button><button class="btn small ghost" data-ex="clr">Tout effacer</button></div>
    <div class="btn-row spread" style="margin-top:12px"><button class="btn" data-p="cancel">Annuler</button><button class="btn primary" data-p="ok">Valider</button></div>`, { wide:true });
  m.querySelectorAll('[data-ex]').forEach(b => b.onclick = () => { const V = b.dataset.ex === 'l5' ? { durMin:10, durMax:15, nbMin:5, nbMax:6, sMin:2, sMax:3, s:'', work:45, rx:15, rs:15, txt:'Choisir 5 exercices à répéter 3 fois ou 6 exercices à répéter 2 fois · 1 minute par exercice : 45 secondes d\'effort et 15 secondes de récupération' } : {};
    m.querySelectorAll('[data-c]').forEach(i => { i.value = V[i.dataset.c] ?? ''; }); });
  m.querySelector('[data-p="cancel"]').onclick = closeModal;
  m.querySelector('[data-p="ok"]').onclick = () => { const o = {}; m.querySelectorAll('[data-c]').forEach(i => { const k = i.dataset.c, v = i.value.trim(); if (v === '') return; o[k] = k === 'txt' ? v : Math.max(0, +v.replace(',', '.')); });
    L.wu.c = o; save(); closeModal(); render(); toast('✓ Contraintes de l\'échauffement enregistrées'); };
}
/* carnet du jour d'une leçon : points d'attention, conseils (banque du livret ou texte libre) */
function lvTipsModal(n){
  if (guardLock(n)) return; const L = lesson(n), B = LV().tips, T = lvTipsOf(n);
  const box = (k, lab) => `<label class="field">${lab}<select data-b="${k}"><option value="">— choisir dans le livret —</option>${B[k].map((t, i) => `<option value="${i}">${esc(t.slice(0, 90))}${t.length > 90 ? '…' : ''}</option>`).join('')}</select><textarea data-t="${k}" rows="3">${esc(T[k])}</textarea></label>`;
  const m = modal(`<h2>📒 Carnet de la leçon ${n}</h2><div class="muted" style="font-weight:700">Affiché sur les tablettes élèves en haut de la fiche de séance. Les propositions viennent du livret (modifiables dans le menu enseignant → 4. Carnet & connaissances).</div>
    ${box('att', '📌 Points d\'attention du cours')}${box('tr', '🏋️ Conseils d\'entraînement')}${box('di', '🥗 Conseils diététiques du jour')}
    <label class="field">🎲 Aléa du jour (épreuve)<select data-al><option value="">— aucun / choisir —</option>${(LV().aleas || []).map((t, i) => `<option value="${i}">${esc(t)}</option>`).join('')}</select><textarea data-t="al" rows="2">${esc(T.al || '')}</textarea></label>
    <label class="field"><span><input type="checkbox" data-cq ${L.cqOff ? '' : 'checked'}> Questions du carnet (mobile, sensations, bilan…) sur les tablettes</span></label>
    <div class="btn-row spread" style="margin-top:12px"><button class="btn ghost" data-p="def">↺ Textes proposés pour ce thème</button><button class="btn" data-p="cancel">Annuler</button><button class="btn primary" data-p="ok">Valider</button></div>`, { wide:true });
  m.querySelector('[data-al]').onchange = e => { if (e.target.value !== '') m.querySelector('[data-t="al"]').value = LV().aleas[+e.target.value]; };
  m.querySelectorAll('[data-b]').forEach(s => s.onchange = () => { if (s.value !== '') m.querySelector(`[data-t="${s.dataset.b}"]`).value = B[s.dataset.b][+s.value]; });
  m.querySelector('[data-p="cancel"]').onclick = closeModal;
  m.querySelector('[data-p="def"]').onclick = () => { delete L.tp; const D = lvTipsOf(n); ['att','tr','di'].forEach(k => m.querySelector(`[data-t="${k}"]`).value = D[k]); L.tp = undefined; };
  m.querySelector('[data-p="ok"]').onclick = () => { L.tp = {}; ['att','tr','di','al'].forEach(k => L.tp[k] = m.querySelector(`[data-t="${k}"]`).value.trim()); L.cqOff = !m.querySelector('[data-cq]').checked; save(); closeModal(); render(); toast('✓ Carnet de la leçon enregistré'); };
}

/* ---------------------------------------------------------------------
   7. Pages de paramètres (enseignant) — tout est modifiable
   --------------------------------------------------------------------- */
function lvGet(path){ return path.split('.').reduce((o, k) => o == null ? o : o[k], ROOT.lv); }
function lvSetP(path, v){ const ks = path.split('.'); let o = ROOT.lv;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; o = o[ks[i]]; }
  o[ks[ks.length - 1]] = v; lvBump(); }
function lvBump(){ ROOT.lv.v = (ROOT.lv.v || 1) + 1; save(); }
function lvIn(path, type = 'text', attrs = ''){ const v = lvGet(path);
  if (type === 'num') return `<input type="number" inputmode="decimal" data-field="lvSet" data-p="${path}" data-t="num" value="${v ?? ''}" ${attrs}>`;
  if (type === 'area') return `<textarea data-field="lvSet" data-p="${path}" data-t="text" ${attrs}>${esc(v ?? '')}</textarea>`;
  if (type === 'lines') return `<textarea data-field="lvSet" data-p="${path}" data-t="lines" ${attrs}>${esc((v || []).join('\n'))}</textarea>`;
  return `<input type="text" data-field="lvSet" data-p="${path}" data-t="text" value="${esc(v ?? '')}" ${attrs}>`; }
const lvTgl = (path, label) => `<button class="tgl ${lvGet(path) ? 'on' : ''}" data-action="lvTgl" data-p="${path}">${label} : <b>${lvGet(path) ? 'oui' : 'non'}</b></button>`;
const lvF = (label, inner, cls = '') => `<label class="field lv-f ${cls}"><span>${label}</span>${inner}</label>`;
const lvSecH = (ico, t, sub, reset) => `<div class="row"><h2 class="grow" style="margin:0">${ico} ${t}</h2>${reset ? `<button class="btn small ghost" data-action="lvReset" data-k="${reset}">↺ Valeurs du livret</button>` : ''}</div>${sub ? `<div class="muted" style="font-weight:700;margin:4px 0 8px">${sub}</div>` : ''}`;

/* 🎯 Thèmes d'entraînement (mobiles) */
function lvProfMobiles(){
  const mf = (k, key, t, attrs = '') => { const M = MOB[k]; let v = M[key];
    if (t === 'pcts') v = (M.pcts || []).join(', '); if (t === 'z0') v = M[attrs]?.[0] ?? ''; if (t === 'z1') v = M[attrs]?.[1] ?? '';
    const typ = t === 'text' || t === 'area' ? 'text' : t === 'pcts' ? 'text' : 'number';
    const zk = t === 'z0' || t === 'z1' ? `data-z="${attrs}"` : '';
    if (t === 'area') return `<textarea data-field="lvMob" data-m="${k}" data-k="${key}" data-t="text" rows="2">${esc(v ?? '')}</textarea>`;
    return `<input type="${typ}" ${typ === 'number' ? 'inputmode="numeric"' : ''} data-field="lvMob" data-m="${k}" data-k="${key}" data-t="${t}" ${zk} value="${esc(v ?? '')}" ${t === 'z0' || t === 'z1' ? 'min="1" max="5" placeholder="–"' : ''}>`; };
  const trip = (k, base, lab, unit) => `<div class="lv-trip"><span class="lbl">${lab}</span><span>proposé ${mf(k, base, 'num')}</span><span>de ${mf(k, base + 'Min', 'num')}</span><span>à ${mf(k, base + 'Max', 'num')}</span>${unit ? `<small>${unit}</small>` : ''}</div>`;
  const card = k => { const M = MOB[k];
    return `<div class="card compact lv-mob"><div class="row"><span style="font-size:28px">${esc(M.ico)}</span>${mf(k, 'n', 'text', '')}<label class="pil-sel">🎽<select data-field="lvMob" data-m="${k}" data-k="ch" data-t="text"><option value="">—</option>${Object.keys(LV_CHAS).map(c => `<option ${M.ch === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <button class="tgl ${M.choice ? 'on' : ''}" data-action="lvMobTgl" data-m="${k}">🎛️ Choix de l'élève : <b>${M.choice ? 'oui' : 'non'}</b></button></div>
      <div class="lv-mgrid">${lvF('Icône', mf(k, 'ico', 'text'))}${lvF('% de la RM proposés (séparés par des virgules)', mf(k, 'pcts', 'pcts'))}${lvF('% par défaut', mf(k, 'pct', 'num'))}${lvF('% « pas en forme » (vide = non)', mf(k, 'pctLow', 'numnull'))}</div>
      ${trip(k, 's', 'Séries', '')}${trip(k, 'r', 'Répétitions', '')}${trip(k, 'rest', 'Récupération', 'secondes')}
      <div class="lv-mgrid">${lvF('Rythme / vitesse d\'exécution', mf(k, 'ry', 'text'))}${lvF('Organisation', mf(k, 'org', 'text'))}
        ${lvF('Règle de choix des ateliers', `<select data-field="lvMob" data-m="${k}" data-k="rule" data-t="text">${Object.entries(LV_RULES).map(([r, t]) => `<option value="${r}" ${M.rule === r ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`)}
        ${M.rule === 'zone' ? lvF('Ateliers par zone du corps', mf(k, 'per', 'num')) : M.rule === '2x2' ? '' : lvF('Nombre d\'ateliers', mf(k, 'nbEx', 'num'))}
        ${lvF('Entre les ateliers', `<select data-field="lvMob" data-m="${k}" data-k="inter" data-t="textnull"><option value="">rien</option><option value="cardio" ${M.inter === 'cardio' ? 'selected' : ''}>cardio</option><option value="endu" ${M.inter === 'endu' ? 'selected' : ''}>endurance</option></select>`)}
        ${M.inter ? lvF('Durée (min)', mf(k, 'interMin', 'num')) : ''}</div>
      <div class="lv-mgrid">${lvF('Objectif du thème', mf(k, 'goal', 'area'))}${lvF('Sensations recherchées', mf(k, 'sens', 'area'))}${lvF('Ordre des exercices', mf(k, 'ordre', 'area'))}</div>
      <div class="lv-mgrid">${lvF('⚖️ Charge', `<select data-field="lvMob" data-m="${k}" data-k="cm" data-t="text"><option value="rm" ${M.cm !== 'ref' ? 'selected' : ''}>% de la RM</option><option value="ref" ${M.cm === 'ref' ? 'selected' : ''}>Charge de référence trouvée par le ressenti</option></select>`)}
        ${lvF('🧭 Sensations attendues (séparées par des virgules)', `<input type="text" data-field="lvMob" data-m="${k}" data-k="snE" data-t="list" value="${esc((M.snE || []).join(', '))}">`)}</div>
      <div class="lv-th"><b>🧩 Méthodes conseillées :</b>${(LV().meth || []).map(x => `<button class="pchip ${(M.methR || []).includes(x.k) ? 'on' : ''}" data-action="svMethR" data-m="${k}" data-v="${x.k}">${esc(x.n)}</button>`).join('')}</div>
      <div class="lv-zgrid"><b>🎯 Zones recherchées (1 à 5)</b>${LV().rs.sc.map(sc => { const zk = lvZoneKey(sc.k); return `<span>${sc.ico} ${esc(sc.n)} : de ${mf(k, zk, 'z0', zk)} à ${mf(k, zk, 'z1', zk)}</span>`; }).join('')}</div></div>`; };
  return `<div class="card strong">${lvSecH('🎯', 'Thèmes d\'entraînement (mobiles)', 'Paramètres du livret : fourchettes de séries, répétitions, récupération et % de la RM, rythme, chasuble, sensations et zones recherchées. Ils valent pour toutes les classes et partent sur les tablettes avec le QR de la leçon.')}
      <div class="btn-row"><span class="muted" style="font-weight:800">Préréglage :</span><button class="btn small ${ROOT.mobPreset !== 'neps' ? 'primary' : ''}" data-action="lvPreset" data-v="livret">📘 Livret EPPCS (3 thèmes)</button><button class="btn small ${ROOT.mobPreset === 'neps' ? 'primary' : ''}" data-action="lvPreset" data-v="neps">🧩 N'EPS d'origine (5 mobiles)</button>
        <button class="tgl ${LV().strict ? 'on' : ''}" data-action="lvTgl" data-p="strict">🔒 L'élève reste dans les fourchettes : <b>${LV().strict ? 'oui' : 'non (alerte)'}</b></button></div></div>
    ${MOB_IDS.map(card).join('')}
    <div class="btn-row"><button class="btn small ghost" data-action="mobReset">↺ Revenir aux valeurs du préréglage</button></div>`;
}
/* 📘 Livret & paramètres */
function lvProfLivret(keys){
  const V = LV(), W = V.wf, TH = Object.keys(THEMES);
  const sec = (h, body) => `<div class="card compact">${h}${body}</div>`;
  const thOpts = (q, i) => TH.map(t => `<button class="pchip ${q.th?.includes(t) ? 'on' : ''}" data-action="lvCqTh" data-i="${i}" data-th="${t}">${THEMES[t].ico} ${esc(THEMES[t].n)}</button>`).join('');
  const P_ = {
    head: `<div class="card strong"><h2>📘 Livret d'entraînement · paramètres</h2><div class="muted" style="font-weight:700">Tout ce qui vient du livret est modifiable ici et part sur les tablettes avec le QR de la leçon. « ↺ Valeurs du livret » remet une rubrique comme dans le livret.</div>
      <div class="btn-row" style="margin-top:8px"><button class="btn small" data-action="lvPilPreset" data-v="livret">🏛 Piliers du livret (respiration, dos, trajet moteur…)</button><button class="btn small ghost" data-action="lvPilPreset" data-v="neps">🏛 Piliers d'origine</button>
        <button class="btn small" data-action="lvTable">📊 Table des charges</button><button class="btn small" data-action="lvFce">🫀 FCE</button><button class="btn small" data-action="lvProto">📜 Protocole</button></div></div>`,
    thN: `    ${sec(lvSecH('🏷', 'Noms des thèmes des leçons', ''), `<div class="lv-mgrid">${TH.map(t => `<label class="field lv-f"><span>${esc(LV_TH_ORIG?.[t]?.n || t)}</span><div class="row"><input type="text" style="max-width:70px" data-field="lvTh" data-th="${t}" data-k="ico" value="${esc(THEMES[t].ico)}"><input type="text" class="grow" data-field="lvTh" data-th="${t}" data-k="n" value="${esc(THEMES[t].n)}"></div></label>`).join('')}</div>`)}`,
    zones: `    ${sec(lvSecH('🧍', 'Zones du corps', 'Utilisées pour la règle « par zone du corps » (2 ateliers par zone) et pour vérifier que l\'échauffement prépare la séance.', 'zones'), V.zones.map((z, i) => `<div class="row lv-zrow">${lvIn(`zones.${i}.n`)}${Object.keys(GROUPS).filter(g => g !== 'cardio').map(g => `<button class="pchip ${z.g.includes(g) ? 'on' : ''}" data-action="lvZoneG" data-i="${i}" data-g="${g}">${esc(GROUPS[g].n)}</button>`).join('')}</div>`).join(''))}`,
    rs: `    ${sec(lvSecH('🗣️', 'Échelles des ressentis', 'Ressentis demandés à la fin de chaque série (ou de chaque exercice).', 'rs'), `<div class="seg" style="max-width:560px;margin-bottom:8px">${[['livret','Livret · E / CP / M (1 à 5)'],['borg','Échelle de Borg'],['both','Les deux']].map(([k, t]) => `<button class="${V.rs.mode === k ? 'on norm' : ''}" data-action="lvRsMode" data-v="${k}">${t}</button>`).join('')}</div>
      ${lvF('Alerte si la sensation dépasse la zone recherchée avant la série n°', lvIn('rs.early', 'num'))}
      ${V.rs.sc.map((sc, i) => `<div class="lv-scale"><div class="row">${lvIn(`rs.sc.${i}.ico`, 'text', 'style="max-width:70px"')}${lvIn(`rs.sc.${i}.n`, 'text', 'class="grow"')}</div><div class="lv-5">${sc.lv.map((_, k) => `<label><b>${k + 1}</b>${lvIn(`rs.sc.${i}.lv.${k}`)}</label>`).join('')}</div></div>`).join('')}`)}`,
    cq: `    ${sec(lvSecH('📒', 'Questions du carnet', 'Posées sur la tablette au début ou à la fin de la séance, selon les thèmes choisis (aucun thème = toutes les leçons).', 'cq'), V.cq.map((q, i) => `<div class="lv-cqrow"><div class="row">${lvIn(`cq.${i}.q`, 'text', 'class="grow"')}<select data-field="lvSet" data-p="cq.${i}.w" data-t="text"><option value="deb" ${q.w === 'deb' ? 'selected' : ''}>début</option><option value="fin" ${q.w === 'fin' ? 'selected' : ''}>fin</option></select>${lvTgl(`cq.${i}.on`, 'active')}<button class="btn small red" data-action="lvCqDel" data-i="${i}">🗑</button></div><div class="lv-th">${thOpts(q, i)}</div></div>`).join('') + '<div class="btn-row"><button class="btn small green" data-action="lvCqAdd">＋ Question</button></div>')}`,
    exTxt: `    ${sec(lvSecH('📝', 'Analyse et justification par atelier', '', 'exTxt'), `<div class="row">${lvTgl('exTxt.on', 'Afficher')}</div><div class="lv-mgrid">${lvF('Intitulé « analyse »', lvIn('exTxt.an'))}${lvF('Intitulé « justification »', lvIn('exTxt.ju'))}</div>`)}`,
    tips: `    ${sec(lvSecH('💡', 'Conseils du carnet', 'Une proposition par ligne. Le numéro de ligne (1, 2…) choisi pour chaque thème est proposé par défaut dans les leçons de ce thème (0 = aucun).', 'tips'), `<div class="lv-mgrid">${lvF('📌 Points d\'attention', lvIn('tips.att', 'lines', 'rows="6"'))}${lvF('🏋️ Conseils d\'entraînement', lvIn('tips.tr', 'lines', 'rows="6"'))}${lvF('🥗 Conseils diététiques', lvIn('tips.di', 'lines', 'rows="6"'))}</div>
      <table class="simple"><tr><th>Thème</th><th>📌</th><th>🏋️</th><th>🥗</th></tr>${TH.map(t => `<tr><td>${THEMES[t].ico} ${esc(THEMES[t].n)}</td>${['att','tr','di'].map(k => `<td><input type="number" min="0" style="max-width:70px" data-field="lvThTip" data-th="${t}" data-k="${k}" value="${(V.thTips[t]?.[k] ?? -1) + 1}"></td>`).join('')}</tr>`).join('')}</table>`)}`,
    mi: `    ${sec(lvSecH('📘', 'Consignes des machines (contenus d\'enseignement)', 'Affichées sur la fiche de l\'élève (📘 Consignes) avec le muscle principal.', 'mi'), `<div class="lv-mi">${MACHINES.filter(m => !m.cu && m.g !== 'cardio').map(m => `<div class="lv-mi-row">${mImg(m, 'm-mini')}<b>${esc(m.n)}</b>${lvIn(`mi.${m.id}.mu`, 'text', 'placeholder="Muscle principal"')}${lvIn(`mi.${m.id}.c`, 'area', 'rows="2" placeholder="Consignes"')}${SV_KF.slice(1).map(([k, t]) => lvIn(`mi.${m.id}.${k}`, 'text', `placeholder="${t}"`)).join('')}${m.k === 'pdc' ? `<label class="field lv-f" style="flex-basis:100%"><span>🪜 Niveaux de difficulté (un par ligne)</span>${lvIn(`niv.${m.id}`, 'lines', 'rows="4"')}</label>` : ''}</div>`).join('')}</div>`)}`,
    mc: `    ${sec(lvSecH('🧰', 'Ateliers « petit matériel » et ateliers ajoutés', 'Ajoutés aux machines de la salle (cochez / décochez-les ci-dessus). Poids de corps : max en répétitions, ou en secondes (gainage).', 'mc'), V.mc.map((x, i) => `<div class="lv-mi-row">${lvIn(`mc.${i}.ico`, 'text', 'style="max-width:60px"')}${lvIn(`mc.${i}.n`, 'text', 'placeholder="Nom de l\'atelier"')}
      <select data-field="lvMc" data-i="${i}" data-k="g">${Object.keys(GROUPS).filter(g => g !== 'cardio').map(g => `<option value="${g}" ${x.g === g ? 'selected' : ''}>${esc(GROUPS[g].n)}</option>`).join('')}</select>
      <select data-field="lvMc" data-i="${i}" data-k="k"><option value="ch" ${x.k !== 'pdc' ? 'selected' : ''}>charge (kg)</option><option value="pdc" ${x.k === 'pdc' && x.u !== 's' ? 'selected' : ''}>poids de corps (rép.)</option><option value="pdcs" ${x.k === 'pdc' && x.u === 's' ? 'selected' : ''}>poids de corps (secondes)</option></select>
      ${lvTgl(`mc.${i}.pm`, 'haltères / barre')}${lvIn(`mc.${i}.mu`, 'text', 'placeholder="Muscle principal"')}${lvIn(`mc.${i}.c`, 'area', 'rows="2" placeholder="Consignes"')}${SV_KF.slice(1).map(([k, t]) => lvIn(`mc.${i}.${k}`, 'text', `placeholder="${t}"`)).join('')}${x.k === 'pdc' ? `<label class="field lv-f" style="flex-basis:100%"><span>🪜 Niveaux de difficulté (un par ligne, du plus facile au plus dur)</span>${lvIn(`mc.${i}.niv`, 'lines', 'rows="4"')}</label>` : ''}<button class="btn small red" data-action="lvMcDel" data-i="${i}">🗑</button></div>`).join('') + '<div class="btn-row"><button class="btn small green" data-action="lvMcAdd">＋ Atelier</button></div>')}`,
    rm: `    ${sec(lvSecH('📏', 'RM, respiration, barres', '', 'rmTxt'), `${lvF('Protocole de détermination de la RM (affiché lors des prises de max)', lvIn('rmTxt', 'area', 'rows="3"'))}${lvF('Respiration', lvIn('resp', 'area', 'rows="2"'))}${lvF('Rappel du poids des barres', lvIn('bars', 'area', 'rows="2"'))}`)}`,
    proto: `    ${sec(lvSecH('📜', 'Les règles essentielles : le protocole en musculation', 'Une règle par ligne.', 'proto'), `<div class="lv-mgrid">${V.proto.map((p, i) => lvF(lvIn(`proto.${i}.t`), lvIn(`proto.${i}.l`, 'lines', 'rows="3"'))).join('')}</div>`)}`,
    table: `    ${sec(lvSecH('📊', 'Table des charges et FCE', '', 'table'), `<div class="lv-mgrid">${lvF('RM de départ (kg)', lvIn('table.min', 'num'))}${lvF('RM de fin (kg)', lvIn('table.max', 'num'))}${lvF('Pas (kg)', lvIn('table.step', 'num'))}${lvF('Arrondi (kg)', lvIn('table.round', 'num'))}
      ${lvF('FC max = … − âge', lvIn('fce.base', 'num'))}${V.fce.zones.map((z, i) => lvF(lvIn(`fce.zones.${i}.n`), `<div class="row">${lvIn(`fce.zones.${i}.lo`, 'num', 'style="max-width:90px"')} à ${lvIn(`fce.zones.${i}.hi`, 'num', 'style="max-width:90px"')} %</div>`)).join('')}</div>`)}`
  };
  return (keys || Object.keys(P_)).map(k => P_[k] || '').join('');
}
/* 🔥 Échauffement : la fiche modèle et la banque d'exercices */
function lvProfEchauf(){
  const W = WF(), p = 'wf.';
  return `<div class="card strong">${lvSecH('🔥', 'Échauffement préparé par l\'élève · fiche modèle', 'Valeurs générales de la fiche (chaque leçon peut imposer ses propres contraintes : ✏️ Modifier la leçon → ⚙️). Pour l\'utiliser : dans la structure des leçons, choisissez l\'échauffement « ' + esc(WU_TYPES.fiche) + ' ».', 'wf')}
      <div class="btn-row"><button class="btn small" data-action="wfPrintBlank">🖨️ Imprimer une fiche vierge</button></div></div>
    <div class="card compact"><h3>📏 Cadre</h3><div class="lv-mgrid">${lvF('Titre de la fiche', lvIn(p + 'title'))}${lvF('Durée minimale (min)', lvIn(p + 'durMin', 'num'))}${lvF('Durée maximale (min)', lvIn(p + 'durMax', 'num'))}
      ${lvF('Exercices minimum', lvIn(p + 'nbMin', 'num'))}${lvF('Exercices maximum (lignes de la fiche)', lvIn(p + 'nbMax', 'num'))}${lvF('Séries proposées', lvIn(p + 's', 'num'))}${lvF('Séries minimum', lvIn(p + 'sMin', 'num'))}${lvF('Séries maximum', lvIn(p + 'sMax', 'num'))}
      ${lvF('Récup entre exercices proposée (s)', lvIn(p + 'rx', 'num'))}${lvF('Récup entre séries proposée (s)', lvIn(p + 'rs', 'num'))}${lvF('Durée d\'une répétition (s, pour l\'estimation)', lvIn(p + 'secRep', 'num'))}${lvF('Lignes « matériel »', lvIn(p + 'nbMat', 'num'))}
      ${lvF('Types d\'exercices différents attendus (variété)', lvIn(p + 'minCats', 'num'))}</div>
      <div class="btn-row">${lvTgl(p + 'showObj', 'Objectif')}${lvTgl(p + 'showMat', 'Matériel')}${lvTgl(p + 'showJust', 'Justifications')}${lvTgl(p + 'showBilan', 'Bilan')}${lvTgl(p + 'orient', 'Vérifier l\'orientation vers la séance')}${lvTgl(p + 'prev', 'Envoyer le dernier échauffement de chaque élève avec le QR (si les élèves changent de tablette)')}</div></div>
    <div class="card compact"><h3>🗒 Textes de la fiche</h3>${lvF('Points de vigilance (un par ligne)', lvIn(p + 'vig', 'lines', 'rows="3"'))}${lvF('Conseils', lvIn(p + 'cons', 'area', 'rows="3"'))}${lvF('Question du bilan', lvIn(p + 'bilanQ'))}${lvF('Phrase d\'aide (s\'échauffer, pour quoi faire ?)', lvIn(p + 'aide', 'area', 'rows="2"'))}</div>
    <div class="card compact"><h3>🎯 Effets de l'échauffement (document d'aide)</h3>${W.fx.map((x, i) => `<div class="row">${lvIn(`${p}fx.${i}.ico`, 'text', 'style="max-width:70px"')}${lvIn(`${p}fx.${i}.n`, 'text', 'class="grow"')}</div>`).join('')}</div>
    <div class="card compact"><h3>🧩 Types d'exercices et effets</h3>${W.cats.map((c, i) => `<div class="row lv-zrow">${lvIn(`${p}cats.${i}.ico`, 'text', 'style="max-width:70px"')}${lvIn(`${p}cats.${i}.n`)}${W.fx.map(x => `<button class="pchip ${c.fx.includes(x.k) ? 'on' : ''}" data-action="lvCatFx" data-i="${i}" data-x="${x.k}" title="${esc(x.n)}">${x.ico}</button>`).join('')}</div>`).join('')}</div>
    <div class="card compact"><h3>🏃 Banque d'exercices proposés à l'élève</h3><div class="lv-bank">${W.bank.map((x, i) => `<div class="lv-mi-row">${lvIn(`${p}bank.${i}.ico`, 'text', 'style="max-width:60px"')}${lvIn(`${p}bank.${i}.n`)}
      <select data-field="lvSet" data-p="${p}bank.${i}.cat" data-t="text">${W.cats.map(c => `<option value="${c.k}" ${x.cat === c.k ? 'selected' : ''}>${c.ico} ${esc(c.n)}</option>`).join('')}</select>
      <select data-field="lvSet" data-p="${p}bank.${i}.m" data-t="text"><option value="t" ${x.m !== 'r' ? 'selected' : ''}>⏱ temps (s)</option><option value="r" ${x.m === 'r' ? 'selected' : ''}>🔁 répétitions</option></select>${lvIn(`${p}bank.${i}.v`, 'num', 'style="max-width:90px"')}
      <select data-field="lvSet" data-p="${p}bank.${i}.zo" data-t="text">${[['all','Tout le corps'], ...LV().zones.map(z => [z.k, z.n])].map(([k, t]) => `<option value="${k}" ${x.zo === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>${lvIn(`${p}bank.${i}.mat`, 'text', 'placeholder="Matériel"')}
      <button class="btn small red" data-action="lvBankDel" data-i="${i}">🗑</button></div>`).join('')}</div><div class="btn-row"><button class="btn small green" data-action="lvBankAdd">＋ Exercice</button></div></div>
    <div class="card compact"><h3>📊 Degrés d'acquisition (grille d'évaluation · Échauffement)</h3>${W.deg.map((_, i) => lvF('Degré ' + (i + 1), lvIn(`${p}deg.${i}`, 'area', 'rows="2"'))).join('')}</div>`;
}

/* ---------------------------------------------------------------------
   8. Outils : table des charges, FCE, protocole
   --------------------------------------------------------------------- */
function lvTableHTML(pcts){
  const T = LV().table, rd = +T.round || 0.5, rows = [];
  for (let v = +T.min || 5; v <= (+T.max || 150) + 1e-9; v += (+T.step || 5)) rows.push(v);
  const r = x => String(Math.round(x / rd) * rd).replace('.', ',');
  return `<table class="simple lv-tab"><tr><th>RM (kg)</th>${pcts.map(p => `<th>${p} %</th>`).join('')}</tr>${rows.reverse().map(v => `<tr><td><b>${String(v).replace('.', ',')}</b></td>${pcts.map(p => `<td>${r(v * p / 100)}</td>`).join('')}</tr>`).join('')}</table>`;
}
function lvTableModal(){
  const groups = [...new Map(MOB_IDS.map(k => [lvPcts(MOB[k]).join(','), k])).values()];
  let sel = 'all';
  const pctsOf = () => sel === 'all' ? [...new Set(MOB_IDS.flatMap(k => lvPcts(MOB[k])))].sort((a, b) => a - b) : lvPcts(MOB[sel]);
  const m = modal(`<h2>📊 Table des charges · % de la RM</h2><div class="seg" id="lv-tsel" style="margin-bottom:8px"></div><div id="lv-tbox" class="lv-tbox"></div>
    <div class="btn-row spread" style="margin-top:10px"><button class="btn" data-p="close">Fermer</button><button class="btn primary" data-p="print">🖨️ Imprimer</button></div>`, { wide:true });
  const draw = () => { m.querySelector('#lv-tsel').innerHTML = [['all', 'Tous'], ...groups.map(k => [k, `${MOB[k].ico} ${MOB[k].n}`])].map(([k, t]) => `<button class="${sel === k ? 'on norm' : ''}" data-s="${k}">${esc(t)}</button>`).join('');
    m.querySelector('#lv-tbox').innerHTML = lvTableHTML(pctsOf()); m.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { sel = b.dataset.s; draw(); }); };
  draw();
  m.querySelector('[data-p="close"]').onclick = closeModal;
  m.querySelector('[data-p="print"]').onclick = () => { const h = `<div class="print-page"><div class="print-h">Musculation · table des charges (% de la RM)</div>${lvTableHTML(pctsOf())}</div>`; closeModal(); lvPrint(h); };
}
function lvFceModal(){
  const F = LV().fce;
  const m = modal(`<h2>🫀 Fréquence cardiaque d'entraînement (FCE)</h2><div class="muted" style="font-weight:700">FCE = FC repos + (FC max − FC repos) × % de l'intensité choisie · FC max ≈ ${F.base} − âge</div>
    <div class="lv-cgrid"><label class="field">Âge<input type="number" id="f-a" value="16"></label><label class="field">FC de repos (battements/min)<input type="number" id="f-r" value="70"></label><label class="field">Intensité (%)<input type="number" id="f-p" value="60"></label></div>
    <div id="f-out" class="lv-fce"></div><div class="btn-row spread" style="margin-top:10px"><button class="btn" data-p="close">Fermer</button></div>`, { wide:true });
  const calc = () => { const a = +m.querySelector('#f-a').value || 0, r = +m.querySelector('#f-r').value || 0, p = +m.querySelector('#f-p').value || 0, mx = F.base - a, fce = x => Math.round(r + (mx - r) * x / 100);
    m.querySelector('#f-out').innerHTML = `<div>FC max ≈ <b>${mx}</b> · FCE à ${p} % = <b class="big-v">${fce(p)}</b> battements/min</div>${F.zones.map(z => `<div>${esc(z.n)} (${z.lo} à ${z.hi} %) : <b>${fce(z.lo)} à ${fce(z.hi)}</b> battements/min</div>`).join('')}`; };
  m.querySelectorAll('input').forEach(i => i.oninput = calc); calc();
  m.querySelector('[data-p="close"]').onclick = closeModal;
}
function lvProtoModal(){
  const V = LV();
  const m = modal(`<h2>📜 Les règles essentielles : le protocole en musculation</h2><div class="lv-proto">${V.proto.map(p => `<div class="lv-tip"><b>${esc(p.t)}</b><ul>${(p.l || []).filter(Boolean).map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`).join('')}</div>
    ${V.bars ? `<div class="lv-bars">⚖️ ${esc(V.bars)}</div>` : ''}<div class="btn-row spread" style="margin-top:10px"><button class="btn" data-p="close">Fermer</button></div>`, { wide:true });
  m.querySelector('[data-p="close"]').onclick = closeModal;
}

/* ---------------------------------------------------------------------
   9. Transmission avec le QR de la leçon
   --------------------------------------------------------------------- */
/* seules les différences avec les valeurs du livret partent dans le QR (QR court tant que rien n'est modifié) */
function lvDiff(a, d){
  if (JSON.stringify(a) === JSON.stringify(d)) return undefined;
  if (Array.isArray(a) && Array.isArray(d) && a.some(x => x && typeof x === 'object')) {          // listes (banque, ateliers…) : élément par élément
    const o = { _n:a.length }; a.forEach((x, i) => { const y = lvDiff(x, d[i]); if (y !== undefined) o[i] = y; }); return o; }
  if (a && d && typeof a === 'object' && typeof d === 'object' && !Array.isArray(a) && !Array.isArray(d)) {
    const o = {}; Object.keys(a).forEach(k => { const x = lvDiff(a[k], d[k]); if (x !== undefined) o[k] = x; }); return Object.keys(o).length ? o : undefined; }
  return a;
}
function lvApplyDiff(base, df){
  if (df === undefined) return base;
  if (df && typeof df === 'object' && df._n !== undefined) { const arr = (Array.isArray(base) ? base : []).slice(0, df._n);
    Object.keys(df).forEach(k => { if (k !== '_n') arr[+k] = lvApplyDiff(arr[+k], df[k]); }); return arr; }
  if (df && typeof df === 'object' && !Array.isArray(df) && base && typeof base === 'object' && !Array.isArray(base)) { Object.keys(df).forEach(k => { base[k] = lvApplyDiff(base[k], df[k]); }); return base; }
  return df;
}
function lvPack(n){
  const L = lesson(n), cur = JSON.parse(JSON.stringify(ROOT.lv)), D = lvDefaults();
  ['v','tips','thTips'].forEach(k => { delete cur[k]; delete D[k]; });
  const fiche = L.wu?.t === 'fiche' || L.th === 'coach';
  if (!fiche) { delete cur.wf; delete D.wf; }
  const out = { pre: ROOT.mobPreset, thN: ROOT.thN || {}, tp: lvTipsOf(n), cqOff: L.cqOff ? 1 : 0, df: lvDiff(cur, D) || 0, wfk: fiche ? 1 : 0,
    pf: Object.keys(L.pf || {}), ae: evSelfOn(n) ? evSelfPack(n) : 0, pr: ROOT.lv.profOn ? S.svProf || {} : {} };
  if (fiche && WF().prev) { const P = {}; sortedStudents().forEach(s => { if (!present(n, s.id)) return; const p = lvWfPrev(n, s.id); if (!p) return;
      P[s.id] = [p.n, p.f.s, p.f.rx, p.f.rs, p.f.ex.map(x => x.id ? [x.id, x.m, x.v] : [0, x.m, x.v, x.n, x.cat || '', x.zo || 'all'])]; });
    if (Object.keys(P).length) out.wfp = P; }
  return out;
}
function lvUnpack(p, n){
  if (!p) return;
  ROOT.mobPreset = p.pre || 'livret'; ROOT.thN = p.thN || {};
  const old = ROOT.lv || {}, nv = lvApplyDiff(lvDefaults(), p.df || undefined);
  if (!p.wfk && old.wf) nv.wf = lvFill(old.wf, lvDefaults().wf);        // réglages de la fiche gardés d'une leçon à l'autre
  ROOT.lv = nv;
  const L = lesson(n); L.tp = p.tp || undefined; L.cqOff = !!p.cqOff;
  L.pf = Object.fromEntries((p.pf || []).map(id => [id, 1])); S.svProf = p.pr || {}; L.aeS = evSelfUnpack(p.ae);
  S.wfPrev = {}; Object.entries(p.wfp || {}).forEach(([sid, a]) => { S.wfPrev[sid] = { n:a[0], f:{ s:a[1], rx:a[2], rs:a[3], obj:'', mat:[], ex:(a[4] || []).map(e => { if (e[0]) { const b = lvBankItem(e[0]) || {}; return { k:rnd(5), id:e[0], n:b.n || e[0], ico:b.ico, cat:b.cat, m:e[1], v:e[2], j:'' }; }
    return { k:rnd(5), id:null, n:e[3], ico:'✏️', cat:e[4], zo:e[5], m:e[1], v:e[2], j:'' }; }) } }; });
  lvInstallMachines(); lvApplyThemes();
}
/* fusion du champ « carnet » question par question */
function lvMergeCq(a, b, ta, tb){ return tb > ta ? { ...(a || {}), ...(b || {}) } : { ...(b || {}), ...(a || {}) }; }

/* ---------------------------------------------------------------------
   10. Actions et saisies
   --------------------------------------------------------------------- */
function lvWfX(k, fn){ lvWfSave(f => { const x = f.ex.find(y => y.k === k); if (x) fn(x, f); }); }
const LV_ACTIONS = {
  lvCh: d => lvChStep(d),
  lvPct: d => { updE(d.e, E => { E.cp = +d.v; }); rerender(); flagSaved(); },
  lvRs: d => lvRsSet(d),
  lvProto: () => lvProtoModal(), lvTable: () => lvTableModal(), lvFce: () => lvFceModal(),
  // échauffement (élève)
  lvHomeWf: () => { UI.filter = null; go('wuPick'); },
  wfOpen: d => { UI.wfFrom = 'pick'; go('wuEdit', { sid:d.sid }); },
  wfEdit: () => { UI.wfFrom = 'entry'; go('wuEdit', { sid:UI.sid }); },
  wfBack: () => go(UI.wfFrom === 'pick' ? 'wuPick' : 'entry'),
  wfAdd: () => lvWfPicker(),
  wfFree: () => { const c = lvWfC(curLesson()); if (lvWfGet(curLesson(), UI.sid).ex.length >= c.nbMax) return toast(`${c.nbMax} exercices maximum`);
    lvWfSave(f => f.ex.push({ k:rnd(5), id:null, n:'', ico:'✏️', cat:'', zo:'all', m:'t', v:30, j:'' })); rerender(); },
  wfDel: d => { lvWfSave(f => { f.ex = f.ex.filter(x => x.k !== d.k); }); rerender(); },
  wfMove: d => { lvWfSave(f => { const i = f.ex.findIndex(x => x.k === d.k), j = i + (+d.d); if (i < 0 || j < 0 || j >= f.ex.length) return; [f.ex[i], f.ex[j]] = [f.ex[j], f.ex[i]]; }); rerender(); },
  wfMode: d => { lvWfX(d.k, x => { if (x.m === d.m) return; x.m = d.m; x.v = d.m === 'r' ? 10 : 30; }); rerender(); },
  wfStep: d => { lvWfX(d.k, x => { const st = x.m === 'r' ? 1 : 5; x.v = Math.max(x.m === 'r' ? 1 : 5, Math.min(x.m === 'r' ? 100 : 900, (+x.v || 0) + (+d.d) * st)); }); rerender(); },
  wfS: d => { const c = lvWfC(curLesson()); lvWfSave(f => { f.s = Math.max(c.sMin || 1, Math.min(c.sMax || 10, (lvWfEff(curLesson(), f).s) + (+d.d))); }); rerender(); },
  wfRx: d => { lvWfSave(f => { f.rx = Math.max(0, Math.min(300, (+f.rx || 0) + (+d.d) * 5)); }); rerender(); },
  wfRs: d => { lvWfSave(f => { f.rs = Math.max(0, Math.min(600, (+f.rs || 0) + (+d.d) * 15)); }); rerender(); },
  wfMat: d => { lvWfSave(f => { f.mat = (f.mat || []).filter(Boolean); f.mat.push(d.v); }); rerender(); },
  wfPrev: () => { const n = curLesson(), p = lvWfPrev(n, UI.sid); if (!p) return; const c = lvWfC(n);
    lvWfSave(f => { f.ex = p.f.ex.slice(0, c.nbMax).map(x => ({ ...x, k:rnd(5) })); f.s = p.f.s; f.rx = p.f.rx; f.rs = p.f.rs; if (!f.obj) f.obj = p.f.obj || ''; if (!(f.mat || []).some(Boolean)) f.mat = p.f.mat || []; });
    toast('📋 Échauffement de la leçon ' + p.n + ' repris : adapte-le à ta séance du jour'); rerender(); },
  wfRun: () => lvWfRun(),
  wfPrint: () => lvPrint(lvWfPrintHTML(curLesson(), UI.sid)),
  // échauffement (enseignant)
  wfCModal: d => lvWfCModal(+d.n || curLesson()),
  lvTipsModal: d => lvTipsModal(+d.n || curLesson()),
  wfPrintAll: () => { const n = curLesson(), ids = sortedStudents().filter(s => res(n, s.id)?.wu?.f?.ex?.length).map(s => s.id); if (!ids.length) return toast('Aucune fiche reçue');
    lvPrint(ids.map(id => lvWfPrintHTML(n, id)).join('')); },
  wfPrintBlank: () => lvPrint(lvWfPrintHTML(curLesson(), null, true) + lvWfAideHTML()),
  wfView: d => { const n = curLesson(); const m = modal(`<div class="lv-view">${lvWfPrintHTML(n, d.sid)}</div>${lvWfAnalysisHTML(n, d.sid, lvWfGet(n, d.sid), lvWfAnalyse(n, d.sid, lvWfGet(n, d.sid)))}
      <div class="btn-row spread" style="margin-top:10px"><button class="btn" data-p="close">Fermer</button><button class="btn primary" data-p="print">🖨️ Imprimer</button></div>`, { wide:true });
    m.querySelector('[data-p="close"]').onclick = closeModal; m.querySelector('[data-p="print"]').onclick = () => { closeModal(); lvPrint(lvWfPrintHTML(n, d.sid)); }; },
  // paramètres
  lvTgl: d => { lvSetP(d.p, !lvGet(d.p)); rerender(); },
  lvRsMode: d => { lvSetP('rs.mode', d.v); rerender(); },
  lvPreset: async d => { if (!(await confirmBox(d.v === 'neps' ? 'Préréglage N\'EPS d\'origine ?' : 'Préréglage du livret EPPCS ?', 'Les paramètres des thèmes (séries, répétitions, récupération, %, rythme…) et les noms des thèmes reprennent les valeurs de ce préréglage. Vos modifications sur les thèmes sont effacées. Les leçons terminées gardent leurs paramètres.', 'Appliquer', true))) return;
    ROOT.mobPreset = d.v; ROOT.mob = null; ROOT.thN = {}; if (d.v === 'neps') ROOT.lv.rs.mode = 'borg'; else ROOT.lv.rs.mode = 'livret';
    applyMobParams(null); lvApplyThemes(); lvBump(); render(); toast('✓ Préréglage appliqué'); },
  lvPilPreset: async d => { if (!(await confirmBox(d.v === 'neps' ? 'Piliers d\'origine ?' : 'Piliers du livret ?', d.v === 'neps' ? 'Noms et observables des piliers d\'origine.' : 'Placement du dos, trajet moteur, rythme, respiration, charge adaptée, rôle de coach, sécurité & hygiène (critères des grilles du livret). Les leçons déjà préparées gardent leurs piliers choisis.', 'Appliquer', true))) return;
    ROOT.piliers.forEach(p => { const q = d.v === 'neps' ? DEFAULT_PILIERS.find(x => x.id === p.id) : LV_PIL_LIVRET[p.id]; if (q) { p.n = q.n; p.ico = q.ico; p.cr = [...q.cr]; } }); save(); render(); toast('✓ Piliers mis à jour'); },
  lvReset: async d => { if (!(await confirmBox('Valeurs du livret ?', 'Cette rubrique reprend les valeurs proposées par le livret.', 'Rétablir', true))) return;
    const D = lvDefaults(); if (d.k === 'sv') { Object.assign(ROOT.lv, svDefaults()); } else if (d.k === 'wf') { ROOT.lv.wf = D.wf; } else if (d.k === 'table') { ROOT.lv.table = D.table; ROOT.lv.fce = D.fce; } else if (d.k === 'rmTxt') { ROOT.lv.rmTxt = D.rmTxt; ROOT.lv.resp = D.resp; ROOT.lv.bars = D.bars; } else if (d.k === 'tips') { ROOT.lv.tips = D.tips; ROOT.lv.thTips = D.thTips; } else ROOT.lv[d.k] = D[d.k];
    if (d.k === 'mc') lvInstallMachines(); lvBump(); render(); },
  lvMobTgl: d => { ROOT.mob = ROOT.mob || {}; ROOT.mob[d.m] = { ...(ROOT.mob[d.m] || {}), choice: !MOB[d.m].choice }; applyMobParams(ROOT.mob); lvBump(); rerender(); },
  lvZoneG: d => { const z = ROOT.lv.zones[+d.i]; ROOT.lv.zones.forEach(q => { q.g = q.g.filter(g => g !== d.g); }); if (!z.g.includes(d.g)) z.g.push(d.g); applyMobParams(ROOT.mob); lvBump(); rerender(); },
  lvCqAdd: () => { ROOT.lv.cq.push({ id:rnd(4), q:'Nouvelle question', w:'fin', on:true, th:[] }); lvBump(); rerender(); },
  lvCqDel: d => { ROOT.lv.cq.splice(+d.i, 1); lvBump(); rerender(); },
  lvCqTh: d => { const q = ROOT.lv.cq[+d.i]; q.th = q.th || []; q.th = q.th.includes(d.th) ? q.th.filter(x => x !== d.th) : [...q.th, d.th]; lvBump(); rerender(); },
  lvMcAdd: () => { ROOT.lv.mc.push({ id:'c_' + rnd(4), n:'Nouvel atelier', ico:'🏋️', g:'bras', k:'ch', mu:'', c:'' }); lvInstallMachines(); lvBump(); rerender(); },
  lvMcDel: async d => { const x = ROOT.lv.mc[+d.i]; if (!x || !(await confirmBox('Supprimer « ' + esc(x.n) + ' » ?', 'Les résultats déjà saisis sur cet atelier restent, mais il n\'est plus proposé.', 'Supprimer', true))) return; ROOT.lv.mc.splice(+d.i, 1); lvInstallMachines(); lvBump(); render(); },
  lvBankAdd: () => { WF().bank.push({ id:'b' + rnd(4), n:'Nouvel exercice', ico:'⭐', cat:'act', m:'t', v:30, zo:'all' }); lvBump(); rerender(); },
  lvBankDel: d => { WF().bank.splice(+d.i, 1); lvBump(); rerender(); },
  lvCatFx: d => { const c = WF().cats[+d.i]; c.fx = c.fx.includes(d.x) ? c.fx.filter(x => x !== d.x) : [...c.fx, d.x]; lvBump(); rerender(); },
  lvCqOnOff: d => { if (guardLock(+d.n)) return; const L = lesson(+d.n); L.cqOff = !L.cqOff; save(); rerender(); },
};
/* saisies (événement « change ») : renvoie true si le champ est traité ici */
function lvOnChange(t, d){
  const f = d.field; if (!f || !/^(lv|wfEv)/.test(f)) return false;
  const txt = () => t.value.trim();
  if (f === 'lvWf') { lvWfSave(F => { F[d.f] = txt(); }); flagSaved(); if (UI.view === 'wuEdit' && d.f === 'just') rerender(); return true; }
  if (f === 'lvWfX') { lvWfX(d.k, x => { x[d.f] = txt(); }); flagSaved(); if (d.f !== 'j' && d.f !== 'n') rerender(); return true; }
  if (f === 'lvWfM') { lvWfSave(F => { F.mat = F.mat || []; F.mat[+d.i] = txt(); }); flagSaved(); return true; }
  if (f === 'lvCq') { setRes(curLesson(), UI.sid, r => { r.cq = { ...(r.cq || {}), [d.q]: txt() }; }); flagSaved(); return true; }
  if (f === 'lvAn' || f === 'lvJu') { updE(d.e, E => { E[f === 'lvAn' ? 'an' : 'ju'] = txt(); }); flagSaved(); return true; }
  if (f === 'wfEv') { const L = lesson(curLesson()); L.wfEv = L.wfEv || {}; if (t.value) L.wfEv[d.sid] = { ...(L.wfEv[d.sid] || {}), d:+t.value }; else delete L.wfEv[d.sid]; save(); return true; }
  if (f === 'lvSet') { let v = t.value;
    if (d.t === 'num') { v = v === '' ? null : +String(v).replace(',', '.'); if (v != null && isNaN(v)) return toast('Valeur invalide'), true; }
    else if (d.t === 'lines') v = v.split('\n').map(x => x.trim()).filter(Boolean); else v = v.trim();
    lvSetP(d.p, v); if (/^(zones|mc)\./.test(d.p)) { lvInstallMachines(); applyMobParams(ROOT.mob); } toast('✓ Enregistré', 900); if (t.tagName === 'SELECT') rerender(); return true; }
  if (f === 'lvMc') { const x = ROOT.lv.mc[+d.i]; if (!x) return true; if (d.k === 'k') { x.k = t.value === 'ch' ? 'ch' : 'pdc'; x.u = t.value === 'pdcs' ? 's' : ''; } else x[d.k] = t.value; lvInstallMachines(); lvBump(); rerender(); return true; }
  if (f === 'lvTh') { ROOT.thN = ROOT.thN || {}; ROOT.thN[d.th] = { ...(ROOT.thN[d.th] || {}), [d.k]: txt() || LV_TH_ORIG[d.th][d.k] }; lvApplyThemes(); lvBump(); toast('✓ ' + THEMES[d.th].n, 900); return true; }
  if (f === 'lvThTip') { ROOT.lv.thTips[d.th] = ROOT.lv.thTips[d.th] || {}; ROOT.lv.thTips[d.th][d.k] = Math.max(0, Math.round(+t.value || 0)) - 1; lvBump(); toast('✓ Enregistré', 900); return true; }
  if (f === 'lvMob') { const M = MOB[d.m]; let v = t.value.trim();
    if (d.t === 'num') { v = Math.round(+v.replace(',', '.')); if (!v || v < 0) { toast('Valeur invalide'); rerender(); return true; } }
    else if (d.t === 'numnull') v = v === '' ? null : Math.round(+v.replace(',', '.'));
    else if (d.t === 'textnull') v = v || null;
    else if (d.t === 'list') v = v.split(/[,;]+/).map(x => x.trim()).filter(Boolean);
    else if (d.t === 'pcts') { v = v.split(/[;,\s]+/).map(x => Math.round(+x)).filter(x => x > 0 && x <= 100); if (!v.length) { toast('Indiquez au moins un %'); rerender(); return true; } }
    else if (d.t === 'z0' || d.t === 'z1') { const z = [...(M[d.z] || [null, null])], i = d.t === 'z0' ? 0 : 1; z[i] = v === '' ? null : Math.max(1, Math.min(5, Math.round(+v)));
      if (z[0] == null && z[1] == null) v = null; else { if (z[0] == null) z[0] = z[1]; if (z[1] == null) z[1] = z[0]; v = [Math.min(z[0], z[1]), Math.max(z[0], z[1])]; } }
    const key = d.t === 'z0' || d.t === 'z1' ? d.z : d.k;
    ROOT.mob = ROOT.mob || {}; ROOT.mob[d.m] = { ...(ROOT.mob[d.m] || {}), [key]: v }; applyMobParams(ROOT.mob); lvBump(); rerender(); toast('✓ ' + MOB[d.m].n, 900); return true; }
  return false;
}
