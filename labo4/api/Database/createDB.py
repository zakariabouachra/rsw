from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


database_insert = Blueprint('insertDB', __name__)


@database_insert.route('/databases/insert', methods=['POST'])
def insert_database():
    try:
        # Récupérez les données du corps de la requête POST
        data = request.json
        database_name = data['databaseName']

        if not database_name:
            return jsonify({'error': 'Le nom de la base de données ne peut pas être vide.'}), 400

        user_info = get_global_user_info()
    
        account = user_info.get('account')
        user = user_info.get('user')
        password = user_info.get('password')

        snowflake_config = {
            'account': account,
            'user': user,
            'password': password
        }

        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        try:
            # Vérifiez si la base de données existe déjà
            check_query = f"SHOW DATABASES LIKE '{database_name}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is not None:
                return jsonify({'error': f'La base de données avec le nom "{database_name}" existe déjà.'}), 400

            # Si la base de données n'existe pas, exécutez la requête d'insertion
            insert_query = f"CREATE DATABASE {database_name}"
            cursor.execute(insert_query)

            # Récupérez la liste mise à jour des bases de données après l'insertion
            query = "SHOW DATABASES"
            cursor.execute(query)
            result = cursor.fetchall()
            databases = [row[1] for row in result]

            return jsonify({'status': 'success', 'databases': databases})
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

