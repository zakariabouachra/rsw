from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


table_insert = Blueprint('inserttable', __name__)


@table_insert.route('/database/<database_name>/schema/<schema_name>/tables/insert', methods=['POST'])
def create_table(database_name, schema_name):
    try:
        data = request.json
        table_name = data.get('tableName')
        columns = data.get('columns')

        if not table_name:
            return jsonify({'error': 'Le nom de la table ne peut pas être vide.'}), 400

        # Vérifier que la liste de colonnes est valide
        if not columns or not isinstance(columns, list):
            return jsonify({'error': 'Les données de colonne sont invalides.'}), 400

        user_info = get_global_user_info()
            
        account = user_info.get('account')
        user = user_info.get('user')
        password = user_info.get('password')

        snowflake_config = {
            'account': account,
            'user': user,
            'password': password,
            'database': database_name,
            'schema': schema_name,
        }

        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        try:
            create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ("

            column_definitions = []
            for column in columns:
                column_name = column['name']
                column_data_type = column['dataType']

                if not column_name or not column_data_type:
                    return jsonify({'error': 'Les données de colonne sont incomplètes.'}), 400

                column_definition = f"{column_name} {column_data_type}"

                if column['isPrimaryKey']:
                    column_definition += " PRIMARY KEY"

                if column['autoIncrement']:
                    column_definition += " AUTOINCREMENT"

                if not column['allowNull']:
                    column_definition += " NOT NULL"

                column_definitions.append(column_definition)

            create_table_query += ", ".join(column_definitions)
            create_table_query += ");"

            cursor.execute(create_table_query)

            query = f"SHOW TABLES IN SCHEMA {schema_name}"
            cursor.execute(query)
            result = cursor.fetchall()
            tables = [row[1] for row in result]

            return jsonify({'status': 'success', 'message': f'La table "{table_name}" a été créée avec succès.', 'tables': tables})
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
