from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/api-Python', methods=['POST'])
def process_data():
    # Récupérer les données envoyées depuis le serveur Node.js
    data = request.json
    nom_produit = data.get('nom_produit')
    prix_total = data.get('prix_total')

    print(nom_produit)
    print(prix_total)

    liste_noms_clients = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"]
    nom_client = random.choice(liste_noms_clients)

    numero_carte_credit = ''.join(random.choice('0123456789') for _ in range(16))

    response = {
        'nom_produit': nom_produit,
        'prix_total': prix_total,
        'nom_client': nom_client,
        'numero_carte_credit': numero_carte_credit
    }

    print(response)


    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
