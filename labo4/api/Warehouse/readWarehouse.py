from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info

warehouse_read = Blueprint('read', __name__)

@warehouse_read.route('/warehouses', methods=['GET'])
def get_warehouses():
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
        query = "SHOW WAREHOUSES"
        cursor.execute(query)
        result = cursor.fetchall()
        warehouses = [row[0] for row in result]
        return jsonify({'warehouses': warehouses})
    finally:
        cursor.close()
        connection.close()
