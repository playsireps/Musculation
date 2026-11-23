# Musculation – N'EPS numérique (CA5)

PWA de suivi des séances de musculation — Emilie BIDAULT et Quentin DELISLE. Même principe que l'appli Biathlon :
tablette enseignant ↔ tablettes élèves par QR codes, hors-ligne, données sur chaque appareil.

## Mise en ligne
Publier ce dossier sur GitHub Pages (HTTPS obligatoire pour la caméra). iPad : Safari → Partager → « Sur l'écran d'accueil ».
Mise à jour : changer `CACHE` dans `sw.js` pour forcer le rechargement des tablettes.

## Déroulement
1. **Préparer le cycle** (code 0000) : élèves (import Pronote), groupes (= tablettes), leçons (thème, 1 ou 2 piliers, suivi série ou exercice, échauffement), observables des piliers, machines de la salle, rôles « Coach d'un jour ».
2. **Leçon du jour** : appel (absent / dispensé / inaptitude partielle avec zones du corps, forme et motivation 1→10), machines HS, tirage des rôles, puis **📲 QR de la leçon**.
3. Tablettes élèves : **📷 Scanner la leçon** → l'observateur choisit l'élève, l'exercice, puis saisit les répétitions validées et les piliers sur la roue crantée (1 → 10).
4. Fin de leçon : **📤 Envoyer mes saisies** ; l'enseignant **📥 Récupérer les saisies** (tablettes élèves et Hippopogramme).
5. **Suivi et bilans** : fiches élèves (PDF), max de la classe, bilan par leçon, notes des évaluations, coach d'un jour, export Excel.

## Calculs
- Brzycki : 1RM = charge ÷ (1,0278 − 0,0278 × répétitions), de 2 à 15 répétitions.
- Pompes, tractions, dips, abdos, chaise romaine : max = nombre de répétitions ; répétitions de séance = % de ce max.
- Charge proposée par zone de 5 kg : 32 kg → « entre 30 et 35 kg ».
- Volume 4×10 à 75 % (en forme) ou 70 % · Puissance 6×6 à 80 % ou 6×4 à 90 % · Tonification 5×15 à 60 % · Affinement 5×20 à 50 % (+ 6 min cardio / endurance entre les exercices).

## Hippopogramme
Dans Hippopogramme : **📲 QR Musculation** ; dans Musculation : 📥 Récupérer les saisies, puis associer chaque nom à un élève.

## Version 2.0 — Livret d'entraînement EPPCS & échauffement
Tout ce qui vient du livret est un paramètre modifiable (🛠 Préparer la structure) et part sur les tablettes avec le QR de la leçon (seules les différences avec le livret sont transmises : le QR reste court).
- **🎯 Thèmes d'entraînement** : préréglage « Livret EPPCS » (Puissance, Gain de volume, Tonification entretien / affinement) ou « N'EPS d'origine ». Fourchettes de séries, répétitions, récupération, % de la RM, rythme, chasuble, objectif, sensations et zones recherchées, règle « 2 ateliers par zone du corps ». L'élève choisit ses paramètres dans les fourchettes, avec alerte de cohérence.
- **🗣️ Ressentis du livret** : effort / cardio-pulmonaire / musculaire (1 à 5), zones recherchées par thème, hypothèses de régulation si la sensation arrive trop tôt. Borg, livret ou les deux.
- **📒 Carnet** : points d'attention et conseils du jour par leçon, questions (mobile, sensations, retour au calme, bilan), analyse et justification par atelier, consignes et muscle principal de chaque machine, ateliers petit matériel du livret, protocole RM, rappel des barres.
- **🔥 Échauffement (fiche)** : l'élève prépare sa fiche sur le modèle du livret (objectif, matériel, exercices en temps ou répétitions, séries, récupérations, justifications, bilan) ; durée estimée, effets, variété, zones préparées pour la séance, degré indicatif 1→4 ; chrono guidé ; impression de la fiche ; contraintes par leçon ; vue enseignant avec degré retenu.
- **Outils** : table des charges (% de la RM, imprimable), calcul de la FCE, protocole en musculation, piliers du livret.

## Version 2.1 — fonctions reprises du CA1 Demi-fond, avec et sans matériel
- **🏁 Évaluation de fin de cycle** (Suivi et bilans) : grille personnalisable à 4 degrés (modèles : livret EPPCS détaillé, lycée CA5 AFL1/2/3, collège cycle 4), fourchette de points par degré, répartition AFL2 / AFL3 au choix de l'élève (4/4, 6/2, 2/6), degrés suggérés d'après les données de l'appli, appréciation proposée et modifiable, fiches familles recto-verso à imprimer, notes en CSV.
- **🪞 Auto-évaluation** de l'élève sur sa tablette (leçons d'évaluation ou toutes), comparée à l'évaluation de l'enseignant.
- **⚡ Groupes automatiques** (hasard, thème, équilibrés, de niveau, selon un besoin) et **👥 binômes d'observation** envoyés avec le QR.
- **⏱️ Minuteur** de circuit training et de gainage (Tabata, 45/15…) avec sifflet, bips et annonce vocale ; il sert aussi au chrono de l'échauffement.
- **😓 Petite forme du jour** : charges à −10 % (réglable), à l'appel ou sur la tablette.
- **🤸 Avec et sans matériel** : ateliers au poids de corps avec 4 niveaux de difficulté (la difficulté remplace la charge), méthodes d'entraînement (séries simples, circuit, superset agoniste/antagoniste, pyramide…), filtre « sans matériel uniquement ».
- **🖨 Fiches à imprimer** : fiches ateliers à afficher en salle, fiche du cycle, binômes.
- **📲 Installer l'appli** depuis l'accueil (Android / Chrome).

