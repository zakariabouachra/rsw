from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


column_insert = Blueprint('insertColumn', __name__)


@column_insert.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/columns/insert', methods=['POST'])
def add_table_columns(database_name, schema_name, table_name):
    try:
        # Récupérez les données JSON de la requête POST
        data = request.get_json()

        if 'columns' not in data:
            return jsonify({'error': 'Les données des colonnes ne sont pas fournies dans la requête.'}), 400

        columns = data['columns']

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
            alter_table_query = f"ALTER TABLE {schema_name}.{table_name} "

            # Dictionnaire de correspondance entre les types de données et leurs valeurs par défaut
            data_type_defaults = {
                'BOOLEAN': "''",
                'INT': '1000000000000000000000000001',
                'BIGINT': '1000000000000000000000000001',
                'FLOAT': '1000000000000000000000000001.1000000000000000000000000001',
                'DOUBLE': '1000000000000000000000000001.1000000000000000000000000001',
                'NUMBER': '1000000000000000000000000001',
                'DATE': 'CURRENT_DATE',
                'TIME': 'CURRENT_TIME',
                'TIMESTAMP': 'CURRENT_TIMESTAMP',
                'STRING': "''",
                'CHAR': "''",
                'VARCHAR': "''",
                'BINARY': "''",  # Vous pouvez définir une valeur par défaut binaire appropriée
                'ARRAY': "[]",   # Vous pouvez définir une valeur par défaut de tableau appropriée
                'OBJECT': "{}",  # Vous pouvez définir une valeur par défaut d'objet JSON appropriée
                'VARIANT': "''"  # Vous pouvez définir une valeur par défaut de variante JSON appropriée
            }

            for column in columns:
                column_name = column.get('name', '')
                column_data_type = column.get('dataType', 'VARCHAR')  # Type de données par défaut si non spécifié

                if not column_name or not column_data_type:
                    return jsonify({'error': 'Les données de colonne sont incomplètes.'}), 400

                # Obtenez la valeur par défaut à partir du dictionnaire
                default_value = data_type_defaults.get(column_data_type, "''")

                column_definition = f"ADD COLUMN {column_name} {column_data_type}"

                if column.get('isPrimaryKey', False):
                    column_definition += " PRIMARY KEY"

                if column.get('autoIncrement', False):
                    column_definition += " AUTOINCREMENT"

                column_definition += f" NOT NULL DEFAULT {default_value}"

                # Exécutez chaque instruction ALTER TABLE séparément
                query = alter_table_query + column_definition
                cursor.execute(query)


                # Si une valeur par défaut est spécifiée, mettez à jour toutes les lignes existantes avec cette valeur
                if default_value != 'NULL':
                    update_query = f"UPDATE {schema_name}.{table_name} SET {column_name} = {default_value} WHERE {column_name} IS NULL"
                    cursor.execute(update_query)

            query = f"SELECT COLUMN_NAME, DATA_TYPE, IS_IDENTITY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'"
            cursor.execute(query)
            result = cursor.fetchall()
            columns = [{'name': row[0], 'data_type': row[1], 'autoIncrement': row[2]} for row in result]

            query = f"SELECT * FROM {schema_name}.{table_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            # Convertir les résultats en une liste de dictionnaires pour la réponse JSON
            data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

            return jsonify({'data':data,'status': 'success', 'columns': columns, 'message': 'Colonnes ajoutées avec succès.'})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500



