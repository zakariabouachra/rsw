from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
from flask import Flask, jsonify, request
import snowflake.connector
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={f"/login": {"origins": "http://localhost:3000"}})
app.config['JWT_SECRET_KEY'] = 'lilopipo09@' 
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    try:
        # Récupérer les données d'authentification envoyées depuis Axios
        data = request.json
        account = data['account']
        user = data['user']
        password = data['password']

        # Configuration de Snowflake
        snowflake_config = {
            'account': account,
            'user': user,
            'password': password
        }

        # Connexion à Snowflake
        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        # Fermez la connexion
        cursor.close()
        connection.close()

        access_token = create_access_token(identity={'user': user,'account': account})
        print(access_token)

        # Si la connexion réussit, retournez un succès
        return jsonify({'status': 'success', 'token': access_token})

    except Exception as e:
        # En cas d'erreur, retournez un message d'erreur
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
