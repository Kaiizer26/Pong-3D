Projet ThreeJS 2024 - Jeu Pong 3D
Objectif du Projet
Le but de ce projet était de réaliser un jeu Pong en 3D en utilisant la bibliothèque Three.js. Le jeu est destiné à être joué à deux joueurs, avec un système de calcul de score. Le jeu s'arrête lorsqu'un joueur atteint un score défini.

Fonctionnalités Implémentées
1. Environnement 3D
Scène 3D : Une scène a été créée avec un plan pour le sol et les murs, offrant un environnement de jeu simple pour les deux joueurs.
Modèles 3D : Les raquettes et la balle sont représentées par des objets 3D dans la scène. La balle utilise un modèle importé via GLTF.
Matériaux : Les raquettes et le sol sont matérialisés avec des matériaux adaptés à la scène.
Lumières : Une lumière directionnelle et une lumière ambiante ont été ajoutées à la scène pour éclairer les objets.
Ombres : Les ombres sont activées pour les objets afin de renforcer le réalisme visuel.
2. Joueurs
Raquettes : Chaque joueur dispose d'une raquette modélisée en 3D, contrôlable à l'aide du clavier.
Rendu Séparé : La scène est rendue sur deux caméras distinctes, chaque caméra étant dédiée à un joueur, offrant une vue à la première personne pour chaque joueur.
3. Balle
Déplacement Automatique : La balle se déplace automatiquement sur l'axe Z et rebondit selon les collisions avec les murs et les raquettes.
Collision avec les Raquettes et Murs : La balle change de direction correctement lorsqu'elle entre en contact avec les raquettes ou les murs, avec un calcul précis de la vitesse après chaque collision.
4. Contrôles
Déplacement des Raquettes : Les touches du clavier sont utilisées pour déplacer les raquettes des deux joueurs. Le joueur humain utilise les touches Q et S, tandis que le joueur CPU utilise M et L.
5. Score
Calcul du Score : Le score est calculé pour chaque joueur et est mis à jour à chaque fois qu'un joueur marque un point en envoyant la balle dans le but de l'adversaire.
6. Fin de Partie
Détection de Fin de Partie : Le jeu se termine lorsqu'un joueur atteint un score de 3. Un message de victoire s'affiche et un bouton permet de recommencer la partie.
7. Rejouabilité
Un bouton "Restart Game" est disponible pour redémarrer la partie après qu'un joueur ait gagné. La position de la balle et le score sont réinitialisés à zéro.
Fonctionnalités Non Implémentées
1. Bonus / Malus
Bien que des bonus et malus aient été prévus dans la conception, cette fonctionnalité n'a pas encore été ajoutée dans le projet. Aucun changement de vitesse de balle, d'inversion des contrôles ou de réduction de visibilité n'est actuellement implémenté.

Critères d’Évaluation
Fonctionnalités Implémentées :
Environnement (?/4) :sol, murs, matériaux, lumières et ombres.
Joueurs (?/3): Deux raquettes, rendus avec une seule caméra.
Balle (?/3) : Modèle 3D, déplacement automatique, changements de direction suite aux collisions.
Collisions (?/2) : Collision avec les murs et les raquettes.
Contrôles (?/2) : Contrôles au clavier pour déplacer les raquettes, A-Z ou O-P.
Score (?/1) : Calcul du score et mise à jour en temps réel.
Fin de Partie / Rejouabilité (?/2) : Fin de partie avec détection de gagnant et bouton pour recommencer.
Code :
Architecture (?/1) : Structure du code respectant les bonnes pratiques.
Classes (?/1) : Les principales fonctionnalités sont bien organisées, mais l'architecture n'inclut pas de classes à proprement parler pour ce projet.
Commentaires (?/1) : Code commenté pour une meilleure compréhension.
Bonus :
Bonus / Malus (?/1) : Cette fonctionnalité n'a pas été implémentée dans la version actuelle.