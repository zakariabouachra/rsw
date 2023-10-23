import {
  DeleteOutlined,
  EditOutlined,
  LeftCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  AddCircleOutline
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import axios from 'axios';
import AddSchema from 'pages/schema/addSchema';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DeleteDatabase from './deleteDatabase';
import EditDatabase from './editDataBase';

const DatabaseDetail = () => {
  const { databaseName } = useParams();

  // État pour le menu d'action
  const [anchorEl, setAnchorEl] = useState(null);

  // État pour le dialogue d'édition
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [currentDatabaseName, setCurrentDatabaseName] = useState(databaseName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSchemaDialog, setOpenSchemaDialog] = useState(false);
  const [schemas, setSchemas] = useState([]);



  // Fonction pour ouvrir le dialogue modal d'ajout de schéma
  const handleOpenSchemaDialog = () => {
    setOpenSchemaDialog(true);
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

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
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
          <AddCircleOutline /> Schéma
        </Button>
      </div>


      <AddSchema
        openSchemaDialog={openSchemaDialog}
        setOpenSchemaDialog={setOpenSchemaDialog}
        setSchemas={setSchemas}
      />

      <EditDatabase
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        newDatabaseName={newDatabaseName}
        setNewDatabaseName={setNewDatabaseName}
      />

      <DeleteDatabase
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        currentDatabaseName={currentDatabaseName}
      />
    </div>
  );
};

export default DatabaseDetail;

