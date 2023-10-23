import {
  AddCircleOutline
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddWarehouse from './addWarehouse';


const WarehouseDefault = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    const cachedwarehouse = localStorage.getItem('warehouses');
    if (cachedwarehouse) {
      setWarehouses(JSON.parse(cachedwarehouse));
    } else {
      axios
        .get('http://localhost:5000/warehouses')
        .then((response) => {
          const warehouseData = response.data.warehouses;
          setWarehouses(warehouseData);
          localStorage.setItem('warehouses', JSON.stringify(warehouseData));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 5.7 }}>
        <Typography variant="h4" gutterBottom>
          Warehouses
        </Typography>
        <List>
          {warehouses.map((warehouse, index) => (
            <ListItemButton key={index} component={Link} to={`/warehouse/${warehouse}`}>
              <ListItemAvatar>
                <Avatar>{warehouse.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={warehouse} />
            </ListItemButton>
          ))}
        </List>
        
      </div>
      <div style={{ flex: 1 }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          <AddCircleOutline /> Warehouse
        </Button>
      </div>

      <AddWarehouse
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setWarehouses={setWarehouses}
      />
    
     
    </div>
  );
};

export default WarehouseDefault;
