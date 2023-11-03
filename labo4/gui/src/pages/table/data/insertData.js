import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
  
  const InsertData = ({openTableDialog, setOpenTableDialog, setData, dbcolumns}) => {
    const { databaseName, schemaName, tableName } = useParams();
  
    const [currentTableName] = useState(tableName);
    const [currentDatabaseName] = useState(databaseName);
    const [currentSchemaName] = useState(schemaName);
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);  
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);

    const [newRowData, setNewRowData] = useState({});

  
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
      setSubmitting(true);
      axios
        .post(`http://localhost:5000/insert/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/data/insert`, newData)
        .then((response) => {
          const tableData = response.data.data;
          setData(tableData);
          localStorage.setItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(tableData));
          handleCloseTableDialog();
          setNewRowData({});
          setmessageSuccess(response.data.message);
          setOperationStatus('success');
          setOpenSnackBar(true);
          setSubmitting(false);

        })
        .catch((error) => {
          setmessageErreur(error.response.data.error);
          setOperationStatus('error');
          setOpenSnackBar(true);
          setSubmitting(false);

        });
    };
    

    const handleCloseTableDialog = () => {
      setOpenTableDialog(false);
    };
  
    return (
      <div>
        {/* Dialogue modal pour ajouter une donnée */}
        <Dialog open={openTableDialog} onClose={handleCloseTableDialog}>
          <DialogTitle>Ajouter une donnée</DialogTitle>
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
            <Button onClick={handleCloseTableDialog} color="primary" disableElevation 
            disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleAddData} color="primary" variant="contained" disableElevation 
            disabled={isSubmitting} >
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
  
  export default InsertData;
  