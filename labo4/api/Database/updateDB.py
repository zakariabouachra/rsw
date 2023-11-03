from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


database_update = Blueprint('updateDB', __name__)


@database_update.route('/database/<database_name>/edit', methods=['PUT'])
def edit_database(database_name):
    try:
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
            data = request.json
            new_database_name = data['newDatabaseName']

            if not new_database_name:
                return jsonify({'error': 'Le nouveau nom de la base de données ne peut pas être vide.'}), 400

            check_query = f"SHOW DATABASES LIKE '{new_database_name}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is not None:
                return jsonify({'error': f'La base de données avec le nom "{new_database_name}" existe déjà.'}), 400

            update_query = f"ALTER DATABASE {database_name} RENAME TO {new_database_name}"
            cursor.execute(update_query)

            query = "SHOW DATABASES"
            cursor.execute(query)
            result = cursor.fetchall()
            databases = [row[1] for row in result]

            return jsonify({'status': 'success', 'message': f'Le nom de la base de données a été mis à jour avec succès.', 'databases': databases})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

