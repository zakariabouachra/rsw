const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Importer le module axios
const app = express();
const port = 3000; // Port sur lequel votre serveur Node.js écoutera

app.use(bodyParser.json());

app.post('/api-Php', async (req, res) => {
    const { nom_produit, prix_total } = req.body;

    console.log(nom_produit)
    console.log(prix_total)

    const prix_taxe = prix_total + (prix_total * 0.08);

    const response = {
        nom_produit,
        prix_total: prix_taxe 
    };

    res.json(response);

    try {
        await axios.post('http://localhost:5000/api-Python', response);
        console.log('Données envoyées avec succès au serveur Python.');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'envoi des données au serveur Python:', error.message);
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
