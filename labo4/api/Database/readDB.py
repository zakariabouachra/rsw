from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


database_read = Blueprint('readDB', __name__)

@database_read.route('/databases', methods=['POST'])
def get_databases():
    data = request.json
    warehouse_use = data['useWarehouse']

    user_info = get_global_user_info()
    
    account = user_info.get('account')
    user = user_info.get('user')
    password = user_info.get('password')

    if warehouse_use:
        snowflake_config = {
            'account': account,
            'user': user,
            'password': password,
            'warehouse' : data['selectedWarehouse']
        }
    
    else:
        snowflake_config = {
            'account': account,
            'user': user,
            'password': password
        }

    connection = snowflake.connector.connect(**snowflake_config)
    cursor = connection.cursor()

    try:
        query = "SHOW DATABASES"
        cursor.execute(query)
        result = cursor.fetchall()
        databases = [row[1] for row in result]
        return jsonify({'databases': databases})
    finally:
        cursor.close()
        connection.close()