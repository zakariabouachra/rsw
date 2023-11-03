from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info

warehouse_update = Blueprint('update', __name__)

@warehouse_update.route('/warehouses/update/<warehouse_name>', methods=['PUT'])
def update_warehouse(warehouse_name):
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
            data = request.json
            new_warehouse_name = data['WarehouseName']

            if not new_warehouse_name:
                return jsonify({'error': 'Le nouveau nom de l\'entrepôt ne peut pas être vide.'}), 400

            check_query = f"SHOW WAREHOUSES LIKE '{new_warehouse_name}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is not None:
                return jsonify({'error': f'entrepôt avec le nom "{new_warehouse_name}" existe deja.'}), 404

            update_query = f"ALTER WAREHOUSE {warehouse_name} RENAME TO {new_warehouse_name}"
            cursor.execute(update_query)

            query = "SHOW WAREHOUSES"
            cursor.execute(query)
            result = cursor.fetchall()
            warehouses = [row[0] for row in result]

            return jsonify({'status': 'success', 'message': f'Le nom de l\'entrepôt a été mis à jour avec succès.','warehouses': warehouses})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500


