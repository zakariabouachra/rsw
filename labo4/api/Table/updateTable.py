from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


table_update = Blueprint('updatetable', __name__)


@table_update.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/edit', methods=['PUT'])
def edit_table_name(database_name, schema_name, table_name):
    try:
        # Récupérez les données JSON de la requête PUT
        data = request.get_json()
        
        if 'newTableName' not in data:
            return jsonify({'error': 'Le nouveau nom de la table n\'est pas fourni dans la requête.'}), 400
        
        new_table_name = data['newTableName']

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

        # Connexion à Snowflake
        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()
        
        try:
            use_schema_query = f"USE SCHEMA {schema_name}"
            cursor.execute(use_schema_query)

            tables_query = f"SHOW TABLES IN SCHEMA {schema_name}"
            cursor.execute(tables_query)
            tables = [row[1] for row in cursor.fetchall()]
            
            # Vérifiez si le nouveau nom de la table existe déjà
            if new_table_name in tables:
                return jsonify({'error': 'Le nouveau nom de la table existe déjà.'}), 400
            
            # Écrivez votre logique pour mettre à jour le nom de la table ici
            update_table_query = f"ALTER TABLE {schema_name}.{table_name} RENAME TO {new_table_name}"
            cursor.execute(update_table_query)
            
            query = f"SHOW TABLES IN SCHEMA {schema_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            tables = [row[1] for row in result]
           
            
            return jsonify({'status': 'success','tables':tables, 'message': f'Le nom de la table a été mis à jour avec succès.'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500


