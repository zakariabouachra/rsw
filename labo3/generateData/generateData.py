import csv
from faker import Faker
import random

fake = Faker()

# Créer une liste de noms, âges, genres, professions et salaires fictifs
ages = [random.randint(20, 60) for _ in range(1000)]
genres = ["Homme", "Femme"]
professions = ["Ingenieur", "Enseignant", "Medecin", "Artiste", "Vendeur"]
salaires = [random.randint(30000, 100000) for _ in range(1000)]

# Créer une liste de dictionnaires contenant les données
donnees = []

for _ in range(1000):
    donnee = {
        "name": fake.name(),
        "age": random.choice(ages),
        "gender": random.choice(genres),
        "profession": random.choice(professions),
        "salary": random.choice(salaires)
    }
    donnees.append(donnee)

# Écrire les données dans un fichier CSV
with open("donnees_clients.csv", mode="w", newline="") as fichier_csv:
    champs = ["name", "age", "gender", "profession", "salary"]
    writer = csv.DictWriter(fichier_csv, fieldnames=champs)

    writer.writeheader()
    for donnee in donnees:
        writer.writerow(donnee)

print("Données générées et enregistrées dans donnees_clients.csv")
