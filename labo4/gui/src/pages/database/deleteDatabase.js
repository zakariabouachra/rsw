import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/css/styles.css'

  const DeleteDatabase = ({openDeleteDialog, setOpenDeleteDialog, currentDatabaseName}) => {
    const navigate = useNavigate();
  
    // État pour le dialogue d'édition
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);
  
  
  
  


    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
    };
  
  
    const handleDeleteDatabase = () => {
      setSubmitting(true);
      axios
        .delete(`http://localhost:5000/database/${currentDatabaseName}/delete`) 
        .then((response) => {
          const databaseData = response.data.databases;
          localStorage.clear();
          localStorage.setItem('databases', JSON.stringify(databaseData));
          navigate('/database'); 
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
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle
          className="title">Confirmation de suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cette database ?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary" disableElevation 
              disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              onClick={handleDeleteDatabase}
              color="error"
              disableElevation 
              disabled={isSubmitting}
            >
              Supprimer
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
  
  export default DeleteDatabase;
  
  