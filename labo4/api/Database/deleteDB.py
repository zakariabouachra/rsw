from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


database_del = Blueprint('delDB', __name__)

    
@database_del.route('/database/<database_name>/delete', methods=['DELETE'])
def delete_database(database_name):
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
            check_query = f"SHOW DATABASES LIKE '{database_name}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is None:
                return jsonify({'error': f'La base de données avec le nom "{database_name}" n\'existe pas.'}), 404

            delete_query = f"DROP DATABASE {database_name}"
            cursor.execute(delete_query)

            # Vous pouvez également valider la transaction et la terminer ici si nécessaire

            query = "SHOW DATABASES"
            cursor.execute(query)
            result = cursor.fetchall()
            databases = [row[1] for row in result]

            return jsonify({'status': 'success', 'message': f'La base de données "{database_name}" a été supprimée avec succès.','databases': databases})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
