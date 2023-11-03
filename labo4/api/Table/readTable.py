from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


table_read = Blueprint('readtable', __name__)


@table_read.route('/database/<database_name>/schema/<schema_name>/tables', methods=['GET'])
def get_tables(database_name,schema_name):
    user_info = get_global_user_info()
        
    account = user_info.get('account')
    user = user_info.get('user')
    password = user_info.get('password')

    snowflake_config = {
        'account': account,
        'user': user,
        'password': password,
        'database':database_name
    }

    connection = snowflake.connector.connect(**snowflake_config)
    cursor = connection.cursor()

    try:
        query = f"SHOW TABLES IN SCHEMA {schema_name}"
        cursor.execute(query)
        result = cursor.fetchall()
        tables = [row[1] for row in result]
        return jsonify({'tables': tables})
    finally:
        cursor.close()
        connection.close()

