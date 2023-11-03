from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


schema_insert = Blueprint('insertSchema', __name__)

@schema_insert.route('/schemas/insert', methods=['POST'])
def insert_schema():
    try:
        data = request.json
        schema_name = data['schemaName']
        database_name = data['databaseName'] 

        if not schema_name or not database_name:
            return jsonify({'error': 'Le nom du schéma et de la base de données sont requis.'}), 400

        user_info = get_global_user_info()
    
        account = user_info.get('account')
        user = user_info.get('user')
        password = user_info.get('password')

        snowflake_config = {
            'account': account,
            'user': user,
            'password': password,
            'database': database_name  
        }

        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        try:
            # Récupérez la liste des schémas dans la base de données spécifiée
            query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            # Vérifiez si le schéma existe déjà dans la liste des schémas
            if schema_name in schemas:
                return jsonify({'error': f'Le schéma avec le nom "{schema_name}" existe déjà dans la base de données "{database_name}".'}), 400

            # Si le schéma n'existe pas, exécutez la requête d'insertion
            insert_query = f"CREATE SCHEMA {database_name}.{schema_name}"
            cursor.execute(insert_query)

            # Récupérez la liste mise à jour des schémas après l'insertion
            query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            return jsonify({'status': 'success', 'schemas': schemas,'message': f'Le schéma a été ajoute avec succès.'})
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        return jsonify({'error': str(e)}), 500

