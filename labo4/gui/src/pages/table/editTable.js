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
import { useNavigate, useParams } from 'react-router-dom';
  
  const EditTable = ({openEditDialog, setOpenEditDialog, newTableName, setNewTableName}) => {
    const { databaseName, schemaName, tableName } = useParams();
    const navigate = useNavigate();
  
    // États pour le menu d'action
    const [currentTableName] = useState(tableName);
    const [currentDatabaseName] = useState(databaseName);
    const [currentSchemaName] = useState(schemaName);
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);  
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);

  
    // Fonction pour fermer le dialogue d'édition
    const handleCloseEditDialog = () => {
      setOpenEditDialog(false);
    };
  
    const handleSaveEdit = () => {
      const data = {
        newTableName: newTableName,
      };
      setSubmitting(true);

      axios
        .put(
          `http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/edit`,
          data
        )
        .then((response) => {
          const tableData = response.data.tables;
          localStorage.setItem(`tables_${currentDatabaseName}_${currentSchemaName}`, JSON.stringify(tableData));
          handleCloseEditDialog();
          navigate(`/database/${currentDatabaseName}/${currentSchemaName}/${newTableName}`);
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
    };
    
  
 
  
    return (
      <div>
        {/* Dialogue modal pour éditer le nom de la table */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Modifier la table</DialogTitle>
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
            <Button onClick={handleCloseEditDialog} color="primary" disableElevation 
            disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} color="primary" variant="contained" disableElevation 
            disabled={isSubmitting}>
              Enregistrer
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
  
  export default EditTable;
  