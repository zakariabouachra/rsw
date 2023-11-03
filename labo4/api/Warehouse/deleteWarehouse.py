from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


del_warehouse = Blueprint('del', __name__)


@del_warehouse.route('/warehouses/delete/<warehouse_name>', methods=['DELETE'])
def delete_warehouse(warehouse_name):
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
            check_query = f"SHOW WAREHOUSES LIKE '{warehouse_name}'"
            cursor.execute(check_query)
            result = cursor.fetchone()

            if result is None:
                return jsonify({'error': f'L\'entrepôt avec le nom "{warehouse_name}" n\'existe pas.'}), 404

            delete_query = f"DROP WAREHOUSE {warehouse_name}"
            cursor.execute(delete_query)

            query = "SHOW WAREHOUSES"
            cursor.execute(query)
            result = cursor.fetchall()
            warehouses = [row[0] for row in result]

            return jsonify({'status': 'success', 'message': f'L\'entrepôt "{warehouse_name}" a été supprimé avec succès.','warehouses': warehouses})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

