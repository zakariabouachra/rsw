import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
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

const DatabaseDetail = () => {
  const { databaseName } = useParams();
  const navigate = useNavigate();

  // État pour le menu d'action
  const [anchorEl, setAnchorEl] = useState(null);

  // État pour le dialogue d'édition
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [currentDatabaseName, setCurrentDatabaseName] = useState(databaseName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openSchemaDialog, setOpenSchemaDialog] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [messageSuccess, setmessageSuccess] = useState('');





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
    alignRight: {
      display: 'flex',
      justifyContent: 'flex-end',
    }
  };

  // Fonction pour ouvrir le dialogue modal d'ajout de schéma
  const handleOpenSchemaDialog = () => {
    setOpenSchemaDialog(true);
  };

  // Fonction pour fermer le dialogue modal d'ajout de schéma
  const handleCloseSchemaDialog = () => {
    setOpenSchemaDialog(false);
  };

  const handleCreateSchemaClick = () => {
    if (newSchemaName.trim() === '') {
      return;
    }
  
    // Créez un objet contenant les données du nouveau schéma
    const newSchemaData = {
      schemaName: newSchemaName,
      databaseName: currentDatabaseName, // Si nécessaire, ajustez cela en fonction de votre API
    };
  
    // Envoyez une requête POST pour insérer le nouveau schéma
    axios
      .post('http://localhost:5000/schemas/insert', newSchemaData) // Assurez-vous d'ajuster l'URL en fonction de votre API
      .then((response) => {
        const schemaData = response.data.schemas; 
        setSchemas(schemaData);
        localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));
        setOperationStatus('success');
        setmessageSuccess(response.data.message);
        setOpenSnackBar(true);  
        setNewSchemaName(''); 
        handleCloseSchemaDialog(); 
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);  
        // Gérez les erreurs en conséquence, par exemple, affichez un message d'erreur à l'utilisateur
      });
  };

  // Fonction pour ouvrir le menu d'action
  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu d'action
  const handleActionClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour ouvrir le dialogue d'édition
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setNewDatabaseName(currentDatabaseName);
  };

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

  const updatedDatabaseData = {
    newDatabaseName: newDatabaseName,
  };

  axios
    .put(`http://localhost:5000/database/${currentDatabaseName}/edit`, updatedDatabaseData) 
    .then((response) => {
      const databaseData = response.data.databases;
      localStorage.setItem('databases', JSON.stringify(databaseData));
      setCurrentDatabaseName(newDatabaseName);
      handleCloseEditDialog();
      navigate(`/database/${newDatabaseName}`);
      setmessageSuccess(response.data.message);
      setOperationStatus('success');
      setOpenSnackBar(true);
    })
    .catch((error) => {
      console.error(error);
      setmessageErreur(error.response.data.error);
      setOperationStatus('error');
      setOpenSnackBar(true);
    });
};


  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const fetchSchemas = () => {
    axios
      .get(`http://localhost:5000/database/${currentDatabaseName}/schemas`)
      .then((response) => {
        console.log(response.data);
        const schemaData = response.data.schemas;
        setSchemas(schemaData);
        localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));  
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);  
      });
  };

  useEffect(() => {

    // Récupérez le nom de la base de données depuis localStorage
    const storedDatabaseName = localStorage.getItem('currentDatabaseName');
    setCurrentDatabaseName(storedDatabaseName ? JSON.parse(storedDatabaseName) : databaseName);

    const storedSchemas = localStorage.getItem(`schemas_${currentDatabaseName}`);
    if (storedSchemas) {
      const schemaData = JSON.parse(storedSchemas);
      setSchemas(schemaData);
    } else {
      fetchSchemas();
    }  
  }, [databaseName]);

  const handleDeleteDatabase = () => {
    axios
      .delete(`http://localhost:5000/database/${currentDatabaseName}/delete`) 
      .then((response) => {
        const databaseData = response.data.databases;
        localStorage.setItem('databases', JSON.stringify(databaseData));
        localStorage.removeItem(`tables_${currentDatabaseName}`);
        navigate('/database'); 
      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <IconButton component={Link} to="/database">
            <LeftCircleOutlined />
          </IconButton>
          <Box fontWeight="normal" display="inline">
            Databases /
          </Box>
          <Box fontWeight="bold" display="inline">
            {currentDatabaseName}
          </Box>
        </Typography>
        <Typography variant="h3" gutterBottom>
          Schemas
        </Typography>
        <List>
          {schemas.map((schema, index) => (
            <ListItemButton key={index} component={Link} to={`/database/${currentDatabaseName}/${schema}`}>
              <ListItemAvatar>
                <Avatar>{schema.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={schema} />
            </ListItemButton>
          ))}
        </List>
      </div>
      <div style={{ flex: 0 }}>
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
      <div style={{ flex: 1 }}>
        <Button variant="contained" color="primary" onClick={handleOpenSchemaDialog}>
          + Schéma
        </Button>
      </div>

      {/* Dialogue modal pour éditer le nom de la base de données */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={styles.title}>Modifier base de données</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom de la base de données"
            variant="outlined"
            fullWidth
            value={newDatabaseName}
            onChange={handleDatabaseNameChange}
            style={styles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle
        style={styles.title}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette database ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteDatabase}
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue modal pour ajouter un schéma */}
      <Dialog open={openSchemaDialog} onClose={handleCloseSchemaDialog}>
        <DialogTitle style={styles.title}>Ajouter un schéma</DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <TextField
            label="Nom du schéma"
            variant="outlined"
            fullWidth
            margin="normal"
            style={styles.textField}
            value={newSchemaName}
            onChange={(e) => setNewSchemaName(e.target.value)}
          />
          <DialogActions>
            <Button onClick={handleCloseSchemaDialog} color="primary">
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={styles.createButton}
              onClick={handleCreateSchemaClick}
            >
              Créer Schéma
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

export default DatabaseDetail;

