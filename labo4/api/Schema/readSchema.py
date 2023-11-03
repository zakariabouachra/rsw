from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


schema_read = Blueprint('readSchema', __name__)

@schema_read.route('/database/<database_name>/schemas', methods=['GET'])
def get_schemas(database_name):
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
        query = f"SHOW SCHEMAS IN DATABASE {database_name}"
        cursor.execute(query)
        result = cursor.fetchall()
        schemas = [row[1] for row in result]
        return jsonify({'schemas': schemas})
    finally:
        cursor.close()
        connection.close()
