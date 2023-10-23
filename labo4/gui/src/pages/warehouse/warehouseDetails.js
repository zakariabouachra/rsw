import {
  DeleteOutlined,
  EditOutlined,
  LeftCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EditWarehouse from './editWarehouse';
import DeleteWarehouse from './deleteWarehouse';

const WarehouseDetail = () => {
  const { warehouseName } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [currentWarehouseName, setCurrentWarehouseName] = useState(warehouseName);
 


  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setNewWarehouseName(currentWarehouseName);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    setCurrentWarehouseName(warehouseName);
  }, [warehouseName]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 7 }}>
        <Typography variant="h4" gutterBottom>
          <IconButton component={Link} to="/warehouse">
            <LeftCircleOutlined />
          </IconButton>
          <Box fontWeight="normal" display="inline">
            Warehouses /
          </Box>
          <Box fontWeight="bold" display="inline">
            {currentWarehouseName}
          </Box>
        </Typography>
      </div>
      <div style={{ flex: 1 }}>
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

      <EditWarehouse
        openEditDialog={openEditDialog}
        newWarehouseName={newWarehouseName}
        setOpenEditDialog={setOpenEditDialog}
        setNewWarehouseName={setNewWarehouseName}
      />

      <DeleteWarehouse
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog} 
        currentWarehouseName={currentWarehouseName}     
      />

     
    </div>
  );
};

export default WarehouseDetail;
