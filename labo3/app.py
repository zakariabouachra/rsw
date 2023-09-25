# Streamlit (affichage des données)
import streamlit as st
import requests
import pandas as pd

st.title("Affichage de données depuis Snowflake")

# URL de l'API Flask que vous avez créée
api_url = "http://127.0.0.1:5000/get_data"  

# Fonction pour récupérer les données depuis l'API Flask
def get_data_from_api():
    try:
        response = requests.get(api_url)
        data = response.json()
        return data
    except Exception as e:
        st.error(f"Une erreur s'est produite lors de la récupération des données : {str(e)}")
        return None

# Bouton pour récupérer les données
if st.button("Récupérer les données depuis Snowflake"):
    data = get_data_from_api()
    if data:
        # Convertit les données JSON en DataFrame Pandas
        df = pd.read_json(data, orient='records')
        st.write("Données récupérées depuis Snowflake :")
        st.write(df)
