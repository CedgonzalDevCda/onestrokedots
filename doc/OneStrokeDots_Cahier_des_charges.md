# Cahier des charges — OneStrokeDots

**Version du document :** 1.1 — **Date de référence :** 6 octobre 2026  
**Cible de sortie :** fin octobre 2026

## Table des matières

1. Présentation  
2. Technologies  
3. Structure des données  
4. Principe du gameplay  
5. Gestion du tracé  
6. Interface utilisateur  
7. Animations  
8. Progression  
9. Monétisation  
10. Architecture technique  
11. Découpage des features
12. Architecture interne du jeu  
13. Modélisation mathématique  
14. Moteur de niveau  
15. Système de tracé  
16. Vérification du niveau  
17. Génération des niveaux  
18. Solveur  
19. Prévention des exploits  
20. Détection robuste  
21. Optimisations mobiles  
22. Sauvegarde et persistance  
23. Analytics  
24. Conformité  
25. Risques  
26. Hypothèses et questions ouvertes  
27. Glossaire

---

## 1. Présentation

- **Nom :** OneStrokeDots.
- **Type :** jeu mobile de réflexion, puzzle de tracé en un trait.
- **Concept :** relier des points selon une solution contrainte, collecter éventuellement des étoiles et respecter les règles du niveau, sans repasser sur son propre tracé.
- **Objectif joueur :** terminer chaque niveau, débloquer la progression et viser le 100 % en collectant toutes les étoiles.
- **Périmètre produit :** application React Native mobile, campagne hors ligne au lancement, puis contenu communautaire et opérations live.

Le délai jusqu’à la fin octobre est très serré. Un MVP strict est recommandé **[HYPOTHÈSE À VALIDER]** : 
- cœur de jeu, 
- campagne, 
- progression, 
- tutoriel, 
- persistance, 
- consentements, 
- analytics minimaux,
- monétisation conforme
- QA de lancement avant les fonctions communautaires.

## 2. Technologies

## 2. Technologies utilisées

| Domaine | Choix | Règle |
|---|---|---|
| Front | React Native 0.81 + Expo SDK 54 (dev build) + TypeScript, expo-router | Expo Go exclu, aucun moteur 3D |
| Rendu / tracé | react-native-svg + Reanimated 4 + Gesture Handler | Skia retiré. Logique de collision isolée dans le Core, hors cycle React |
| Achats | RevenueCat (`react-native-purchases`) | Droit « no-ads », restauration des achats |
| Pubs | Google Mobile Ads + UMP / ATT | Consentement avant l'initialisation |
| Backend | Node.js + Express | Newsletter au lancement, publication de niveaux (admin), sauvegarde de progression, puis parrainage et Webstore |
| BDD locale | SQLite via expo-sqlite | Niveaux, profil, progression locale (source de jeu hors ligne) |
| BDD serveur | PostgreSQL | Newsletter, niveaux publiés par l'admin, sauvegardes de progression (snapshots), puis UGC et services futurs |
| Authentification | Firebase Auth (Google + Sign in with Apple) **[HYPOTHÈSE À VALIDER]** | Joueur anonyme (UUID local) puis liaison de compte pour changer de téléphone. Sign in with Apple obligatoire sur iOS si Google est proposé |
| Synchronisation | Révision de sauvegarde (`revision`) + identifiant d'appareil + date serveur **[HYPOTHÈSE À VALIDER]** | Comparaison local / serveur à la connexion, fusion automatique en cas de conflit, sauvegarde de secours avant écrasement |
| État | Zustand + TanStack Query **[HYPOTHÈSE À VALIDER]** | À ajouter, stores par feature, état serveur séparé |
| Analytics | Firebase Analytics + GA4 | Consentement (UMP) avant collecte. Crashlytics à confirmer |
| Mises à jour | expo-updates | Correctifs OTA, hors changements natifs |
| Tests | Jest + Testing Library (jest-expo) | Déjà en place |

## 3. Structure des données

### 3.1 World

`World` contient `schemaVersion`, un identifiant stable, un titre contrôlé, un ordre, ses niveaux et les conditions de déblocage. Le monde 1 est disponible par défaut.

### 3.2 Level

Un JSON de niveau contient au minimum `schemaVersion`, `id`, `worldId`, `points`, `stars`, `rules`, `bonuses` et des métadonnées de difficulté. La progression est locale au lancement ; une synchronisation serveur est reportée à une version ultérieure **[HYPOTHÈSE À VALIDER]**.

### 3.3 Point

`Point` contient `id`, position normalisée, `value` et éventuellement un rôle départ/arrivée. **`value` est le nombre de passages EXACT à effectuer, et non une borne supérieure.** La validation exige `visited[p] == value` pour tout point.

### 3.4 Star

`Star` contient un identifiant, une position et un état de collecte. Les étoiles sont optionnelles pour terminer un niveau, mais nécessaires pour obtenir « 100 % ».

### 3.5 Règles additionnelles

La liste `rules` peut déclarer : départ imposé, arrivée imposée, nombre minimal d’étoiles, étoiles numérotées à parcourir dans l’ordre, bonus ou contraintes spéciales. Les bonus sont des items ou des étoiles présents dans le niveau. Toute règle est data-driven et explicitement affichée.

### 3.6 Préférences de notifications

Le schéma de sauvegarde inclut `notificationPrefs`, objet versionné contenant `version`, `generalEnabled` et les valeurs par famille : `retention`, `reminder`, `behavioral`, `economic`, `social`, `editorial`. La valeur générale suspend l’émission sans effacer les choix par famille. La permission système n’est pas considérée comme une préférence synchronisée : elle est réévaluée sur chaque appareil.

