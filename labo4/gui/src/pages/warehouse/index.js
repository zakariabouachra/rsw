import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';

const styles = {
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    marginBottom: '16px',
    width: '500px',
  },
  createButton: {
    width: '100px',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successMessage: {
    textAlign: 'center',
    backgroundColor: '#4CAF50', // Couleur verte pour le succès
    color: 'black',
    padding: '8px',
    marginBottom: '16px',
  }
};

const WarehouseDefault = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [operationStatus, setOperationStatus] = useState(null); // null pour aucune opération en cours, 'success' ou 'error' pour indiquer le statut de l'opération
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);


  useEffect(() => {
    const cachedwarehouse = localStorage.getItem('warehouses');
    if (cachedwarehouse) {
      setWarehouses(JSON.parse(cachedwarehouse));
    } else {
      axios
        .get('http://localhost:5000/warehouses')
        .then((response) => {
          const warehouseData = response.data.warehouses;
          setWarehouses(warehouseData);
          localStorage.setItem('warehouses', JSON.stringify(warehouseData));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setmessageErreur('');
    setOperationStatus(null);
  };

  const handleCreateClick = () => {
    if (newWarehouseName.trim() === '') {
      return;
    }

    axios
      .post('http://localhost:5000/warehouses/insert', { warehouseName: newWarehouseName.toUpperCase() })
      .then((response) => {
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

      });

    setNewWarehouseName('');
  };

  return (
    
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 5.7 }}>
        <Typography variant="h4" gutterBottom>
          Warehouses
        </Typography>
        <List>
          {warehouses.map((warehouse, index) => (
            <ListItemButton key={index} component={Link} to={`/warehouse/${warehouse}`}>
              <ListItemAvatar>
                <Avatar>{warehouse.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={warehouse} />
            </ListItemButton>
          ))}
        </List>
        
      </div>
      <div style={{ flex: 1 }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          + Warehouse
        </Button>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={styles.title}>Ajouter un entrepôt</DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <TextField
            label="Warehouse Name"
            variant="outlined"
            fullWidth
            margin="normal"
            style={styles.textField}
            value={newWarehouseName}
            onChange={(e) => setNewWarehouseName(e.target.value)}
          />
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={styles.createButton}
              onClick={handleCreateClick}
            >
              Créer
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Snackbar pour afficher le résultat de l'opération */}
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

export default WarehouseDefault;
