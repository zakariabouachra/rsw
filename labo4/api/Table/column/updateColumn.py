from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


column_update = Blueprint('updateColumn', __name__)

    
@column_update.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/columns/<column_name>/edit', methods=['PUT'])
def edit_table_column(database_name, schema_name, table_name, column_name):
    try:
        data = request.get_json()
        
        if 'name' not in data or 'dataType' not in data:
            return jsonify({'error': 'Les données de colonne pour l\'édition sont incomplètes.'}), 400

        new_column_name = data['name']
        new_data_type = data['dataType']

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
            # Vérifiez si la colonne existe dans la table
            check_old_column_query = f"SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '{table_name}' AND column_name = '{column_name}'"
            cursor.execute(check_old_column_query)
            count_old = cursor.fetchone()[0]

            if count_old == 0:
                return jsonify({'error': f'La colonne {column_name} n\'existe pas dans la table {schema_name}.{table_name}.'}), 400
            
            # Vérifiez si la nouvelle colonne existe déjà
            check_new_column_query = f"SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '{table_name}' AND column_name = '{new_column_name}'"
            cursor.execute(check_new_column_query)
            count_new = cursor.fetchone()[0]

            if count_new > 0:
                return jsonify({'error': f'La colonne {new_column_name} existe déjà dans la table {schema_name}.{table_name}.'}), 400

            # Ajouter une nouvelle colonne avec le nouveau nom et le nouveau type de données
            alter_table_query_add = f"ALTER TABLE {schema_name}.{table_name} ADD COLUMN {new_column_name} {new_data_type}"

            # Exécutez la requête pour ajouter la colonne
            cursor.execute(alter_table_query_add)

            # Copier les données de l'ancienne colonne vers la nouvelle colonne
            copy_data_query = f"UPDATE {schema_name}.{table_name} SET {new_column_name} = {column_name}"
            cursor.execute(copy_data_query)

            # Supprimer l'ancienne colonne
            drop_column_query = f"ALTER TABLE {schema_name}.{table_name} DROP COLUMN {column_name}"
            
            # Exécutez les trois requêtes dans une transaction
            cursor.execute("BEGIN TRANSACTION")
            cursor.execute(drop_column_query)
            cursor.execute("COMMIT")

            query = f"SELECT COLUMN_NAME, DATA_TYPE, IS_IDENTITY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'"
            cursor.execute(query)
            result = cursor.fetchall()
            columns = [{'name': row[0], 'data_type': row[1], 'autoIncrement': row[2]} for row in result]


            query = f"SELECT * FROM {schema_name}.{table_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            # Convertir les résultats en une liste de dictionnaires pour la réponse JSON
            data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

            return jsonify({'status': 'success','data':data ,'columns': columns, 'message': f'La colonne {new_column_name} a été mise à jour avec succès dans la table {schema_name}.{table_name}.'})
        except Exception as e:
            cursor.execute("ROLLBACK")  # En cas d'erreur, annuler la transaction
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500


