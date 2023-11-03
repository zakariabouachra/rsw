from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


schema_update = Blueprint('updateSchema', __name__)


@schema_update.route('/database/<database_name>/schema/<schema_name>/edit', methods=['PUT'])
def update_schema(database_name, schema_name):
    try:
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
            data = request.json
            new_schema_name = data['newSchemaName']

            if not new_schema_name:
                return jsonify({'error': 'Le nouveau nom du schéma ne peut pas être vide.'}), 400

            check_query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(check_query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            if new_schema_name in schemas:
                return jsonify({'error': f'Le schéma avec le nom "{new_schema_name}" existe déjà dans la base de données "{database_name}".'}), 400

            update_query = f"ALTER SCHEMA {schema_name} RENAME TO {new_schema_name}"
            cursor.execute(update_query)

            # Récupérez la liste mise à jour des schémas après l'insertion
            query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            return jsonify({'status': 'success', 'message': f'Le nom du schéma a été mis à jour avec succès.','schemas': schemas})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

