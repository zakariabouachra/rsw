const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require('./Routes/userRoute'); 
app.use('/api', userRoute);


mongoose.connect('mongodb+srv://zackDB:2311@cluster0.uzwuxhn.mongodb.net/RSW', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connecté à MongoDB Atlas');
})
.catch((err) => {
    console.error('Erreur de connexion à MongoDB Atlas :', err.message);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});
