from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.errors import PyMongoError

app = Flask(__name__)

# Connexion à la base de données MongoDB
try:
    client = MongoClient('mongodb+srv://zackDB:2311@cluster0.uzwuxhn.mongodb.net')
    db = client['RSW']
    users_collection = db['users']
except PyMongoError as e:
    print(f"Erreur de connexion à la base de données MongoDB : {e}")

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        user = users_collection.find_one({'email': email, 'password': password})

        if user:
            response = {
                'message': 'Connexion réussie',
                'id': str(user['_id']),
                'user_nom': user['nom'],
                'user_email': user['email']
            }
            return jsonify(response), 200
        else:
            response = {
                'error': 'Authentification échouée',
                'message': 'Les identifiants fournis sont incorrects. Veuillez vérifier votre email et mot de passe.'
            }
            return jsonify(response), 200

    except PyMongoError as e:
        print(f"Erreur lors de l'accès à la base de données : {e}")
        response = {
            'message': 'Erreur interne du serveur'
        }
        return jsonify(response), 500


if __name__ == '__main__':
    app.run(debug=True)
