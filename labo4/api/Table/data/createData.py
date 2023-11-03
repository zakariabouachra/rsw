from flask import Blueprint, jsonify, request
import snowflake.connector
from login.login import get_global_user_info


data_insert = Blueprint('insertData', __name__)


@data_insert.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/data/insert', methods=['POST'])
def add_data_to_table(database_name, schema_name, table_name):
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

    connection =  snowflake.connector.connect(**snowflake_config)
    cursor = connection.cursor()

    try:
         # Obtenir les données à ajouter depuis le corps de la requête
        data_to_add = request.get_json()

        print(data_to_add)

        # Créer une liste de noms de colonnes et une liste de valeurs correspondantes
        columns = data_to_add.keys()
        values = list(data_to_add.values())

        print(columns)
        print(values)

        # Générer la requête SQL d'insertion en spécifiant explicitement les colonnes
        columns_str = ', '.join(columns)
        placeholders = ', '.join(['%s' for _ in values])
        query = f"INSERT INTO {schema_name}.{table_name} ({columns_str}) VALUES ({placeholders})"

        print(query)
        values = list(data_to_add.values())
        # Exécuter la requête d'insertion
        cursor.execute(query, values)

        query = f"SELECT * FROM {schema_name}.{table_name}"
        cursor.execute(query)
        result = cursor.fetchall()
        # Convertir les résultats en une liste de dictionnaires pour la réponse JSON
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

        return jsonify({'data': data, 'message': 'Donnée ajoutée avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

