import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const AddColumn = ({openAddColumnDialog, setOpenAddColumnDialog, setdbColumns, setData}) => {
  const { databaseName, schemaName, tableName } = useParams();

  // États pour le menu d'action
  const [currentTableName] = useState(tableName);
  const [currentDatabaseName] = useState(databaseName);
  const [currentSchemaName] = useState(schemaName);
  const [openConfirmationColumnDialog, setOpenConfirmationColumnDialog] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);  
  const [messageSuccess, setmessageSuccess] = useState('');
  const [columns, setColumns] = useState([]); // Ajoutez cet état pour gérer les colonnes
  const [isSubmitting , setSubmitting] = useState(false);


  // Onglet actif

  const newColumn = {
    name: '',
    dataType: 'INT',
    allowNull: false,
    autoIncrement: false,
    isPrimaryKey: false
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
      setSubmitting(true);
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
          localStorage.setItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(columnData));
          const data = response.data.data;
          console.log(data);
          setData(data);
          localStorage.setItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(data));
          handleCloseAddColumnDialog();
          handleCloseConfirmationColumnDialog();
          setmessageSuccess(response.data.message);
          setOperationStatus('success');
          setOpenSnackBar(true);
          setSubmitting(false);

          
        })
        .catch((error) => {
          console.error(error);
          setmessageErreur(error.response.data.error);
          setOperationStatus('error');
          setOpenSnackBar(true);
          setSubmitting(false);

        });
    }
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

 
  const handleCloseAddColumnDialog = () => {
    setColumns([newColumn]);
    setOpenAddColumnDialog(false);
  };


  return (
    <div>
      <Dialog open={openConfirmationColumnDialog} onClose={handleCloseConfirmationColumnDialog}>
        <DialogTitle style={{ backgroundColor: 'red', color: 'white' }}>Confirmation dajout</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px' }}>
            Si vous ajoutez cette colonne, les données pour cette nouvelle colonne auront des valeurs nulles ! Voulez-vous continuer ?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationColumnDialog} color="primary" disableElevation 
            disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmAddRow}
            style={{ color: 'red' }}
            disableElevation 
            disabled={isSubmitting}
          >
            Continuer
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialogue modal pour ajouter une colonne */}
      <Dialog open={openAddColumnDialog} onClose={handleCloseAddColumnDialog}>
        <DialogTitle>Ajouter colonne</DialogTitle>
        <DialogContent>
        {columns.map((column, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <TextField
                label={`Nom de la colonne ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={column.name}
                onChange={(e) => handleColumnNameChange(index, e.target.value)}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
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

export default AddColumn;