## 4. Principe du gameplay

Le joueur démarre un tracé sur un point autorisé et relie les points en un seul geste. Les passages sont comptés exactement ; chaque arête/segment déjà utilisé est interdit. Le niveau est valide si tous les points atteignent exactement leur valeur, les contraintes additionnelles sont respectées et aucune arête n’est réutilisée. Les étoiles peuvent être collectées séparément pour atteindre 100 %.

## 5. Gestion du tracé

Le geste est capturé comme une suite de positions horodatées. Les positions sont normalisées dans la zone de jeu, filtrées sans supprimer les événements significatifs, puis converties en segments interpolés. Le moteur maintient le point courant, les arêtes utilisées, les compteurs `visited`, les étoiles collectées et les erreurs. La validation intervient à la fin du geste ou lorsque le graphe est complet ; un abandon réinitialise selon la règle UX choisie.

## 6. Interface utilisateur

| Écran / élément | Exigences |
|---|---|
| Accueil | Paramètres en haut à gauche ; Shop en haut à droite ; partager le jeu, parrainer un ami, Webstore, supprimer les pubs. Le Shop et le Webstore sont accessibles uniquement depuis l’accueil. |
| Sélection monde | Monde 1 disponible ; monde suivant par 100 % intégral ou dépense des items du Wallet. |
| Sélection niveau | Campagne et Niveaux téléchargés ; bannière autorisée ; états verrouillé, terminé, 100 %. |
| Écran de jeu | Zone de tracé, retour, reset, indices, résultat, étoiles et bonus. |
| Paramètres | Trois modes de pubs, consentements, audio/haptique, restauration des achats, suppression de compte, bloc Notifications : interrupteur général + bouton « Personnaliser » (écran des familles, un interrupteur chacune, mention « Bientôt disponible » pour les familles non livrées). |
| Shop | Packs d’indices/étoiles/monnaie et slots futurs ; accès accueil uniquement. |
| Wallet | Gold/items servant à débloquer des mondes et visualiser les soldes. |
| Tab bar | Quatre onglets : Accueil, Wallet, Niveaux, Éditeur. |
| Tutoriel | Guidé, skippable, sans pub, étapes persistées ; machine à états. |
| Consentements | UMP/ATT et RGPD avec choix lisible, sans case pré-cochée pour newsletter. |

**Sous-écran « Personnaliser les notifications » :** accessible depuis Paramètres via « Personnaliser » lorsque l’interrupteur général est activé ; il présente une ligne par famille de notifications, son interrupteur, son libellé et sa description. Les familles non livrées restent visibles, désactivées et portent la mention « Bientôt disponible ».

Au lancement, Daily reward, Défi quotidien, Parrainer un ami, Restaurer les achats, Éditeur et Webstore restent visibles, cliquables et marqués « En construction »/« Bientôt disponible » ; un message « Bientôt disponible » est affiché. Un fichier de feature flags pilote ces états, notamment `notif.retention`, `notif.reminder`, `notif.behavioral`, `notif.economic`, `notif.social` et `notif.editorial`. La restauration est toutefois obligatoire sur iOS dès qu’un non-consommable existe : activation au lancement recommandée **[HYPOTHÈSE À VALIDER]**.

## 7. Animations

**Existantes à préserver :** feedback de connexion, collecte d’étoile, validation, erreur et transitions d’écran si présents dans le prototype.  
**À ajouter :** animation d’apparition des points, surbrillance du chemin valide, vibration légère configurable, célébration de fin, progression de déblocage, états verrouillés et badge « Bientôt ». Les animations doivent respecter les préférences d’accessibilité et ne pas perturber le comptage.

## 8. Progression

Un niveau terminé sans toutes les étoiles est validé et débloque le suivant. Toutes les étoiles donnent « 100 % ». Le meilleur résultat en étoiles est mémorisé par niveau. Un monde est débloqué lorsque tous ses niveaux sont à 100 %, ou lorsque les items requis du Wallet sont dépensés. Les états sont `verrouillé`, `terminé`, `100 %`.

Le défi quotidien est distinct du Daily reward : il utilise un niveau standard et des règles spéciales, par exemple des étoiles numérotées de 1 à 10 à parcourir dans l’ordre sans croiser le trait. Les récompenses sont des items spéciaux et ne servent pas à générer des niveaux.

## 9. Monétisation

### 9.1 Pubs

- **Aucune :** achat « supprimer les pubs », prix localisé.
- **Normal :** bannière seule.
- **Agressif :** bannière + interstitiel après chaque troisième niveau gagné, et +25 % de récompense de fin de niveau ; mention visible et explicite, jamais de condition cachée.
- Bannière : sélecteur de niveaux, écran de jeu, écran de restauration/niveaux.
- Interstitiel : uniquement après un niveau accompli.
- Aucune pub dans tutoriel, éditeur et paramètres.
- Bouton « Supprimer les pubs » sur accueil et paramètres.

La conservation de pubs récompensées après l’achat no-ads est une option V1.2 **[HYPOTHÈSE À VALIDER]**, non retenue par défaut dans les trois modes.

### 9.2 Achats et indices

Le no-ads est un non-consommable. Le Shop propose des packs consommables d’indices, étoiles et monnaie. Le catalogue JSON est data-driven ; `localizedPrice` provient du store, jamais d’un prix codé en dur. La validation serveur et la vérification d’entitlements auprès du store sont recommandées **[HYPOTHÈSE À VALIDER]** ; le store est la source de vérité et la base locale un cache.

