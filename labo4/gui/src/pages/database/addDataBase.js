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
import 'assets/css/styles.css'


const AddDatabase = ({openDialog, setOpenDialog, setDatabases, useWarehouse, selectedWarehouse}) => {

  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isSubmitting , setSubmitting] = useState(false);


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateClick = () => {
    if (newDatabaseName.trim() === '') {
      return;
    }

    setSubmitting(true);

    // Créez un objet pour les données à envoyer au backend
    const data = {
      databaseName: newDatabaseName,
      useWarehouse: useWarehouse,
      selectedWarehouse: selectedWarehouse,
    };

    // Utilisez Axios pour envoyer la demande d'insertion au backend
    axios
      .post('http://localhost:5000/insert/databases/insert', data)
      .then((response) => {
        const databaseData = response.data.databases;
        setDatabases(databaseData);
        localStorage.setItem('databases', JSON.stringify(databaseData));
        setOperationStatus('success');
        setOpenSnackBar(true);
        handleCloseDialog();
        setSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
        setSubmitting(false);
      });
  };

  return (
    <div>
      {/* Dialogue modal pour ajouter une base de données */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="title">Ajouter une base de données</DialogTitle>
        <DialogContent className="dialogContent">
          <TextField
            label="Nom de la base de données"
            variant="outlined"
            fullWidth
            margin="normal"
            className="textField"
            value={newDatabaseName}
            onChange={(e) => setNewDatabaseName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" disableElevation 
              disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="createButton"
            onClick={handleCreateClick}
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
            Base de données créée avec succès !
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

export default AddDatabase;
