import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import 'assets/css/styles.css';

const AddSchema = ({openSchemaDialog, setOpenSchemaDialog, setSchemas}) => {
  const { databaseName } = useParams();


  const [currentDatabaseName] = useState(databaseName);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState('');
  const [messageSuccess, setmessageSuccess] = useState('');
  const [isSubmitting , setSubmitting] = useState(false);


  // Fonction pour fermer le dialogue modal d'ajout de schéma
  const handleCloseSchemaDialog = () => {
    setOpenSchemaDialog(false);
  };

  const handleCreateSchemaClick = () => {
    if (newSchemaName.trim() === '') {
      return;
    }
    setSubmitting(true);
  
    // Créez un objet contenant les données du nouveau schéma
    const newSchemaData = {
      schemaName: newSchemaName,
      databaseName: currentDatabaseName, // Si nécessaire, ajustez cela en fonction de votre API
    };
  
    // Envoyez une requête POST pour insérer le nouveau schéma
    axios
      .post('http://localhost:5000/insert/schemas/insert', newSchemaData) // Assurez-vous d'ajuster l'URL en fonction de votre API
      .then((response) => {
        const schemaData = response.data.schemas; 
        setSchemas(schemaData);
        localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));
        setOperationStatus('success');
        setmessageSuccess(response.data.message);
        setOpenSnackBar(true);  
        setNewSchemaName(''); 
        handleCloseSchemaDialog(); 
        setSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);  
        setSubmitting(false);
        // Gérez les erreurs en conséquence, par exemple, affichez un message d'erreur à l'utilisateur
      });
  };

 return(
    <div>
      {/* Dialogue modal pour ajouter un schéma */}
      <Dialog open={openSchemaDialog} onClose={handleCloseSchemaDialog}>
        <DialogTitle className="title">Ajouter un schéma</DialogTitle>
        <DialogContent className="dialogContent">
          <TextField
            label="Nom du schéma"
            variant="outlined"
            fullWidth
            margin="normal"
            className="textField"
            value={newSchemaName}
            onChange={(e) => setNewSchemaName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSchemaDialog} color="primary" disableElevation 
          disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSchemaClick}
            disableElevation 
            disabled={isSubmitting}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

       {/* Snackbar pour afficher le résultat de l'opération */}
       <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        {operationStatus === 'success' ? (
          <Alert severity="success" sx={{ width: '100%' }}>
            {messageSuccess}
          </Alert>
        ) : (
          <Alert severity="error" sx={{ width: '100%' }}>
            Erreur : {messageErreur}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default AddSchema;

