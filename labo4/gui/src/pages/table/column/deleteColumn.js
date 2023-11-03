import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';


const DeleteColumn = ({ openDeleteColumnDialog, setOpenDeleteColumnDialog, dbcolumns, columnIndexToDelete , setdbColumns,
     currentDatabaseName, currentSchemaName, currentTableName }) => {
   
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [operationStatus, setOperationStatus] = useState(null);
    const [messageErreur, setmessageErreur] = useState('');
    const [messageSuccess, setmessageSuccess] = useState('');
    const [isSubmitting , setSubmitting] = useState(false);


    const handleCloseDeleteColumnDialog = () => {
        setOpenDeleteColumnDialog(false);
    };

    const handleDeleteColumn = () =>{
        const columnToDelete = dbcolumns[columnIndexToDelete];
        setSubmitting(true);

        axios
        .delete(`http://localhost:5000/del/database/${currentDatabaseName}/schema/${currentSchemaName}/table/${currentTableName}/column/${columnToDelete.name}/delete`)
        .then((response) => {
          const columnData = response.data.columns.map((column) => ({
            name: column.name,
            dataType: column.data_type,
            autoIncrement: column.autoIncrement
    
          }));
          setdbColumns(columnData);
          localStorage.setItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(columnData));
          handleCloseDeleteColumnDialog();
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
    };

    return (
        <div>
            <Dialog open={openDeleteColumnDialog} onClose={handleCloseDeleteColumnDialog}>
                <DialogTitle>Confirmation de suppression</DialogTitle>
                <DialogContent>
                    Êtes-vous sûr de vouloir supprimer cette colonne ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteColumnDialog} color="primary" disableElevation 
                    disabled={isSubmitting}>
                        Annuler
                    </Button>
                    <Button onClick={handleDeleteColumn} color="error" disableElevation 
                     disabled={isSubmitting}>
                        Supprimer
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

export default DeleteColumn;


  