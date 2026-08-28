## Base de données

Un fichier docker-compose.yml est fourni pour lancer PostgreSQL en conteneur (comme demandé) :
    docker compose up -d

Remarque : lors du développement, Docker n'était pas fonctionnel sur la machine de
l'auteur. Une installation locale de PostgreSQL a donc été utilisée à la place,
avec la même structure de base (schema.sql). Les deux méthodes utilisent le même
schéma et sont interchangeables.