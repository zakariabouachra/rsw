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
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  LeftCircleOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const SchemaDetail = () => {
  const { databaseName , schemaName } = useParams();
  const navigate = useNavigate();

  // État pour le menu d'action
  const [anchorEl, setAnchorEl] = useState(null);

  // État pour le dialogue d'édition
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState('');
  const [currentSchemaName, setCurrentSchemaName] = useState(schemaName);
  const [currentDatabaseName ] = useState(databaseName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSuccess, setmessageSuccess] = useState('');
  const [isCreateTable, setCreateTable] = useState(false);

  // État pour le dialogue d'ajout de table
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);


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
    },
    addButton: {
      marginRight: '8px',
    },
  };

  // Fonction pour ouvrir le dialogue modal d'ajout de table
  const handleOpenTableDialog = () => {
    setOpenTableDialog(true);
  };
  
  const handleCloseTableDialog = () => {
    setNewTableName('');
    setColumns([]);
    setOpenTableDialog(false);

  };

  const handleAddColumn = () => {
    const newColumn = {
      name: '',
      dataType: 'INT',
      allowNull: false,
      autoIncrement: false,
      isPrimaryKey: false, // Nouvelle propriété pour la clé primaire
    };
    
    setColumns([...columns, newColumn]);
  };

  const handleColumnNameChange = (index, value) => {
    // Mettez à jour le nom de la colonne à l'index spécifié
    const updatedColumns = [...columns];
    updatedColumns[index].name = value;
    setColumns(updatedColumns);
  };

  const handleDataTypeChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].dataType = value;
    setColumns(updatedColumns);
  };
  
  const handleAllowNullChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].allowNull = value;
    setColumns(updatedColumns);
  };
  
  const handlePrimaryKeyChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].isPrimaryKey = value;
    setColumns(updatedColumns);
  };
  
  
  const handleAutoIncrementChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].autoIncrement = value;
    setColumns(updatedColumns);
  };
  

  const handleCreateTableClick = () => {
    if (newTableName.trim() === '') {
      return;
    }

    const columnsData = columns.map((column) => ({
      name: column.name,
      dataType: column.dataType,
      allowNull: column.allowNull,
      isPrimaryKey: column.isPrimaryKey,
      autoIncrement: column.autoIncrement,
    }));

    setCreateTable(true);

    axios
      .post(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/tables/insert`, {
        tableName: newTableName,
        columns: columnsData,
      })
      .then((response) => {
        const simulatedTableData = response.data.tables;
        setTables(simulatedTableData);
        localStorage.setItem(`tables_${currentDatabaseName}`, JSON.stringify(simulatedTableData));
        handleCloseTableDialog();
        setCreateTable(false)
        setmessageSuccess(response.data.message);
        setOperationStatus('success');
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setCreateTable(false);
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
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
    setNewSchemaName(currentSchemaName);
  };

  // Fonction pour fermer le dialogue d'édition
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Fonction pour gérer le changement du nom du schéma
  const handleSchemaNameChange = (event) => {
    setNewSchemaName(event.target.value);
  };

  // Fonction pour sauvegarder les modifications du nom du schéma
  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/edit`, {
        newSchemaName: newSchemaName,
      })
      .then((response) => {
        const schemaData = response.data.schemas; 
        localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));
        setCurrentSchemaName(newSchemaName);
        navigate(`/database/${currentDatabaseName}/${newSchemaName}`);
        setOperationStatus('success');
        setmessageSuccess(response.data.message);
        setOpenSnackBar(true);
        handleCloseEditDialog();

      })
      .catch((error) => {
        console.error(error);
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);        
      });
  };

  const handleDeleteSchema = () => {
    axios
      .delete(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/delete`)
      .then((response) => {
        const schemaData = response.data.schemas; 
        localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));       
        navigate(`/database/${currentDatabaseName}`);
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

  const fetchTables = () => {
    axios
      .get(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/tables`)
      .then((response) => {
        console.log(response.data);
        const tableData = response.data.tables;
        setTables(tableData);
        localStorage.setItem(`tables_${currentDatabaseName}`, JSON.stringify(tableData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {

    // Récupérez le nom de la base de données depuis localStorage
    const storedSchemasName = localStorage.getItem('currentSchemasDatabaseName');
    setCurrentSchemaName(storedSchemasName ? JSON.parse(storedSchemasName) : schemaName);

    const storedtables = localStorage.getItem(`tables_${currentDatabaseName}`);
    if (storedtables) {
      const tablesData = JSON.parse(storedtables);
      setTables(tablesData);
    } else {
      fetchTables();
    }
  }, [schemaName]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <IconButton onClick={() => navigate(-1)}>
            <LeftCircleOutlined />
          </IconButton>
          <Box fontWeight="normal" display="inline">
            {currentDatabaseName} / 
          </Box>
          <Box fontWeight="bold" display="inline">
            {currentSchemaName}
          </Box>
        </Typography>
        <Typography variant="h3" gutterBottom>
          Tables
        </Typography>
        <List>
          {tables.map((table, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={`/database/${currentDatabaseName}/${currentSchemaName}/${table}`}
            >
              <ListItemAvatar>
                <Avatar>{table.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={table} />
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenTableDialog}
          style={styles.addButton}
        >
          + Ajouter une table
        </Button>
      </div>

      {/* Dialogue modal pour ajouter une table */}
      <Dialog open={openTableDialog} onClose={handleCloseTableDialog} fullWidth maxWidth="md">
        <DialogTitle style={styles.title}>Ajouter une table</DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <TextField
            label="Nom de la table"
            variant="outlined"
            fullWidth
            margin="normal"
            style={styles.textField}
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          {columns.map((column, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <TextField
                label={`Nom de la colonne ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                style={styles.textField}
                value={column.name}
                onChange={(e) => handleColumnNameChange(index, e.target.value)}
              />
              <FormControl variant="outlined" fullWidth margin="normal" style={styles.textField}>
                <InputLabel>Type de données</InputLabel>
                <Select
                  value={column.dataType}
                  onChange={(e) => handleDataTypeChange(index, e.target.value)}
                  label="Type de données"
                >
                  <MenuItem value="BOOLEAN">Booléen</MenuItem>
                  <MenuItem value="INT">INT</MenuItem>
                  <MenuItem value="BIGINT">Entier long</MenuItem>
                  <MenuItem value="FLOAT">FLOAT</MenuItem>
                  <MenuItem value="DOUBLE">DOUBLE</MenuItem>
                  <MenuItem value="NUMBER">Nombre</MenuItem>
                  <MenuItem value="DATE">Date</MenuItem>
                  <MenuItem value="TIME">Heure</MenuItem>
                  <MenuItem value="TIMESTAMP">Horodatage</MenuItem>
                  <MenuItem value="STRING">Chaîne de caractères</MenuItem>
                  <MenuItem value="CHAR">Chaîne de caractères fixe</MenuItem>
                  <MenuItem value="VARCHAR">VARCHAR</MenuItem>
                  <MenuItem value="BINARY">Binaire (BLOB)</MenuItem>
                  <MenuItem value="ARRAY">Tableau</MenuItem>
                  <MenuItem value="OBJECT">Objet JSON</MenuItem>
                  <MenuItem value="VARIANT">Variante JSON</MenuItem>
                </Select>
              </FormControl>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.allowNull}
                      onChange={(e) => handleAllowNullChange(index, e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Null"
                  style={styles.textField}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.isPrimaryKey}
                      onChange={(e) => handlePrimaryKeyChange(index, e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Clé primaire"
                  style={styles.textField}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.autoIncrement}
                      onChange={(e) => handleAutoIncrementChange(index, e.target.checked)}
                      color="primary"
                    />
                  }
                  label="A_I"
                  style={styles.textField}
                />
              </div>
            </div>
          ))}
          <Button variant="outlined" color="primary" onClick={handleAddColumn} style={{ marginLeft: '16px'}}>
            Ajouter une colonne
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTableDialog} color="primary" disableElevation
            disabled={isCreateTable}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={styles.createButton}
            onClick={handleCreateTableClick}
            disableElevation
            disabled={isCreateTable}
          >
            Créer Table
          </Button>
        </DialogActions>
      </Dialog>



      {/* Dialogue modal pour éditer le nom du schéma */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={styles.title}>Modifier schéma</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom du schéma"
            variant="outlined"
            fullWidth
            value={newSchemaName}
            onChange={handleSchemaNameChange}
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
        <DialogTitle style={styles.title}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce schéma ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteSchema}
            color="error"
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

export default SchemaDetail;
