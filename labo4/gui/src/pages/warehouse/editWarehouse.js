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
import axios from 'axios'; // Importer Axios
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'assets/css/styles.css';


const EditWarehouse = ({openEditDialog, setOpenEditDialog , setNewWarehouseName, newWarehouseName}) => {
  const { warehouseName } = useParams();
  const navigate = useNavigate();
  const [currentWarehouseName, setCurrentWarehouseName] = useState(warehouseName);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [open, setOpenSnackBar] = useState(false);
  const [isSubmitting , setSubmitting] = useState(false);

 

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setmessageErreur('');
    setOperationStatus(null);
  };

  const handleWarehouseNameChange = (event) => {
    setNewWarehouseName(event.target.value);
  };

  const handleSaveEdit = () => {
    setSubmitting(true);
    axios
      .put(`http://localhost:5000/warehouses/update/${currentWarehouseName}`,{WarehouseName :newWarehouseName.toUpperCase()})
      .then((response) => {
        const warehouseData = response.data.warehouses;
        localStorage.setItem('warehouses', JSON.stringify(warehouseData));
        localStorage.setItem('useWarehouse', JSON.stringify(false));
        setCurrentWarehouseName(newWarehouseName.toUpperCase());
        setOperationStatus('success');
        handleCloseEditDialog();
        navigate(`/warehouse/${newWarehouseName.toUpperCase()}`)
        setOpenSnackBar(true);
        setSubmitting(false);

      })
      .catch((error) => {
        console.error(error.response.data.error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
        setSubmitting(false);
      });
  };


  return (
    <div>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle className="title">Modifier entrepôt</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom de l'entrepôt"
            variant="outlined"
            fullWidth
            value={newWarehouseName}
            onChange={handleWarehouseNameChange}
            className="textField"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary" disableElevation 
              disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary" disableElevation 
              disabled={isSubmitting}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpenSnackBar(false)}
        >
          {operationStatus === 'error' ? (
             <Alert severity="error" sx={{ width: '100%' }}>
             Erreur : {messageErreur}
           </Alert>
          ) : (
            <Alert severity="success" sx={{ width: '100%' }}>
            warehouse modifier avec succès !
         </Alert>
          )}
        </Snackbar>
      
    </div>
  );
};

export default EditWarehouse;
