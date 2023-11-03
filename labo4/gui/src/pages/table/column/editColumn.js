import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';


const EditColumn = ({ openEditColumnDialog, setOpenEditColumnDialog, columnData, columnIndexToEdit,
    currentDatabaseName, currentSchemaName, currentTableName, currentColumnName, setdbColumns, setData}) => {

    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnType, setNewColumnType] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);

  useEffect(() => {
    if (columnIndexToEdit !== null && columnData) {
        setNewColumnName(columnData[columnIndexToEdit].name);
        if (columnData[columnIndexToEdit].dataType === 'TEXT') {
          setNewColumnType("VARCHAR");
        } else {
          setNewColumnType(columnData[columnIndexToEdit].dataType);
        }
      }      
  }, [columnIndexToEdit, columnData]);

  const handleClose = () => {
    setOpenEditColumnDialog(false);
  };
  
  const handleSave = () => {
    if (newColumnName !== '' && newColumnType !== '') {
      const updatedColumn = {
        name: newColumnName,
        dataType: newColumnType,
      };
  
      setSubmitting(true);
  
      axios
        .put(
          `http://localhost:5000/update/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/columns/${currentColumnName.name}/edit`, 
          updatedColumn
        )
        .then((response) => {
            const columnData = response.data.columns.map((column) => ({
                name: column.name,
                dataType: column.data_type,
                autoIncrement: column.autoIncrement
    
            }));
            console.log(columnData);
            console.log(response.data.columns);
            setdbColumns(columnData);
            console.log(response.data.data);
            setData(response.data.data);
            localStorage.setItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(columnData));
            localStorage.setItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(response.data.data));
            handleClose();
            setOperationStatus('success');
            setmessageSuccess(response.data.message);
            setOpenSnackBar(true);
            setSubmitting(false);
        })
        .catch((error) => {
          setOperationStatus('error');
          setmessageErreur(error.response.data.error);
          setOpenSnackBar(true);
          setSubmitting(false);
        });
    }
  };
  
  return (
    <div>
    <Dialog open={openEditColumnDialog} onClose={handleClose}>
      <DialogTitle>Edit Column</DialogTitle>
      <DialogContent>
        <TextField
          label="New Column Name"
          variant="outlined"
          fullWidth
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" style={{ marginTop: '16px' }}>
          <InputLabel>Type of Data</InputLabel>
          <Select
            value={newColumnType}
            onChange={(e) => setNewColumnType(e.target.value)}
            label="Type of Data"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disableElevation 
        disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disableElevation 
        disabled={isSubmitting}>
          Save
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

export default EditColumn;
