import {
  AddCircleOutline
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddDatabase from './addDataBase';
import 'assets/css/styles.css';



const DatabaseDefault = () => {
  const [databases, setDatabases] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [useWarehouse, setUseWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [warehouseList, setWarehouseList] = useState([]);
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
          <AddCircleOutline /> Database
        </Button>
      </div>

      <AddDatabase
        openDialog={openDialog}
        setDatabases={setDatabases}
        setOpenDialog={setOpenDialog}
        useWarehouse={useWarehouse}
        selectedWarehouse={selectedWarehouse}
      />



     {/* Dialogue d'alerte au chargement */}
      <Dialog open={!useWarehouse && loadingAlertOpen}>
        <DialogTitle
          style={{
            backgroundColor: 'red', // Couleur de fond de l'en-tête du dialogue
            color: 'white', // Couleur du texte de l'en-tête du dialogue
          }}
          className="title"
        >
          Message Alerte
        </DialogTitle>
        <DialogContent className="dialogContent">
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
                  backgroundColor: 'green', // Couleur de fond du bouton "Oui"
                  color: 'white', // Couleur du texte du bouton "Oui"
                }}
                className="createButton"
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
                  backgroundColor: 'red', // Couleur de fond du bouton "Non"
                  color: 'white', // Couleur du texte du bouton "Non"
                }}
                className="createButton"
                onClick={handlenotUseWarehouseClick}
              >
                Non
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>


      

      {/* Dialogue modal pour utiliser un entrepôt */}
      <Dialog open={showUseDialog} onClose={handleCloseDialog} >
        <DialogTitle
          style={{
            backgroundColor: 'red', // Couleur de fond de l'en-tête du dialogue
            color: 'white', // Couleur du texte de l'en-tête du dialogue
            marginBottom: '10px', // Ajout d'espace en bas du titre
          }}
          className="title"
        >
          Utiliser un entrepôt
        </DialogTitle>
        <DialogContent className="dialogContent">
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
              backgroundColor: 'green', // Couleur de fond du bouton "Use"
              color: 'white', // Couleur du texte du bouton "Use"
            }}
            className="createButton"
            onClick={handleUseDialog}
          >
            Use
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default DatabaseDefault;