Les indices sont : (a) passer le niveau, le plus cher ; (b) révéler départ ou arrivée si non imposé ; (c) révéler 25 % des points du tracé solution. Quantités et prix restent à définir.

### 9.3 Économie provisoire

| Flux | Source / puits | Valeur initiale | Statut |
|---|---|---:|---|
| Gold de fin de niveau | Source | Base + bonus selon règles | **[HYPOTHÈSE À VALIDER]** |
| Bonus mode agressif | Source | +25 % | Décision produit à tester |
| Déblocage de monde | Puits | Coût par monde | **[HYPOTHÈSE À VALIDER]** |
| Parrainage | Source | Environ 10 gold | V1.1, **[HYPOTHÈSE À VALIDER]** |
| Indice passer | Puits | Le plus cher | **[HYPOTHÈSE À VALIDER]** |
| Slots publication | Puits | Environ 10 supplémentaires | V1.2, **[HYPOTHÈSE À VALIDER]** |

## 10. Architecture technique

Clean Architecture en quatre zones : **Presentation**, **Stores**, **Domain-Core pur**, **Data**. Zustand gère profil, orchestration et un store par feature : `useGameSession`, `useProgress`, `useWallet`, `useSettings`, `useAds`, `useTutorial`, `useConsent`, `useEntitlements`, `useAppBootstrap`. TanStack Query gère newsletter, prix IAP et plus tard Webstore. Les reducers du Core sont purs ; l’UI locale utilise `useState`.

Le tracé haute fréquence passe par shared values Skia/Reanimated ; les stores ne sont mis à jour qu’aux événements discrets. `useAppBootstrap.ready` doit être vrai avant de quitter le splash. Les transactions économiques sont atomiques, une transaction SQLite par use case, par exemple `completeLevel` applique étoiles, gold, bonus, compteur d’interstitiel et journal de transaction. Les sélecteurs sont fins, sans dépendance circulaire. Cette architecture est **[HYPOTHÈSE À VALIDER]** car l’existant du MVP n’est pas tranché.

Le backend Express expose des contrats versionnés pour newsletter, achats, parrainage et publication UGC. Aucun appel analytics n’est fait depuis un composant : les use cases appellent un service d’événements.
Le backend Express expose aussi un endpoint versionné de synchronisation des préférences de notifications (par exemple `PUT /v1/me/notification-preferences`) : préférences par famille, valeur générale, `version` et révision. Les mises à jour hors ligne sont mises en file côté client ; en conflit, la valeur la plus restrictive prévaut.

## 11. Découpage des features

### 11.1 Catalogue ordonné

| Ordre | ID | Feature | Version | Priorité MoSCoW | Taille | Dépendances | Statut Kanban |
|---:|---|---|---|---|---|---|---|
| 1 | F-01 | Moteur de gameplay et boucle de partie | V0.1 | Must | L | — | À faire |
| 2 | F-02 | Collision segment-cercle et gestion du tracé | V0.1 | Must | L | F-01 | À faire |
| 3 | F-03 | Validation des règles et prévention des exploits | V0.1 | Must | L | F-02 | À faire |
| 4 | F-04 | LevelLoader JSON et schéma versionné | V0.2 | Must | S | F-01 | À faire |
| 5 | F-05 | SQLite offline-first et profils locaux | V0.2 | Must | L | F-04 | À faire |
| 6 | F-06 | Sélection mondes et niveaux | V0.2 | Must | M | F-04 | À faire |
| 7 | F-07 | Progression, étoiles et déblocages | V0.3 | Must | L | F-05,F-06 | À faire |
| 8 | F-08 | Tutoriel guidé et skippable | V0.4 | Must | M | F-01,F-07 | À faire |
| 9 | F-09 | Sauvegarde, migrations et reprise | V0.5 | Must | L | F-05,F-07 | À faire |
| 10 | F-10 | State management et bootstrap | V0.5 | Must | L | F-05,F-09 | À faire |
| 11 | F-11 | Consentements et conformité RGPD | V0.6 | Must | M | F-08,F-10 | À faire |
| 12 | F-12 | Analytics, funnel et Crashlytics | V0.6 | Should | M | F-11,F-10 | À faire |
| 13 | F-13 | Wallet, catalogue Shop et monnaie | V0.7 | Must | M | F-07,F-09 | À faire |
| 14 | F-14 | IAP no-ads et restauration | V0.7 | Must | M | F-11,F-13 | À faire |
| 15 | F-15 | Indices et récompenses | V0.7 | Should | M | F-13,F-18 | À faire |
| 16 | F-16 | Pubs et trois modes | V0.8 | Must | L | F-11,F-14 | À faire |
| 17 | F-17 | Paramètres, accueil, navigation et UI | V0.8 | Must | L | F-06,F-16 | À faire |
| 18 | F-18 | Solveur interne et génération campagne | V0.8 | Should | L | F-03,F-04 | À faire |
| 19 | F-19 | Animations, juice et badges bientôt | V0.9 | Should | M | F-17,F-16 | À faire |
| 20 | F-20 | Newsletter et service de mailing | V0.9 | Should | M | F-11 | À faire |
| 21 | F-21 | MVP lancement stores | V1.0 | Must | XL | F-01 à F-20 | À faire |
| 22 | F-22 | Parrainage | V1.1 | Could | M | F-13,F-20 | À faire |
| 23 | F-23 | Daily reward et défi quotidien | V1.1 | Could | L | F-07,F-13 | À faire |
| 24 | F-24 | Éditeur local Preview | V1.2 | Could | XL | F-04,F-10 | À faire |
| 25 | F-25 | Webstore, modération et signalement | V1.2 | Could | XL | F-24,F-11 | À faire |
| 26 | F-26 | Slots de publication | V1.2 | Could | M | F-25,F-13 | À faire |
| 27 | F-27 | Live Ops et contenu distant | V1.3+ | Could | L | F-21,F-25 | À faire |
| 28 | F-28 | Écran de réglages des notifications | V1.1 | Could | L | F-09,F-11,F-12,F-17,F-23 | À faire |

