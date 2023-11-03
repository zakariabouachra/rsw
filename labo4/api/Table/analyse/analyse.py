from flask import Blueprint, jsonify
import snowflake.connector
from login.login import get_global_user_info
import pandas as pd


table_analyse = Blueprint('Analysetable', __name__)

@table_analyse.route('/database/<database_name>/schema/<schema_name>/table/<table_name>/description', methods=['GET'])
def get_table_description(database_name,schema_name,table_name):
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

    # Utilisez les informations de connexion pour vous connecter à Snowflake
    connection = snowflake.connector.connect(**snowflake_config)
    cursor = connection.cursor()

    try:
        # Exécutez des opérations d'analyse ou de traitement des données pour générer la description
        # Par exemple, utilisez pandas pour lire des données depuis la table et effectuer une analyse
        query = f"SELECT * FROM {schema_name}.{table_name}"
        df = pd.read_sql(query, connection)

        # Générez la description de la table (vous pouvez personnaliser cette partie)
        table_description = df.describe().to_dict()
        
        return jsonify({'table_description': table_description})
    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()
        connection.close()
