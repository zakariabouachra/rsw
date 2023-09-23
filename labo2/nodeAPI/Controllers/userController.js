const UserModel = require('../models/userModel');

const userController = {
    receiveData: async (req, res) => {
        const postData = req.body;

        console.log('Données reçues du formulaire PHP :', postData);

        try {
            const user = new UserModel({
                nom: postData.nom,
                email: postData.email,
                password: postData.password
            });

            const savedUser = await user.save();

            const userData = {
                nom: savedUser.nom,
                email: savedUser.email,
                id: savedUser._id 
            };

            console.log('Utilisateur enregistré dans la base de données :', userData);

            res.json(userData);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des données :', error);

            if (error.name === 'ValidationError') {
                // Erreur de validation du modèle
                res.status(400).json({ message: 'Erreur de validation. Veuillez vérifier les données.' });
            } else {
                // Erreur interne du serveur
                res.status(500).json({ message: 'Erreur interne du serveur lors de l\'enregistrement des données.' });
            }
        }
    }
};

module.exports = userController;