## Version 2.2 — ressources théoriques, accès enseignant en haut à droite
- **👩‍🏫 Bouton « Enseignant »** en haut à droite sur tous les écrans (code demandé) ; 🔒 pour verrouiller.
- **📚 Connaissances** (tablettes et enseignant) : savoirs à construire (N. Terré), PA2RIS (Dossier EP&S n°89), relation actions–muscles et exercices segmentaires / articulaires (Dossier EP&S n°79), répertoire d'exercices par muscle (fiche « choisir un exercice pour ses effets »), quiz « muscles fléchés ».
- **Fiche « connaître l'atelier »** (carnet 3e) : muscle, action, étirement, précautions, zones à risque, vie quotidienne ; « Mes possibilités » (charges pour 15 / 20 / 25 répétitions).
- **⚖️ Charge de référence par le ressenti** (au choix par thème, à la place du % de la RM), formule d'estimation de la RM au choix (Brzycki, Epley, Lander, table).
- **🧭 Nature et intensité des sensations → décision** (fiche des thèmes), méthodes conseillées par thème (bulgare, transposition, contraste, série brûlante, récupération active) et ordre des exercices.
- **👤 Profils d'élèves** (performeur insensible, indifférent hyper-sensible, sportif applicateur) avec conseil personnalisé sur la tablette.
- **Évaluation** : modèles « exemple national » (unités de 40 s) et « niveaux du Dossier EP&S n°79 », repères de progressivité 2nde → Terminale ; minuteur en unités de 40 s ; aléas du jour.

## Version 2.3 — espace enseignant en 8 étapes (ergonomie de l'appli Demi-fond)
1. 🛠 **Préparer le cycle** : classes & élèves · groupes & binômes · structure des leçons · salle & ateliers (avec / sans matériel, ateliers ajoutés, niveaux) · fiches des ateliers · rôles coach d'un jour
2. 🎯 **Thèmes & charges** : thèmes d'entraînement (+ noms des thèmes, zones du corps) · charges & RM (formule, charge de référence, petite forme, protocole RM, table des charges, FCE) · méthodes & matériel · ressentis (échelles, nature et intensité)
3. 🔥 **Échauffement** : fiche modèle et banque d'exercices
4. 📒 **Carnet & connaissances** : carnet de l'élève (questions, analyse, conseils, aléas) · connaissances · profils d'élèves · fiches & outils (+ protocole)
5. 🧰 **Leçon du jour** : outils · modifier la leçon · appel · échauffements · bilan final · coach · évaluer · saisie
6. 📲 **Tablettes élèves** : QR de la leçon · récupérer les saisies
7. 🧭 **Piliers & évaluation** : modèles de piliers + piliers & observables · notes des évaluations · évaluation de fin de cycle · coach d'un jour
8. 📊 **Suivi et bilans** : suivi élève · max de la classe · bilan par leçon · export & sauvegarde

Chaque page rappelle son étape, propose ← Menu enseignant et les étapes voisines (‹ précédente / suivante ›).

## v3.0 – Interface sur le modèle de l'application Demi-fond
- **Accueil enseignant** comme Demi-fond : logo, choix de la classe, carte de la leçon du jour, 3 grandes tuiles (Leçon du jour · Résultats · Enseignant) et raccourcis (QR, Récupérer, Fiches PDF, Minuteur).
- **Barre du haut** : « Enregistré sur cet appareil », ⌂ Accueil / ☰ Menu / 🔒 selon la page ; élève : 👩‍🏫 Mode enseignant (code).
- **Panneau fixe à droite** (en bas sur tablette en portrait) : montre-chrono de récupération (30'' → 3', ⏱️ Minuteur), leçon du jour, présents, fiches reçues, groupes, boutons Appel · QR · Récupérer · Saisie. Réductible (▾).
- **Menu enseignant en 8 grandes étapes (2 colonnes)**, ordre Demi-fond : 1 Préparer le cycle · 2 Piliers & maîtrise · 3 Projet d'entraînement · 4 Leçon du jour · 5 Échauffement & minuteur · 6 Carnet & connaissances · 7 Résultats et bilans · 8 Tablettes élèves.
- Nouvelles pages : 🔔 Signaux sonores, 📈 Table % RM (imprimable), ⏱️ Minuteur dans le menu.
- Toutes les fonctionnalités et tous les paramètres de la v2.3 sont conservés.
