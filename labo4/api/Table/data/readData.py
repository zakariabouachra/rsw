from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


data_read = Blueprint('readData', __name__)



@data_read.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/data', methods=['GET'])
def get_table_data(database_name, schema_name, table_name):
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
        query = f"SELECT * FROM {schema_name}.{table_name}"
        cursor.execute(query)
        result = cursor.fetchall()
        # Convertir les résultats en une liste de dictionnaires pour la réponse JSON
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]
        return jsonify({'data': data})
    finally:
        cursor.close()
        connection.close()

