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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  DialogActions,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';

const styles = {
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    with: '500px'
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
};

const DatabaseDefault = () => {
  const [databases, setDatabases] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [useWarehouse, setUseWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [warehouseList, setWarehouseList] = useState([]);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [loadingAlertOpen, setLoadingAlertOpen] = useState(true);
  const [showUseDialog, setShowUseDialog] = useState(false);
  

  const fetchDatabases = () => {
    axios
      .post('http://localhost:5000/databases', {
        selectedWarehouse: selectedWarehouse,
        useWarehouse: useWarehouse,
      })
      .then((response) => {
        const databaseData = response.data.databases;
        setDatabases(databaseData);
        localStorage.setItem('databases', JSON.stringify(databaseData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {

    // Vérifiez si useWarehouse est déjà dans le stockage local
    const cachedUseWarehouse = localStorage.getItem('useWarehouse');
    // Si la valeur existe, utilisez-la, sinon, utilisez false par défaut
    setUseWarehouse(cachedUseWarehouse ? JSON.parse(cachedUseWarehouse) : false);

    const cachedDatabases = localStorage.getItem('databases');
    if (cachedDatabases) {
      setDatabases(JSON.parse(cachedDatabases));
    } else {
      fetchDatabases();
    }

    if (cachedUseWarehouse === 'true') {
      fetchDatabases();
    }

    const cachedwarehouse = localStorage.getItem('warehouses');
    if (cachedwarehouse) {
      setWarehouseList(JSON.parse(cachedwarehouse));
    } else {
      // Effectuez la requête pour récupérer la liste des entrepôts
      axios
        .get('http://localhost:5000/warehouses')
        .then((response) => {
          const warehouseData = response.data.warehouses;
          setWarehouseList(warehouseData);
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
  };

  const handleCreateClick = () => {
    if (newDatabaseName.trim() === '') {
      return;
    }

    // Créez un objet pour les données à envoyer au backend
    const data = {
      databaseName: newDatabaseName,
      useWarehouse: useWarehouse,
      selectedWarehouse: selectedWarehouse,
    };

    // Utilisez Axios pour envoyer la demande d'insertion au backend
    axios
      .post('http://localhost:5000/databases/insert', data)
      .then((response) => {
        const databaseData = response.data.databases;
        setDatabases(databaseData);
        localStorage.setItem('databases', JSON.stringify(databaseData));
        setOperationStatus('success');
        setOpenSnackBar(true);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
      });
  };

  

  const handleUseWarehouseClick = () => {
    setUseWarehouse(true);
    localStorage.setItem('useWarehouse', JSON.stringify(true));
    setShowUseDialog(true);
    setLoadingAlertOpen(false); // Ne définissez setLoadingAlertOpen que si useWarehouse est false
  };

  const handlenotUseWarehouseClick = () => {
    setUseWarehouse(false);
    localStorage.setItem('useWarehouse', JSON.stringify(false));
    setShowUseDialog(false);
    setLoadingAlertOpen(false);
    setSelectedWarehouse('');
    fetchDatabases();
  };

  const handleUseDialog = () => {
    setUseWarehouse(true);
    setShowUseDialog(false); 
    setLoadingAlertOpen(false); 
    setSelectedWarehouse(selectedWarehouse);
    fetchDatabases(); 
  };

  const handleAnnulerDialog = () => {
    setUseWarehouse(false);
    setShowUseDialog(false); 
    setLoadingAlertOpen(true); 
    setSelectedWarehouse(''); 
  };



  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 5.7 }}>
        <Typography variant="h4" gutterBottom>
          Databases
        </Typography>
        <List>
          {databases.map((database, index) => (
            <ListItemButton key={index} component={Link} to={`/database/${database}`}>
              <ListItemAvatar>
                <Avatar>{database.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={database} />
            </ListItemButton>
          ))}
        </List>
      </div>
      <div style={{ flex: 1 }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          + Database
        </Button>
      </div>
     {/* Dialogue d'alerte au chargement */}
      <Dialog open={!useWarehouse && loadingAlertOpen}>
        <DialogTitle
          style={{
            ...styles.title,
            backgroundColor: 'red', // Couleur de fond de l'en-tête du dialogue
            color: 'white', // Couleur du texte de l'en-tête du dialogue
          }}
        >
          Message Alerte
        </DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <Typography style={{
              fontSize: '16px', // Taille de la police
              fontWeight: 'bold'            }}>
            Voulez-vous utiliser un entrepôt ?
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{
                  ...styles.createButton,
                  backgroundColor: 'green', // Couleur de fond du bouton "Oui"
                  color: 'white', // Couleur du texte du bouton "Oui"
                }}
                onClick={handleUseWarehouseClick}
              >
                Oui
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{
                  ...styles.createButton,
                  backgroundColor: 'red', // Couleur de fond du bouton "Non"
                  color: 'white', // Couleur du texte du bouton "Non"
                }}
                onClick={handlenotUseWarehouseClick}
              >
                Non
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>


      {/* Dialogue modal pour ajouter une base de données */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={styles.title}>Ajouter une base de données</DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <TextField
            label="Nom de la base de données"
            variant="outlined"
            fullWidth
            margin="normal"
            style={styles.textField}
            value={newDatabaseName}
            onChange={(e) => setNewDatabaseName(e.target.value)}
          />
        </DialogContent>
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
      </Dialog>

      

      {/* Dialogue modal pour utiliser un entrepôt */}
      <Dialog open={showUseDialog} onClose={handleCloseDialog} >
        <DialogTitle
          style={{
            ...styles.title,
            backgroundColor: 'red', // Couleur de fond de l'en-tête du dialogue
            color: 'white', // Couleur du texte de l'en-tête du dialogue
            marginBottom: '10px', // Ajout d'espace en bas du titre
          }}
        >
          Utiliser un entrepôt
        </DialogTitle>
        <DialogContent style={{ ...styles.dialogContent }}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel htmlFor="select-warehouse">
              Sélectionnez un entrepôt
            </InputLabel>
            <Select
              id="select-warehouse"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              style={{ width: '100%' }} // Augmenter la largeur de la boîte de sélection
            >
              {warehouseList.map((warehouse) => (
                <MenuItem key={warehouse} value={warehouse}>
                  {warehouse}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAnnulerDialog}
            color="primary"
            style={{
              backgroundColor: 'gray', // Couleur de fond du bouton "Annuler"
              color: 'white', // Couleur du texte du bouton "Annuler"
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{
              ...styles.createButton,
              backgroundColor: 'green', // Couleur de fond du bouton "Use"
              color: 'white', // Couleur du texte du bouton "Use"
            }}
            onClick={handleUseDialog}
          >
            Use
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

export default DatabaseDefault;
