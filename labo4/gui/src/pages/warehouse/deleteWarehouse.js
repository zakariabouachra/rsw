import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar
} from '@mui/material';
import axios from 'axios'; // Importer Axios
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/css/styles.css';

  
  const DeleteWarehouse = ({openDeleteDialog, setOpenDeleteDialog ,currentWarehouseName}) => {
    const navigate = useNavigate();
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [open, setOpenSnackBar] = useState(false);
    const [isSubmitting , setSubmitting] = useState(false);
  

    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
      setmessageErreur('');
      setOperationStatus(null);
    };
  
  
  
    const handleDeleteWarehouse = () => {
      setSubmitting(true);
      axios
        .delete(`http://localhost:5000/del/warehouses/delete/${currentWarehouseName}`)
        .then((response) => {
          const warehouseData = response.data.warehouses;
          localStorage.setItem('warehouses', JSON.stringify(warehouseData));
          localStorage.setItem('useWarehouse', JSON.stringify(false));
          setOperationStatus('success');
          handleCloseDeleteDialog();
          navigate('/warehouse');
          setSubmitting(false);
        })
        .catch((error) => {
          console.error(error);
          setmessageErreur('Erreur lors de la suppression de l\'entrepôt.');
          setOperationStatus('error');
          setSubmitting(false);
        });
    };

    return (
      <div>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle className="title">Confirmation de suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cet entrepôt ?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary" disableElevation 
                disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleDeleteWarehouse} color="error" disableElevation 
                disabled={isSubmitting}>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
  
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpenSnackBar(false)}
          >
            {operationStatus === 'success' ? (
              <Alert severity="success" sx={{ width: '100%' }}>
                 entrepôt a ete supprimer avec succes
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
  
  export default DeleteWarehouse;
  