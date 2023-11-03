from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


column_read = Blueprint('ReadColumn', __name__)


@column_read.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/columns', methods=['GET'])
def get_table_columns(database_name, schema_name, table_name):
    user_info = get_global_user_info()
        
    account = user_info.get('account')
    user = user_info.get('user')
    password = user_info.get('password')

    snowflake_config = {
        'account': account,
        'user': user,
        'password': password,
        'database': database_name,
        'schema': schema_name
    }

    connection = snowflake.connector.connect(**snowflake_config)
    cursor = connection.cursor()

    try:
        query = f"SELECT COLUMN_NAME, DATA_TYPE, IS_IDENTITY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'"
        cursor.execute(query)
        result = cursor.fetchall()

        # Créer une liste de dictionnaires contenant le nom, le type de données, la précision numérique et l'échelle numérique de chaque colonne
        columns = [{'name': row[0], 'data_type': row[1], 'autoIncrement': row[2]} for row in result]
        return jsonify({'columns': columns})
    finally:
        cursor.close()
        connection.close()

