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
import 'assets/css/styles.css'

  
const EditSchema = ({ openEditDialog, setOpenEditDialog, newNameSchema, setNewSchemaName }) => {
    const { databaseName, schemaName } = useParams();
    const navigate = useNavigate();

    const [currentSchemaName, setCurrentSchemaName] = useState(schemaName);
    const [currentDatabaseName] = useState(databaseName);
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
      axios
        .put(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/edit`, {
          newSchemaName: newNameSchema,
        })
        .then((response) => {
          const schemaData = response.data.schemas;
          localStorage.setItem(`schemas_${currentDatabaseName}`, JSON.stringify(schemaData));
          setCurrentSchemaName(newNameSchema); 
          setOperationStatus('success');
          setmessageSuccess(response.data.message);
          setOpenSnackBar(true);
          handleCloseEditDialog();
          setSubmitting(false);
          navigate(`/database/${currentDatabaseName}/${newNameSchema}`);

        
          
        })
        .catch((error) => {
          console.error(error);
          setmessageErreur(error.response.data.error);
          setOperationStatus('error');
          setOpenSnackBar(true);
          setSubmitting(false);
        });
    };



    return (
      <div>
        {/* Dialogue modal pour éditer le nom du schéma */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle className="title">Modifier schéma</DialogTitle>
          <DialogContent>
            <TextField
              label="Nouveau nom du schéma"
              variant="outlined"
              fullWidth
              value={newNameSchema}
              onChange={handleSchemaNameChange}
              className="textField"
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
  
  export default EditSchema;
  