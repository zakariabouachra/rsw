import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Select,
  InputLabel,
  Snackbar,
  Alert,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  AddCircleOutline,
  PlaylistAdd,
} from '@mui/icons-material';
import {
    LeftCircleOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined
  } from '@ant-design/icons';
import TableAnalyse from './tablesAnalyse';

const TableDetail = () => {
  const { databaseName, schemaName, tableName } = useParams();
  const navigate = useNavigate();

  const styles = {
    editbutton: {
      marginRight: '10px'
    },
    
    deletebutton: {
      marginLeft: '10px'
    }
  };

  // États pour le menu d'action
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [currentTableName, setCurrentTableName] = useState(tableName);
  const [currentDatabaseName] = useState(databaseName);
  const [currentSchemaName] = useState(schemaName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteColumnDialog, setOpenDeleteColumnDialog] = useState(false);
  const [openConfirmationColumnDialog, setOpenConfirmationColumnDialog] = useState(false);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);  
  const [messageSuccess, setmessageSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  // États pour les colonnes et les données
  const [dbcolumns, setdbColumns] = useState([]);
  const [columns, setColumns] = useState([]); // Ajoutez cet état pour gérer les colonnes
  const [data, setData] = useState([]);
  const [newRowData, setNewRowData] = useState({});
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [columnIndexToDelete, setColumnIndexToDelete] = useState(null); // État pour stocker l'index de la colonne à supprimer

  // Onglet actif
  const [activeTab, setActiveTab] = useState(0);

  const newColumn = {
    name: '',
    dataType: 'INT',
    allowNull: false,
    autoIncrement: false,
    isPrimaryKey: false, // Nouvelle propriété pour la clé primaire
  };

  const sortedColumns = [...dbcolumns].sort((a, b) => {
      return a.name.localeCompare(b.name);
  });

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddData = () => {
    const newData = {};
    dbcolumns.forEach((column) => {
      const value = newRowData[column.name];
      if (value !== undefined && value !== null && value !== '') {
        newData[column.name] = value;
      }
    });
  
    if (Object.keys(newData).length === 0) {
      setmessageErreur('Veuillez renseigner au moins une valeur');
      setOpenSnackBar(true);
      return; 
    }
  
    axios
      .post(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/data/insert`, newData)
      .then((response) => {
        const tableData = response.data.data;
        setData(tableData);
        localStorage.setItem(`data_${currentDatabaseName}`, JSON.stringify(tableData));
        handleCloseTableDialog();
        setNewRowData({});
        setmessageSuccess(response.data.message);
        setOperationStatus('success');
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setmessageErreur(error.response.data.error);
        setOperationStatus('error');
        setOpenSnackBar(true);
      });
  };
  

  const handleAddColumn = () => {
    setColumns([newColumn]);
    setOpenAddColumnDialog(true);
  };

  const handleotherAddColumn = () => {
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

  const handleConfirmAddRow = () => {
    const columnsData = columns.map((column) => ({
      name: column.name,
      dataType: column.dataType,
      allowNull: column.allowNull,
      isPrimaryKey: column.isPrimaryKey,
      autoIncrement: column.autoIncrement,
    }));
  
    if (columnsData.some((col) => col.name === '')) {
      return;
    } else {
      axios
        .post(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/columns/insert`, {
          columns: columnsData,
        })
        .then((response) => {
          const columnData = response.data.columns.map((column) => ({
            name: column.name,
            dataType: column.data_type,
            autoIncrement: column.autoIncrement

          }));
          setdbColumns(columnData);
          localStorage.setItem(`columns_${currentDatabaseName}`, JSON.stringify(columnData));
          const data = response.data.data;
          console.log(data);
          setData(data);
          localStorage.setItem(`data_${currentDatabaseName}`, JSON.stringify(data));
          handleCloseAddColumnDialog();
          handleCloseConfirmationColumnDialog();
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
    }
  };

  const fetchColumnsAndData = () => {
      axios
        .get(
          `http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/columns`
        )
        .then((response) => {
          const columnData = response.data.columns.map((column) => ({
            name: column.name,
            dataType: column.data_type,
            autoIncrement: column.autoIncrement

          }));
          console.log(columnData);
          console.log(response.data.columns)
          setdbColumns(columnData);
      
          // Stockez les colonnes dans le localStorage en utilisant le nom de la table comme clé
          localStorage.setItem(`columns_${currentDatabaseName}`, JSON.stringify(columnData));
        })
        .catch((error) => {
          console.log(error);
        });
  

    axios
      .get(
        `http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/data`
      )
      .then((response) => {
        const tableData = response.data.data;
        setData(tableData);
        

        // Stockez les données dans le localStorage en utilisant le nom de la table comme clé
        localStorage.setItem(`data_${currentDatabaseName}`, JSON.stringify(tableData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Récupérez le nom de la table depuis le localStorage
    const storedTableName = localStorage.getItem('currentTableName');

    // Utilisez le nom stocké s'il existe, sinon utilisez le nom actuel
    setCurrentTableName(storedTableName ? storedTableName : tableName);

    if (!deleting) {
      // Récupérez les colonnes depuis le localStorage en utilisant le nom de la table comme clé
      const storedColumns = localStorage.getItem(`columns_${currentTableName}`);
      if (storedColumns) {
        const columnData = JSON.parse(storedColumns);
        setdbColumns(columnData);
      } else {
        // Si les colonnes ne sont pas dans le localStorage, fetchColumnsAndData pour les obtenir depuis le serveur
        fetchColumnsAndData();
      }

      // Récupérez les données depuis le localStorage en utilisant le nom de la table comme clé
      const storedData = localStorage.getItem(`data_${currentTableName}`);
      if (storedData) {
        const tableData = JSON.parse(storedData);
        setData(tableData);
      } else {
        // Si les données ne sont pas dans le localStorage, fetchColumnsAndData pour les obtenir depuis le serveur
        fetchColumnsAndData();
      }
    }
  }, [tableName, deleting]); // Ajoutez "deleting" comme dépendance



  // Fonction pour ouvrir le menu d'action
  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu d'action
  const handleActionClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour ouvrir le dialogue d'édition du nom de la table
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setNewTableName(currentTableName);
  };

  // Fonction pour fermer le dialogue d'édition
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleSaveEdit = () => {
    const data = {
      newTableName: newTableName,
    };
  
    axios
      .put(
        `http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/edit`,
        data
      )
      .then((response) => {
        const tableData = response.data.tables;
        localStorage.setItem(`tables_${currentDatabaseName}`, JSON.stringify(tableData));
        handleCloseEditDialog();
        navigate(`/database/${currentDatabaseName}/${currentSchemaName}/${newTableName}`);
        setOperationStatus('success');
        setmessageSuccess(response.data.message);
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setOperationStatus('error');
        setmessageErreur(error.response.data.error);
        setOpenSnackBar(true);
      });
  };
  

  // Fonction pour ouvrir le dialogue de suppression de la table
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmationAddRow = () => {
    const columnsData = columns.map((column) => ({
      name: column.name,
      dataType: column.dataType,
      allowNull: column.allowNull,
      isPrimaryKey: column.isPrimaryKey,
      autoIncrement: column.autoIncrement,
    }));
  
    if (columnsData.some((col) => col.name === '')) {
      return;
    }
    else if(columnsData.some((col) => col.allowNull === true)){
      setOpenConfirmationColumnDialog(false);
      handleConfirmAddRow();
    }
    else{
      setOpenConfirmationColumnDialog(true);
    }
  };

  const handleCloseConfirmationColumnDialog =() =>{
    setColumns([newColumn]);
    setOpenConfirmationColumnDialog(false);
  }

  const handleOpenDeleteColumnDialog = (columnindex) => {
    setColumnIndexToDelete(columnindex);
    setOpenDeleteColumnDialog(true);
  };

  const handleCloseDeleteColumnDialog = () => {
    setOpenDeleteColumnDialog(false);
  };

  // Fonction pour fermer le dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Fonction pour ouvrir le dialogue d'ajout de colonne
  const handleOpenTableDialog = () => {
    setOpenTableDialog(true);
  };

  const handleCloseTableDialog = () => {
    setOpenTableDialog(false);
  };


  const handleCloseAddColumnDialog = () => {
    setColumns([newColumn]);
    setOpenAddColumnDialog(false);
  };


  const handleDeleteTable = () => {
    setDeleting(true);
    axios
      .delete(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/delete`) 
      .then((response) => {
        const table = response.data.tables;
        localStorage.setItem(`tables_${currentDatabaseName}`, JSON.stringify(table));
        localStorage.removeItem(`table_description_${currentTableName}`);
        localStorage.removeItem(`columns_${currentTableName}`);
        localStorage.removeItem(`data_${currentTableName}`);
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
      })
      .then(() => {
        setDeleting(false); 
      });
      
  };

  const handleEditColumn = (columnIndex) => {
    const columnToEdit = dbcolumns[columnIndex];
    console.log(columnToEdit);
  };

  const handleDeleteColumn = () =>{
    const columnToDelete = dbcolumns[columnIndexToDelete];

    axios
    .delete(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/column/${columnToDelete.name}/delete`)
    .then((response) => {
      const columnData = response.data.columns.map((column) => ({
        name: column.name,
        dataType: column.data_type,
        autoIncrement: column.autoIncrement

      }));
      setdbColumns(columnData);
      localStorage.setItem(`columns_${currentDatabaseName}`, JSON.stringify(columnData));
      handleCloseDeleteColumnDialog();
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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <IconButton onClick={() => navigate(-1)}>
            <LeftCircleOutlined />
          </IconButton>
          <Box fontWeight="normal" display="inline">
            {currentDatabaseName} / {currentSchemaName} /
          </Box>
          <Box fontWeight="bold" display="inline">
            {currentTableName}
          </Box>
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Analysis" />
          <Tab label="Columns" />
          <Tab label="Data Preview" />
        </Tabs>
        {activeTab === 0 && <TableAnalyse />}
        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
             
                {sortedColumns.map((column, index) => (
                  <TableRow key={index}>
                    <TableCell>{column.name}</TableCell>
                    <TableCell>{column.dataType}</TableCell>
                    <TableCell>
                      <IconButton style={styles.editbutton} onClick={() => handleEditColumn(index)}>
                        <EditOutlined /> Edit
                      </IconButton>
                      <IconButton style={styles.deletebutton} onClick={() => handleOpenDeleteColumnDialog(index)}>
                        <DeleteOutlined /> Delete
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {dbcolumns.map((column, index) => (
                    <TableCell key={index}>{column.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {dbcolumns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {row[column.name] === 1e+27 || row[column.name] === "" ? "nan" : row[column.name]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div style={{ flex: 0 }}>
        <IconButton onClick={handleActionClick}>
          <MoreOutlined />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleActionClose}
        >
          <MenuItem onClick={handleOpenEditDialog}>
            <EditOutlined /> Modifier
          </MenuItem>
          <MenuItem onClick={handleOpenDeleteDialog}>
            <DeleteOutlined /> Supprimer
          </MenuItem>
          <MenuItem onClick={handleAddColumn}>
            <PlaylistAdd /> Ajouter colonne
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
          <AddCircleOutline /> New Data
        </Button>
      </div>
      {/* Dialogue modal pour éditer le nom de la table */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={styles.title}>Modifier la table</DialogTitle>
        <DialogContent>
          <TextField
            label="Nouveau nom de la table"
            variant="outlined"
            fullWidth
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
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
      {/* Dialogue modal pour supprimer la table */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle style={styles.title}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette table ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteTable}
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue modal pour supprimer une column */}
      <Dialog open={openDeleteColumnDialog} onClose={handleCloseDeleteColumnDialog}>
        <DialogTitle style={styles.title}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette column ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteColumnDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteColumn}
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={openConfirmationColumnDialog} onClose={handleCloseConfirmationColumnDialog}>
        <DialogTitle style={{ backgroundColor: 'red', color: 'white' }}>Confirmation dajout</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px' }}>
            Si vous ajoutez cette colonne, les données pour cette nouvelle colonne auront des valeurs nulles ! Voulez-vous continuer ?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationColumnDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmAddRow}
            style={{ color: 'red' }}
          >
            Continuer
          </Button>
        </DialogActions>
      </Dialog>


      {/* Dialogue modal pour ajouter une donnée */}
      <Dialog open={openTableDialog} onClose={handleCloseTableDialog}>
        <DialogTitle style={styles.title}>Ajouter une donnée</DialogTitle>
        <DialogContent>
          {dbcolumns
            .filter((column) => column.autoIncrement === 'NO')
            .map((column, index) => (
              <TextField
                key={index}
                label={column.name}
                variant="outlined"
                fullWidth
                value={newRowData[column.name] || ''}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    [column.name]: e.target.value,
                  })
                }
                style={{ marginBottom: '10px' }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTableDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleAddData} color="primary" variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialogue modal pour ajouter une colonne */}
      <Dialog open={openAddColumnDialog} onClose={handleCloseAddColumnDialog}>
        <DialogTitle style={styles.title}>Ajouter colonne</DialogTitle>
        <DialogContent>
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
        
        <Button variant="outlined" color="primary" onClick={handleotherAddColumn} style={{ marginLeft: '16px'}}>
            Ajouter colonne
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddColumnDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmationAddRow}
            color="primary"
            variant="contained"
          >
            Ajouter
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

export default TableDetail;
