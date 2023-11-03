from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


schema_del = Blueprint('delSchema', __name__)

@schema_del.route('/database/<database_name>/schema/<schema_name>/delete', methods=['DELETE'])
def delete_schema(database_name, schema_name):
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
            check_query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(check_query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            if schema_name not in schemas:
                return jsonify({'error': f'Le schéma avec le nom "{schema_name}" n\'existe pas dans la base de données "{database_name}".'}), 404

            delete_query = f"DROP SCHEMA {schema_name}"
            cursor.execute(delete_query)

            # Récupérez la liste mise à jour des schémas après l'insertion
            query = f"SHOW SCHEMAS IN DATABASE {database_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            schemas = [row[1] for row in result]

            return jsonify({'status': 'success', 'message': f'Le schéma "{schema_name}" a été supprimé avec succès.','schemas': schemas})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

