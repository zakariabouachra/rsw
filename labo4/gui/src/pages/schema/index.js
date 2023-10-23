import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  DatabaseOutlined
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
import AddTable from 'pages/table/addTable';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DeleteSchema from './deleteSchema';
import EditSchema from './editSchema';
import 'assets/css/styles.css'

const SchemaDetail = () => {
  const { databaseName , schemaName } = useParams();

  // État pour le menu d'action
  const [anchorEl, setAnchorEl] = useState(null);

  // État pour le dialogue d'édition
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newNameSchema, setNewSchemaName] = useState('');
  const [currentSchemaName, setCurrentSchemaName] = useState(schemaName);
  const [currentDatabaseName ] = useState(databaseName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [tables, setTables] = useState([]);


  // Fonction pour ouvrir le dialogue modal d'ajout de table
  const handleOpenTableDialog = () => {
    setOpenTableDialog(true);
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


  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const fetchTables = () => {
    axios
      .get(`http://localhost:5000/database/${currentDatabaseName}/schema/${currentSchemaName}/tables`)
      .then((response) => {
        console.log(response.data);
        const tableData = response.data.tables;
        setTables(tableData);
        localStorage.setItem(`tables_${currentDatabaseName}_${currentSchemaName}`, JSON.stringify(tableData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setCurrentSchemaName(schemaName);
    const storedtables = localStorage.getItem(`tables_${currentDatabaseName}_${currentSchemaName}`);
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
          <Link to="/database" style={{ textDecoration: 'none' }}>
            <DatabaseOutlined style={{ fontSize: '15px', marginLeft: '8px', color: 'black' }} />
          </Link>
          <Box fontWeight="normal" display="inline">
            <Link to={`/database/${currentDatabaseName}`} className="hover-link">
              {currentDatabaseName}
            </Link>
            {' / '}
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
        <IconButton onClick={handleActionClick}>
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
          className="addButton"
        >
          <AddCircleOutline /> Table
        </Button>
      </div>
      
      <AddTable
        openTableDialog={openTableDialog}
        setOpenTableDialog={setOpenTableDialog}
        setTables={setTables}  
      />

      <EditSchema
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        newNameSchema={newNameSchema}
        setNewSchemaName={setNewSchemaName}
      />

      <DeleteSchema
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        currentSchemaName={currentSchemaName}
        currentDatabaseName={currentDatabaseName}
      />
    </div>
  );
};

export default SchemaDetail;
