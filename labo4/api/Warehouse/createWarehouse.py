from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


warehouse_insert = Blueprint('insert', __name__)


@warehouse_insert.route('/warehouses/insert', methods=['POST'])
def insert_warehouse():
    try:
        data = request.json
        data = data['warehouseName']

        if data is None or data.strip() == '':
            return jsonify({'error': 'Le nom du warehouse ne peut pas être vide.'}), 400
        
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
            check_query = f"SHOW WAREHOUSES LIKE '{data}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is not None:
                return jsonify({'error': f'Le warehouse avec le nom "{data}" existe déjà.'}) ,400

            insert_query = f"CREATE WAREHOUSE {data}"
            cursor.execute(insert_query)

            query = "SHOW WAREHOUSES"
            cursor.execute(query)
            result = cursor.fetchall()
            warehouses = [row[0] for row in result]

            return jsonify({'status': 'success', 'warehouses': warehouses})
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        return jsonify({'error': str(e)}), 500

