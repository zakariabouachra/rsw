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
import { useNavigate, useParams } from 'react-router-dom';
import 'assets/css/styles.css';

const EditDatabase = ({openEditDialog, setOpenEditDialog, newDatabaseName, setNewDatabaseName}) => {
  const { databaseName } = useParams();
  const navigate = useNavigate();

  // État pour le dialogue d'édition
  const [currentDatabaseName, setCurrentDatabaseName] = useState(databaseName);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSuccess, setmessageSuccess] = useState('');
  const [isSubmitting , setSubmitting] = useState(false);


  // Fonction pour fermer le dialogue d'édition
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Fonction pour gérer le changement du nom de la base de données
  const handleDatabaseNameChange = (event) => {
    setNewDatabaseName(event.target.value);
  };

const handleSaveEdit = () => {
  if (newDatabaseName.trim() === '') {
    return;
  }
  setSubmitting(true);

  const updatedDatabaseData = {
    newDatabaseName: newDatabaseName,
  };

  axios
    .put(`http://localhost:5000/update/database/${currentDatabaseName}/edit`, updatedDatabaseData) 
    .then((response) => {
      const databaseData = response.data.databases;
      localStorage.setItem('databases', JSON.stringify(databaseData));
      setCurrentDatabaseName(newDatabaseName);
      handleCloseEditDialog();
      navigate(`/database/${newDatabaseName}`);
      setmessageSuccess(response.data.message);
      setOperationStatus('success');
      setOpenSnackBar(true);
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
    <div >
      {/* Dialogue modal pour éditer le nom de la base de données */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle className="title">Modifier base de données</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom de la base de données"
            variant="outlined"
            fullWidth
            value={newDatabaseName}
            onChange={handleDatabaseNameChange}
            className="textField"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary" disableElevation 
            disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained" disableElevation 
            disabled={isSubmitting}>
            Enregistrer
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

export default EditDatabase;

