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
import 'assets/css/styles.css';


const AddTable = ({openTableDialog, setOpenTableDialog, setTables}) => {
  const { databaseName , schemaName } = useParams();

  const [currentSchemaName] = useState(schemaName);
  const [currentDatabaseName ] = useState(databaseName);
  const [operationStatus, setOperationStatus] = useState(null);
  const [messageErreur, setmessageErreur] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSuccess, setmessageSuccess] = useState('');
  const [isCreateTable, setCreateTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [columns, setColumns] = useState([]);

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
      .post(`http://localhost:5000/insert/database/${currentDatabaseName}/schema/${currentSchemaName}/tables/insert`, {
        tableName: newTableName,
        columns: columnsData,
      })
      .then((response) => {
        const simulatedTableData = response.data.tables;
        setTables(simulatedTableData);
        localStorage.setItem(`tables_${currentDatabaseName}_${currentSchemaName}`, JSON.stringify(simulatedTableData));
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

return(
    <div>
      {/* Dialogue modal pour ajouter une table */}
      <Dialog open={openTableDialog} onClose={handleCloseTableDialog} fullWidth maxWidth="md">
        <DialogTitle className="title">Ajouter une table</DialogTitle>
        <DialogContent >
          <TextField
            label="Nom de la table"
            variant="outlined"
            fullWidth
            margin="normal"
            className="textField"
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
                className="textField"
                value={column.name}
                onChange={(e) => handleColumnNameChange(index, e.target.value)}
              />
              <FormControl variant="outlined" fullWidth margin="normal" className="textField">
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
                  className="textField"
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
                  className="textField"
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
                  className="textField"
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
            onClick={handleCreateTableClick}
            disableElevation
            disabled={isCreateTable}
          >
            Créer Table
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

export default AddTable;