### 11.2 Fiches d’acceptation

Format : **Given** (étant donné), **When** (quand), **Then** (alors). Les paramètres configurables sont explicités quand ils existent.

#### F-01 — Moteur de gameplay et boucle de partie

**Description :** Prototype cœur : chargement d’un niveau, saisie, validation et fin de partie.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-01_started`, `f-01_completed`, `f-01_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-02 — Collision segment-cercle et gestion du tracé

**Description :** Détection robuste, interpolation et comptage exact des passages.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-02_started`, `f-02_completed`, `f-02_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-03 — Validation des règles et prévention des exploits

**Description :** Règles additionnelles, anti-rejeu et garde-fous.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-03_started`, `f-03_completed`, `f-03_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-04 — LevelLoader JSON et schéma versionné

**Description :** Validation du JSON, schemaVersion et migrations de données.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-04_started`, `f-04_completed`, `f-04_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-05 — SQLite offline-first et profils locaux

**Description :** Persistance des niveaux, profils et progression locale.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-05_started`, `f-05_completed`, `f-05_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-06 — Sélection mondes et niveaux

**Description :** Navigation campagne/téléchargés et états verrouillé/terminé/100 %.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-06_started`, `f-06_completed`, `f-06_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-07 — Progression, étoiles et déblocages (fiche détaillée)

**Description :** Le résultat est écrit une seule fois par use case et conserve le meilleur nombre d’étoiles.  
**Given/When/Then :** Given un niveau terminé avec 0 à N étoiles, When le résultat est validé, Then le niveau est terminé, le suivant est débloqué et le statut 100 % n’est posé qu’avec toutes les étoiles.  
**Paramètres configurables :** Règles monde, coût en items, nombre d’étoiles, récompense de base.  
**Événements analytics :** level_completed, level_100, world_unlocked  
**Cas limites :** Rejeu, abandon, double tap, solde insuffisant, niveau déjà terminé.

#### F-08 — Tutoriel guidé et skippable (fiche détaillée)

**Description :** Le tutoriel enseigne la règle des passages, l’interdiction de repasser, départ/arrivée, étoiles et bonus.  
**Given/When/Then :** Given une première installation, When le joueur progresse ou passe le tutoriel, Then l’étape est persistée, aucune pub n’est affichée et le jeu reste jouable.  
**Paramètres configurables :** Étapes, skippable, textes, durée d’affichage, haptique.  
**Événements analytics :** tutorial_started, tutorial_step, tutorial_skipped, tutorial_completed  
**Cas limites :** Reprise après fermeture, consentement différé, changement de version.

#### F-09 — Sauvegarde, migrations et reprise (fiche détaillée)

**Description :** La progression est offline-first, versionnée et migrable.  
**Given/When/Then :** Given une base locale ancienne ou absente, When l’application démarre, Then les migrations sont atomiques, le splash attend ready et aucune progression valide n’est perdue.  
**Paramètres configurables :** schemaVersion, stratégie de conflit max par niveau, fréquence de sauvegarde, cloud au lancement ou V1.1, schéma `notificationPrefs` (général, familles, version).  
**Événements analytics :** save_started, migration_result, conflict_resolved  
**Cas limites :** Interruption pendant transaction, stockage plein, changement de téléphone, suppression de compte.

#### F-10 — State management et bootstrap (fiche détaillée)

**Description :** Les stores orchestrent sans contenir la logique de géométrie.  
**Given/When/Then :** Given un bootstrap en cours, When toutes les sources locales sont hydratées, Then ready passe à vrai et les écrans lisent des sélecteurs fins.  
**Paramètres configurables :** Stores, persistance, timeout, stratégie d’erreur.  
**Événements analytics :** bootstrap_started, bootstrap_ready, bootstrap_failed  
**Cas limites :** Erreur SQLite, cycle de store, état UI périmé.

#### F-11 — Consentements et conformité RGPD (fiche détaillée)

**Description :** Les finalités RGPD et ATT sont séparées et explicites. La finalité « notifications » est distincte de la newsletter, non pré-cochée, versionnée et révocable. Chaque bascule de préférence de notification laisse une trace horodatée avec la famille, la valeur et la version du consentement.  
**Given/When/Then :** Given un utilisateur non consentant, When une pub, analytics ou notification doit être lancé, Then le SDK/service est limité conformément au choix et aucun consentement newsletter ou notification n’est pré-coché.  
**Paramètres configurables :** UMP/ATT, régions, finalités newsletter et notifications séparées, version de consentement, rétention.  
**Événements analytics :** consent_shown, consent_updated, att_result, notification_consent_changed  
**Cas limites :** Refus, révocation, mode hors ligne, mineur, permission système révoquée.

#### F-12 — Analytics, funnel et Crashlytics (fiche détaillée)

