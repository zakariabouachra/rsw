import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LeftCircleOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios'; // Importer Axios

const WarehouseDetail = () => {
  const { warehouseName } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [currentWarehouseName, setCurrentWarehouseName] = useState(warehouseName);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [open, setOpen] = useState(false);


  const styles = {
    textField: {
      marginBottom: '16px',
      width: '500px',
      marginTop: '5px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
  };

  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setNewWarehouseName(currentWarehouseName);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setmessageErreur('');
    setOperationStatus(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setmessageErreur('');
    setOperationStatus(null);
  };

  const handleWarehouseNameChange = (event) => {
    setNewWarehouseName(event.target.value);
  };

  const handleSaveEdit = () => {
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
        setOpen(true);

      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpen(false);
      });
  };

  const handleDeleteWarehouse = () => {
    axios
      .delete(`http://localhost:5000/warehouses/delete/${currentWarehouseName}`)
      .then((response) => {
        const warehouseData = response.data.warehouses;
        localStorage.setItem('warehouses', JSON.stringify(warehouseData));
        localStorage.setItem('useWarehouse', JSON.stringify(false));
        setOperationStatus('success');
        handleCloseDeleteDialog();
        navigate('/warehouse');
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur('Erreur lors de la suppression de l\'entrepôt.');
        setOperationStatus('error');
      });
  };

  useEffect(() => {
    setCurrentWarehouseName(warehouseName);
  }, [warehouseName]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <IconButton component={Link} to="/warehouse">
            <LeftCircleOutlined />
          </IconButton>
          <Box fontWeight="normal" display="inline">
            Warehouses /
          </Box>
          <Box fontWeight="bold" display="inline">
            {currentWarehouseName}
          </Box>
        </Typography>
      </div>
      <div style={{ flex: 1 }}>
        <IconButton onClick={handleActionClick} sx={{ border: 'none', fontSize: '25px' }}>
          <MoreOutlined />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleActionClose}>
          <MenuItem onClick={handleOpenEditDialog}>
            <EditOutlined /> Modifier
          </MenuItem>
          <MenuItem onClick={handleOpenDeleteDialog}>
            <DeleteOutlined /> Supprimer
          </MenuItem>
        </Menu>
      </div>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={styles.title}>Modifier entrepôt</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom de l'entrepôt"
            variant="outlined"
            fullWidth
            value={newWarehouseName}
            onChange={handleWarehouseNameChange}
            style={styles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle style={styles.title}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet entrepôt ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteWarehouse} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour afficher le résultat de l'opération */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
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

export default WarehouseDetail;
