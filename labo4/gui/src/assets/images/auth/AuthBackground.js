import { Box } from '@mui/material';
import logo from './snowflake-icon.svg';


const AuthBackground = () => {
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(8px)', zIndex: -3, bottom: 150}}>
      <img src={logo} alt="" style={{ width: '500px', height: '500px' }} />
    </Box>
  );
};

export default AuthBackground;