**Description :** Les événements sont émis par les use cases et alimentent le funnel Installation → tutoriel → niveau 5 → niveau 20 → monde 2.  
**Given/When/Then :** Given le consentement requis, When une étape métier réussit, Then l’événement est envoyé avec paramètres minimisés et sans données personnelles inutiles.  
**Paramètres configurables :** Noms d’événements, KPI D1/D7, taux no-ads, % mode agressif, Crashlytics.  
**Événements analytics :** funnel_step, level_event, economy_event, ad_event, notif_pref_changed (famille, valeur, source : général ou famille), notif_settings_opened, notif_customize_opened  
**Cas limites :** Consentement refusé, doublons, perte réseau.

#### F-13 — Wallet, catalogue Shop et monnaie

**Impact notifications :** la famille Économique pourra signaler les offres du Shop et événements à durée limitée à partir de V1.2 ; désactivée par défaut et non livrée avant son flag.  


**Description :** Gold/items, catalogue data-driven et transactions atomiques.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-13_started`, `f-13_completed`, `f-13_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-14 — IAP no-ads et restauration

**Description :** Non-consommable, prix localisé, entitlement store et restauration.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-14_started`, `f-14_completed`, `f-14_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-15 — Indices et récompenses

**Description :** Trois niveaux d’indices, tarifs configurables et consommation sûre.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-15_started`, `f-15_completed`, `f-15_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-16 — Pubs et trois modes (fiche détaillée)

**Description :** Les trois modes de pubs respectent les emplacements et règles de fréquence.  
**Given/When/Then :** Given le mode sélectionné et un consentement valide, When le joueur finit un niveau, Then l’interstitiel n’apparaît qu’en mode agressif au bon compteur, jamais dans les écrans exclus.  
**Paramètres configurables :** Mode, fréquence 3 niveaux, +25 %, emplacement bannière, prix no-ads.  
**Événements analytics :** ad_impression, interstitial_shown, ad_mode_changed  
**Cas limites :** Achat no-ads, offline, fermeture avant affichage, fréquence incohérente.

#### F-17 — Paramètres, accueil, navigation et UI (fiche détaillée)

**Description :** La navigation expose quatre onglets et les boutons verrouillés restent explicites.  
**Given/When/Then :** Given une feature désactivée par flag, When le joueur la touche, Then un badge et le message « Bientôt disponible » sont affichés sans navigation cassée.  
**Paramètres configurables :** Feature flags, ordre des onglets, textes, deep links.  
**Événements analytics :** screen_view, locked_feature_clicked  
**Cas limites :** Flag absent, accès direct, restauration désactivée iOS.

#### F-18 — Solveur interne et génération campagne (fiche détaillée)

**Description :** Le solveur sert à la génération de campagne et à l’indice 25 %, jamais à valider l’UGC.  
**Given/When/Then :** Given un graphe candidate, When le solveur termine, Then il retourne une solution ou un échec borné et les niveaux UGC restent validés par leur créateur en Preview.  
**Paramètres configurables :** Limite de nœuds, timeout, profondeur, taux d’indice.  
**Événements analytics :** solver_run, solver_result, hint_used  
**Cas limites :** Graphe impossible, explosion combinatoire, solution multiple.

#### F-19 — Animations, juice et badges bientôt

**Description :** Animations Skia/Reanimated, feedback et feature flags.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-19_started`, `f-19_completed`, `f-19_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-20 — Newsletter et service de mailing

**Description :** Consentement séparé, désinscription et suppression.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-20_started`, `f-20_completed`, `f-20_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-21 — MVP lancement stores

**Description :** Qualité, conformité, QA et publication fin octobre 2026.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-21_started`, `f-21_completed`, `f-21_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-22 — Parrainage

**Impact notifications :** la famille Social pourra signaler les événements liés aux amis et à la communauté à partir de V1.3+ ; verrouillée tant que la feature n’est pas livrée.  


**Description :** Bonus par appareil après tutoriel du filleul.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-22_started`, `f-22_completed`, `f-22_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-23 — Daily reward et défi quotidien

**Impact notifications :** la famille Rappel couvre les récompenses et défis quotidiens, activée par défaut en V1.1 mais verrouillée tant que ces features sont « En construction ».  


**Description :** Deux features distinctes, règles spéciales et récompenses.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-23_started`, `f-23_completed`, `f-23_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-24 — Éditeur local Preview

**Description :** Création JSON, preview validée par créateur, statut Draft/Publiable.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-24_started`, `f-24_completed`, `f-24_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-25 — Webstore, modération et signalement

**Impact notifications :** la famille Social pourra signaler un niveau téléchargé ou noté à partir de V1.3+ ; la famille Économique couvrira les offres et événements limités selon disponibilité.  


**Description :** Publication, téléchargement, signalement, retrait et CGU.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-25_started`, `f-25_completed`, `f-25_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-26 — Slots de publication

**Description :** Limite quotidienne et slots supplémentaires achetables.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-26_started`, `f-26_completed`, `f-26_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-27 — Live Ops et contenu distant

**Impact notifications :** les familles Économique et Éditorial pourront relayer les événements, offres et nouveautés distants lorsqu’elles sont livrées ; activation volontaire pour les familles désactivées par défaut.  


**Description :** Événements, contenu et pilotage progressif.  
**Given/When/Then :** Given la dépendance disponible, When la feature est utilisée, Then le comportement décrit est observable, persistant si nécessaire et couvert par des tests.  
**Paramètres configurables :** catalogue, feature flags et règles de niveau selon le périmètre.  
**Événements analytics :** `f-27_started`, `f-27_completed`, `f-27_error`.  
**Cas limites :** absence réseau, reprise après fermeture, données invalides, double action et version antérieure.

