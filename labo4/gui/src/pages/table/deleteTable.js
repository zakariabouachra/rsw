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
  
  const DeleteTable = ({openDeleteDialog, setOpenDeleteDialog, setDeleting, currentDatabaseName, currentSchemaName, currentTableName}) => {
    const navigate = useNavigate();
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);  
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteTable = () => {
      setDeleting(true);
      setSubmitting(true);

      axios
        .delete(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/delete`) 
        .then((response) => {
          const table = response.data.tables;
          localStorage.setItem(`tables_${currentDatabaseName}_${currentSchemaName}`, JSON.stringify(table));
          localStorage.removeItem(`table_description_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);
          localStorage.removeItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);
          localStorage.removeItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);
          navigate(`/database/${currentDatabaseName}/${currentSchemaName}`); 
          setmessageSuccess(response.data.message);
          setOperationStatus('success');
          setOpenSnackBar(true);

        })
        .catch((error) => {
          console.error(error);
          setmessageErreur(error.response.data.error);
          setOperationStatus('error');
          setOpenSnackBar(true);
          setSubmitting(false);

        })
        .then(() => {
          setDeleting(false); 
          setSubmitting(false);

        });
        
    };
  

  
    return (
      <div>
        {/* Dialogue modal pour supprimer la table */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmation de suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cette table ?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary"
              disableElevation 
              disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              onClick={handleDeleteTable}
              color="error"
              disableElevation 
              disabled={isSubmitting}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
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
  
  export default DeleteTable;
  