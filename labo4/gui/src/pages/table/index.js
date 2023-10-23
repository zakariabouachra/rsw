import {
  DeleteOutlined,
  EditOutlined,
  DatabaseOutlined,
  MoreOutlined
} from '@ant-design/icons';
import {
  AddCircleOutline,
  PlaylistAdd,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddColumn from './column/addColumn';
import ColumnShow from './column/affichColumn';
import DataShow from './data/affichData';
import InsertData from './data/insertData';
import DeleteTable from './deleteTable';
import EditTable from './editTable';
import TableAnalyse from './tablesAnalyse';
import 'assets/css/styles.css'

const TableDetail = () => {
  const { databaseName, schemaName, tableName } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [currentTableName, setCurrentTableName] = useState(tableName);
  const [currentDatabaseName] = useState(databaseName);
  const [currentSchemaName] = useState(schemaName);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dbcolumns, setdbColumns] = useState([]);
  const [data, setData] = useState([]);
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);


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
          localStorage.setItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(columnData));
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
        localStorage.setItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`, JSON.stringify(tableData));
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
      const storedColumns = localStorage.getItem(`columns_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);
      if (storedColumns) {
        const columnData = JSON.parse(storedColumns);
        setdbColumns(columnData);
      } else {
        // Si les colonnes ne sont pas dans le localStorage, fetchColumnsAndData pour les obtenir depuis le serveur
        fetchColumnsAndData();
      }

      // Récupérez les données depuis le localStorage en utilisant le nom de la table comme clé
      const storedData = localStorage.getItem(`data_${currentDatabaseName}_${currentSchemaName}_${currentTableName}`);
      if (storedData) {
        const tableData = JSON.parse(storedData);
        setData(tableData);
      } else {
        // Si les données ne sont pas dans le localStorage, fetchColumnsAndData pour les obtenir depuis le serveur
        fetchColumnsAndData();
      }
    }
  }, [tableName, deleting]); 


  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };


  const handleAddColumn = () => {
    setOpenAddColumnDialog(true);
  };

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

  // Fonction pour ouvrir le dialogue de suppression de la table
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Fonction pour ouvrir le dialogue d'ajout de colonne
  const handleOpenTableDialog = () => {
    setOpenTableDialog(true);
  };


  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <Link to="/database" style={{ textDecoration: 'none' }}> 
            <DatabaseOutlined style={{ fontSize: '15px', color: 'black' }}/>
          </Link>
          <Box fontWeight="normal" display="inline">
            <Link to={`/database/${currentDatabaseName}`} className="hover-link">
              {currentDatabaseName}
            </Link>
            {' / '}
            <Link to={`/database/${currentDatabaseName}/${currentSchemaName}`} className="hover-link"> 
              {currentSchemaName}
            </Link>
            {' / '}
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
        {activeTab === 1 && 
        <ColumnShow 
        dbcolumns={dbcolumns} 
        setdbColumns={setdbColumns}
        currentDatabaseName={currentDatabaseName}
        currentSchemaName={currentSchemaName}
        currentTableName={currentTableName} 
        />}
        {activeTab === 2 && <DataShow data={data} dbcolumns={dbcolumns}/>}
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
        >
          <AddCircleOutline /> New Data
        </Button>
      </div>

      <AddColumn
        openAddColumnDialog={openAddColumnDialog}
        setOpenAddColumnDialog={setOpenAddColumnDialog}
        setdbColumns={setdbColumns}
        setData={setData}
      />

      <InsertData
        openTableDialog={openTableDialog}
        setOpenTableDialog={setOpenTableDialog}
        dbcolumns={dbcolumns}
        setData={setData}
      />

      <EditTable
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        newTableName={newTableName}
        setNewTableName={setNewTableName}
      />

      <DeleteTable
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        setDeleting={setDeleting}
        currentDatabaseName={currentDatabaseName}
        currentSchemaName={currentSchemaName}
        currentTableName={currentTableName}
      />

    </div>
  );
};

export default TableDetail;