#### F-28 — Écran de réglages des notifications

**Version :** V1.1 pour le socle de réglages et les familles Rétention/Rappel ; familles Comportemental et Économique en V1.2 ; Social et Éditorial en V1.3+ **[HYPOTHÈSE À VALIDER]**.  
**Taille :** L **[HYPOTHÈSE À VALIDER]**.  
**Dépendances :** F-09, F-11, F-12, F-17 et F-23.

**Description :** Le bloc Notifications de Paramètres permet d'activer ou désactiver toutes les notifications, puis de personnaliser les familles sans perdre les choix mémorisés. Le bouton « Personnaliser » reste visible dans tous les cas, mais est grisé et non cliquable lorsque le général est éteint.

**Bloc visuel :**

```text
NOTIFICATIONS
Activer les notifications [switch] (état : activées/désactivées)
[Personnaliser ›] (grisé tant que le général est éteint)
```

**Tableau des éléments :**

| Élément | Comportement |
|---|---|
| Interrupteur général | Active/désactive toutes les notifications d'un coup sans effacer les choix par famille. |
| Bouton « Personnaliser » | Ouvre l'écran de choix par famille, visible dans tous les cas, grisé et non cliquable si le général est éteint. |
| Ligne d'état de la permission | Apparaît seulement si la permission système est refusée : « Les notifications sont bloquées dans les réglages de votre téléphone » + bouton « Ouvrir les réglages système ». |

**Sous-écran « Personnaliser les notifications » :**

| Famille | Libellé joueur | Description affichée | Défaut | Disponibilité |
|---|---|---|---|---|
| Rétention | Rappels de retour | « On vous prévient quand vous n'avez pas joué depuis un moment » | Activé | V1.1 |
| Rappel | Récompenses et défis | « Daily reward et défi quotidien prêts » | Activé | V1.1 (verrouillé tant que ces features sont « En construction ») |
| Comportemental | Conseils et progression | « Un niveau à finir, un monde presque terminé, une série à ne pas perdre » | Activé | V1.2 |
| Économique | Offres et événements limités | « Offres du Shop et événements à durée limitée » | Désactivé | V1.2 |
| Social | Amis et communauté | « Un ami vous a rejoint, un niveau a été téléchargé ou noté » | Activé | V1.3+ (verrouillé) |
| Éditorial | Actualités | « Nouveaux mondes, nouveautés du jeu » | Désactivé | V1.3+ |

Économique et Éditorial sont désactivés par défaut car ce sont les familles les plus intrusives et à risque conformité ; leur activation est volontaire. Une famille dont la feature n'existe pas s'affiche désactivée avec « Bientôt disponible », conformément à la règle « En construction ». Message en bas : « Vous pouvez modifier ces choix à tout moment. »

**Règles de comportement :**

| Règle | Comportement |
|---|---|
| Hiérarchie | Le général prime ; s'il est éteint, aucune notification n'est émise. |
| Mémorisation | Éteindre le général conserve l'état des familles ; rallumer le restaure. |
| Premier allumage | Si la permission n'a jamais été demandée : écran d'explication puis demande système. |
| Permission refusée | L'interrupteur général reste modifiable côté jeu ; une ligne d'état prévient que rien ne sera reçu tant que la permission n'est pas accordée. |
| Effet immédiat | Chaque bascule annule/replanifie les notifications locales de la famille sans redémarrage. |
| Synchronisation serveur | Les choix sont transmis au backend par famille, avec la valeur pour les notifications distantes ; hors ligne, ils sont mis en file puis synchronisés. En conflit, la valeur la plus restrictive prévaut. |
| Sauvegarde | Les préférences sont incluses dans la sauvegarde cloud F-09 ; la permission système est redemandée après un changement de téléphone. |
| Consentement | Chaque bascule enregistre via F-11 une trace horodatée famille/valeur/version. |

**Given/When/Then :**

- **(a)** Given le général activé, When le joueur ouvre Paramètres, Then le bouton « Personnaliser » est actif.
- **(b)** Given le général éteint, When l'écran est affiché, Then le bouton est grisé et aucune notification n'est planifiée.
- **(c)** Given l'écran Personnaliser ouvert, When le joueur désactive la famille Rétention, Then les notifications locales sont annulées immédiatement et `notif_pref_changed` est émis.
- **(d)** Given le général éteint puis rallumé, When les paramètres sont relus, Then les choix par famille sont identiques à ceux d'avant l'extinction.
- **(e)** Given la permission système refusée, When le joueur allume le général, Then la ligne d'état avec le bouton vers les réglages système est affichée et aucune boîte de dialogue système répétée n'est présentée.
- **(f)** Given une famille non livrée, When l'écran est affiché, Then elle est désactivée avec « Bientôt disponible » et non modifiable.

**Paramètres configurables :** familles et défauts ; libellés et descriptions localisés ; flags de disponibilité `notif.retention`, `notif.reminder`, `notif.behavioral`, `notif.economic`, `notif.social`, `notif.editorial`.  
**Événements analytics :** `notif_pref_changed` (famille, valeur, source : général ou famille), `notif_settings_opened`, `notif_customize_opened`.  
**Cas limites :** permission révoquée depuis les réglages du téléphone alors que le général est allumé (état incohérent détecté au lancement et signalé), bascule hors ligne, double appui rapide (idempotence et dernier état conservé), changement de langue, restauration sur un nouvel appareil.  
**Domain :** use cases d'activation générale, de personnalisation par famille, de permission et de synchronisation ; hiérarchie générale/familles et règle de restriction.  
**Data :** store local versionné, notifications locales planifiées, endpoint de synchronisation serveur, file hors ligne et journal de consentement ; migration de `notificationPrefs`.  
**Presentation :** bloc Paramètres, écran d'explication et écran « Personnaliser les notifications », états activé/désactivé/verrouillé, accessibilité, libellés localisés et deep link vers les réglages système.

