from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info


column_del = Blueprint('delColumn', __name__)


@column_del.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/column/<column_name>/delete', methods=['DELETE'])
def delete_table_column(database_name, schema_name, table_name, column_name):
    try:
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
            # Vérifiez si la colonne existe dans la table
            check_column_query = f"SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '{table_name}' AND column_name = '{column_name}'"
            cursor.execute(check_column_query)
            count = cursor.fetchone()[0]

            if count == 0:
                return jsonify({'error': f'La colonne {column_name} n\'existe pas dans la table {schema_name}.{table_name}.'}), 400

            # Vérifiez combien de colonnes resteront après la suppression
            query = f"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'"
            cursor.execute(query)
            remaining_columns = cursor.fetchone()[0]

            if remaining_columns == 1:
                return jsonify({'error': 'La dernière colonne de la table ne peut pas être supprimée.'}), 400

            # Créez la requête pour supprimer la colonne de la table
            alter_table_query = f"ALTER TABLE {schema_name}.{table_name} DROP COLUMN {column_name}"
            cursor.execute(alter_table_query)

            query = f"SELECT COLUMN_NAME, DATA_TYPE, IS_IDENTITY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'"
            cursor.execute(query)
            result = cursor.fetchall()

            # Créer une liste de dictionnaires contenant le nom, le type de données, la précision numérique et l'échelle numérique de chaque colonne
            columns = [{'name': row[0], 'data_type': row[1], 'autoIncrement': row[2]} for row in result]

            # Après avoir supprimé la colonne avec succès, renvoyez une réponse JSON appropriée
            return jsonify({'status': 'success','columns': columns, 'message': f'La colonne {column_name} a été supprimée avec succès de la table {schema_name}.{table_name}.'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
