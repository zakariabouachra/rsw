from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


table_del = Blueprint('deltable', __name__)

@table_del.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/delete', methods=['DELETE'])
def delete_table(database_name, schema_name, table_name):
    try:
        if not table_name:
            return jsonify({'error': 'Le nom de la table ne peut pas être vide.'}), 400

        user_info = get_global_user_info()
            
        account = user_info.get('account')
        user = user_info.get('user')
        password = user_info.get('password')

        snowflake_config = {
            'account': account,
            'user': user,
            'password': password,
            'database': database_name,
            'schema': schema_name,
        }

        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        try:
            
            check_query = f"SHOW TABLES IN SCHEMA {schema_name}"
            cursor.execute(check_query)
            result = cursor.fetchall()
            tables = [row[1] for row in result]

            if table_name not in tables:
                return jsonify({'error': f'Le table avec le nom "{table_name}" n\'existe pas dans le schemas "{schema_name}".'}), 404

            delete_query = f"DROP TABLE {schema_name}.{table_name}"
            cursor.execute(delete_query)

            query = f"SHOW TABLES IN SCHEMA {schema_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            tables = [row[1] for row in result]

            return jsonify({'status': 'success', 'tables': tables})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500