## 12. Architecture interne du jeu

- **GameEngine :** boucle de partie, événements discrets et reducer pur.
- **LevelLoader :** lecture JSON, validation de schéma et migrations.
- **PathManager :** capture, interpolation, arêtes utilisées et reset.
- **CollisionSystem :** segments interpolés, points et étoiles.
- **RuleValidator :** valeurs exactes, départ/arrivée, ordre et bonus.
- **AnimationSystem :** shared values, transitions et feedback sans logique métier.
- **HintSystem :** indices consommables et solution partielle produite par outil interne.

## 13. Modélisation mathématique

Un niveau est un graphe géométrique `G = (V, E)` : les points sont les sommets `V`, les segments autorisés sont les arêtes `E`, et chaque sommet `p` possède une demande entière `value(p)`. Le tracé est une suite d’arêtes distinctes. Une solution respecte `deg_traversée(p) = value(p)` pour chaque point, les contraintes de départ/arrivée et l’absence de réutilisation d’arête. Les étoiles sont des objets géométriques additionnels et ne modifient pas nécessairement les degrés.

## 14. Moteur de niveau

Le moteur charge un niveau versionné, vérifie les identifiants uniques, les positions normalisées, les valeurs positives, les règles compatibles et la présence des bonus. Il expose `start`, `appendPointerSample`, `commitSegment`, `collectStar`, `reset`, `validate` et `complete`. Les transitions sont déterministes et testables sans UI.

## 15. Système de tracé

Les points tactiles sont transformés dans le repère de la zone de jeu. Chaque paire de positions est interpolée si la distance dépasse le pas de sécurité. Le système rejette un segment déjà utilisé, signale une sortie de zone et conserve un historique minimal pour diagnostic. Un seuil de proximité par point doit être configurable et calibré sur appareils réels **[HYPOTHÈSE À VALIDER]**.

## 16. Vérification du niveau

La validation contrôle, dans l’ordre : intégrité du geste, départ et arrivée, arêtes non réutilisées, auto-intersections interdites, contraintes additionnelles, étoiles requises éventuelles, puis `visited[p] == value(p)` pour tous les points. Un niveau incomplet n’accorde aucune récompense finale ; une complétion est idempotente grâce au journal de transaction.

## 17. Génération des niveaux

La génération est un outil interne de contenu campagne. Elle crée des graphes planaires ou contrôlés, assigne des valeurs exactes, place des étoiles et vérifie plusieurs solutions/difficultés. Les paramètres de difficulté et de densité ne sont pas définitifs **[HYPOTHÈSE À VALIDER]**. Aucun solveur serveur ne valide les niveaux UGC.

## 18. Solveur

Le solveur interne explore les arêtes par DFS avec backtracking, choisit en priorité les sommets contraints, annule les choix invalides et borne le temps/nombre de nœuds. Il sert à la génération campagne et à l’indice révélant 25 % du tracé solution. Il est une feature V1.2+ **[HYPOTHÈSE À VALIDER]** pour les outils ; en UGC, le créateur est le solveur et doit valider en Preview.

## 19. Prévention des exploits

1. **Repassage vibrant :** filtrer les micro-oscillations et interdire une arête déjà engagée.
2. **Multi-points simultanés :** sérialiser les collisions selon le temps et la distance, un événement par transition.
3. **Traversée rapide :** interpoler les segments entre échantillons, sans dépendre de la fréquence tactile.
4. **Sortie de zone :** clamp visuel prudent et rejet métier des positions hors zone.
5. **Boucles artificielles :** détecter répétitions, retour sur arête et cycles non autorisés.
6. **Auto-intersections :** conserver les segments et interdire les croisements selon les règles du jeu.
7. **Modification des données locales :** vérifier schéma, checksum/signature si disponible, rejouer les transactions et ne jamais faire confiance au solde client pour un achat serveur.

## 20. Détection robuste

La détection doit travailler sur des segments interpolés. Pour un point `P` et un segment `[A,B]`, la distance projetée est :

```ts
export type Point = { x: number; y: number };

export function distancePointToSegment(
  p: Point,
  a: Point,
  b: Point,
): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;

  if (ab2 === 0) {
    return Math.hypot(apx, apy);
  }

  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));
  const closestX = a.x + t * abx;
  const closestY = a.y + t * aby;
  return Math.hypot(p.x - closestX, p.y - closestY);
}

export function segmentHitsCircle(
  start: Point,
  end: Point,
  center: Point,
  radius: number,
): boolean {
  return distancePointToSegment(center, start, end) <= radius;
}
```

Le rayon effectif peut combiner rayon visuel, tolérance tactile et densité d’écran. Les tests doivent couvrir segment dégénéré, tangence, passage rapide, points proches et coordonnées normalisées.

## 21. Optimisations mobiles

Objectif : 60 FPS sur appareils cibles. Le tracé haute fréquence doit rester dans Skia/Reanimated ; limiter les re-renders par sélecteurs fins. Pour les niveaux denses, utiliser un spatial hashing ou QuadTree pour filtrer les points candidats, puis appliquer la collision exacte uniquement aux candidats. Réduire allocations, logs et calculs de distance, profiler en mode release/dev build et dégrader proprement les animations.

