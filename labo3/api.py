from flask import Flask, jsonify
import snowflake.connector
import pandas as pd

app = Flask(__name__)

@app.route('/get_data', methods=['GET'])
def get_data():
    # Configuration de Snowflake
    snowflake_config = {
        'account': 'lpwzxkb-pk40285',
        'user': 'zakariabouachra',
        'password': 'Lilopipo09@',
        'warehouse': 'COMPUTE_WH',
        'database': 'RCW',
        'schema': 'PUBLIC',
    }

    try:
        # Connexion à Snowflake
        connection = snowflake.connector.connect(**snowflake_config)
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM PUBLIC.CLIENT")

        # Récupération des données
        data = cursor.fetchall()

        cursor.close()
        connection.close()

        # Récupération des noms de colonnes à partir de la première ligne
        columns = data[0]  # Supposons que la première ligne contient les noms de colonnes

        # Supprimez la première ligne des données, car elle contient les noms de colonnes
        data = data[1:]
        
        # Conversion en DataFrame Pandas
        df = pd.DataFrame(data,columns=columns)  

        # Conversion en JSON
        data_json = df.to_json(orient='records')

        return jsonify(data_json)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
