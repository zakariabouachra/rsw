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
import 'assets/css/styles.css';


const AddWarehouse = ({setWarehouses, setOpenDialog, openDialog}) => {

  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [operationStatus, setOperationStatus] = useState(null); // null pour aucune opération en cours, 'success' ou 'error' pour indiquer le statut de l'opération
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isSubmitting , setSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setmessageErreur('');
    setOperationStatus(null);
  };

  const handleCreateClick = () => {
    if (newWarehouseName.trim() === '') {
      return;
    }
    setSubmitting(true);
    axios
      .post('http://localhost:5000/warehouses/insert', { warehouseName: newWarehouseName.toUpperCase() })
      .then((response) => {
        setSubmitting(false);
        const warehouseData = response.data.warehouses;
        setWarehouses(warehouseData);
        localStorage.setItem('warehouses', JSON.stringify(warehouseData));
        localStorage.setItem('useWarehouse', JSON.stringify(false));
        setOperationStatus('success');
        setOpenSnackBar(true);
        handleCloseDialog();
      })
      .catch((error) => {
        
        console.log(error.response.data.error);
        setmessageErreur(error.response.data.error)
        setOperationStatus('error');
        setOpenSnackBar(true);
        setSubmitting(false);

      });

    setNewWarehouseName('');
  };

  return (
    
    <div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="title">Ajouter un entrepôt</DialogTitle>
        <DialogContent className="dialogContent">
          <TextField
            label="Warehouse Name"
            variant="outlined"
            fullWidth
            margin="normal"
            className="textField"
            value={newWarehouseName}
            onChange={(e) => setNewWarehouseName(e.target.value)}
          />
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary"disableElevation 
              disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              disableElevation 
              disabled={isSubmitting}
              variant="contained"
              color="primary"
              className="createButton"
              onClick={handleCreateClick}
            >
              Créer
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        {operationStatus === 'error' ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            Erreur : {messageErreur}
          </Alert>
        ) : (
            <Alert severity="success" sx={{ width: '100%' }}>
            warehouse créée avec succès !
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default AddWarehouse;