## 22. Sauvegarde et persistance

SQLite est offline-first au lancement. Les tables versionnées couvrent profils, niveaux, résultats, Wallet, entitlements en cache, flags et journal des transactions. Chaque profil et chaque niveau portent `schemaVersion`. Une migration est atomique et idempotente. La sauvegarde cloud au lancement contre une V1.1 reste ouverte **[HYPOTHÈSE À VALIDER]** ; en cas de conflit, le meilleur résultat par niveau est conservé selon une règle documentée. La suppression de compte efface les données serveur et guide l’effacement local ; le changement de téléphone et la restauration d’achats sont des parcours dédiés.
Pour les notifications, le schéma contient `notificationPrefs: { version, generalEnabled, families: { retention, reminder, behavioral, economic, social, editorial } }`. La permission native reste propre à l’appareil et doit être redemandée sur un nouvel appareil. Le backend synchronise ces préférences via un endpoint versionné ; les écritures hors ligne sont rejouées avec la valeur la plus restrictive en cas de conflit.

## 23. Analytics

Plan minimal : installation, bootstrap, tutoriel, affichage/complétion de niveau, monde, étoiles, indices, Wallet, achats, pubs, newsletter, consentements, notifications et clics sur boutons verrouillés. Les événements notifications sont `notif_pref_changed` (famille, valeur, source : général ou famille), `notif_settings_opened` et `notif_customize_opened`. Funnel : Installation → tutoriel terminé → niveau 5 → niveau 20 → monde 2. KPI : D1, D7, conversion no-ads, part du mode agressif, taux d’échec et usage des indices. Firebase Analytics + Crashlytics sont proposés **[HYPOTHÈSE À VALIDER]** ; les événements respectent consentements, minimisation et rétention.

## 24. Conformité

- RGPD : finalités séparées, minimisation, droits d’accès/effacement, suppression de compte et politique de conservation.
- UMP/ATT : consentement présenté après le tutoriel selon les règles de plateforme et avant pub/mesure non nécessaire.
- Newsletter : consentement explicite, case non pré-cochée, stockage séparé, service serveur, lien de désinscription et suppression sur demande.
- Achats : prix localisés, restauration, vérification d’entitlements et reçu traité selon les règles du store.
- UGC : CGU, bouton Signaler, retrait back-office, absence de titre/description libres, limite de publications, politique de modération et obligations DSA/stores.
- Boutons inactifs : message clair « Bientôt disponible », sans simuler une fonction opérationnelle.

## 25. Risques

| Risque | Impact | Réponse |
|---|---|---|
| Délai fin octobre 2026 très serré | Élevé | MVP strict, gel du périmètre, QA quotidienne |
| Restauration no-ads obligatoire iOS | Élevé | Activer au lancement ou retirer l’achat ; décision à valider |
| Boutons inactifs et règles stores | Élevé | Message clair, flags, revue conformité |
| Inflation de l’économie | Moyen/élevé | Catalogue data-driven, journal, tests de sensibilité |
| Performance du tracé | Élevé | Skia/Reanimated, interpolation, spatial hashing, profiling |
| Hydratation asynchrone | Élevé | Splash jusqu’à `ready`, migrations atomiques |
| Double source de vérité achats | Élevé | Store autoritaire, entitlements vérifiés, cache local |
| Consentement avant pubs/analytics | Élevé | UMP/ATT avant activation et révocation testée |
| Modération UGC différée | Élevé | Hors lancement, signalement/retrait avant publication |
| Rejet store | Élevé | Checklists, restauration, suppression compte, CGU et tests reviewers |

## 26. Hypothèses et questions ouvertes

- Skia + Reanimated est-il confirmé pour le tracé ?
- L’architecture Clean/Zustand proposée correspond-elle à l’existant du MVP ?
- La restauration des achats sera-t-elle activée dès le lancement ?
- Le cloud save est-il lancement ou V1.1 ?
- Firebase Analytics/Crashlytics sont-ils autorisés après revue confidentialité ?
- Le nom `gold`, les coûts, packs, bonus et seuils d’économie doivent-ils être validés ?
- Les tolérances de collision et règles d’auto-intersection doivent-elles être calibrées par tests utilisateurs ?
- Les pubs récompensées après no-ads sont-elles retenues en V1.2 ?
- Daily reward et Défi quotidien restent-ils hors lancement ?
- Le périmètre éditeur/Webstore/modération est-il bien V1.2+ ?

## 27. Glossaire

| Terme | Définition |
|---|---|
| 100 % | Niveau terminé avec toutes les étoiles. |
| Arête | Segment entre deux points, utilisable au plus une fois dans un tracé. |
| Dev build | Build Expo de développement installable, distinct d’Expo Go. |
| Entitlement | Droit d’usage confirmé par le store, notamment no-ads. |
| Feature flag | Paramètre activant ou verrouillant une fonctionnalité. |
| Gold | Nom provisoire de la monnaie virtuelle **[HYPOTHÈSE À VALIDER]**. |
| MVP | Version minimale nécessaire au lancement. |
| Preview | Mode de test de l’éditeur où le créateur valide son propre niveau. |
| SchemaVersion | Version de structure utilisée pour migrations et compatibilité. |
| UGC | Contenu généré par les utilisateurs. |
| Wallet | Inventaire de monnaie et items du joueur. |
