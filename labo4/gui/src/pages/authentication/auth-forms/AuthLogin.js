import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';




// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Alert,
  AlertTitle
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = React.useState(null);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          account: '',
          user: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          account : Yup.string().max(255).required('Account is required'),
          user     : Yup.string().max(255).required('User is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            const response = await axios.post('http://localhost:5000/auth/login', values);
          
            if (response.data.status === 'success') {

              Cookies.set('jwt', response.data.token, { secure: true, sameSite: 'strict' });
              navigate('/dashboard/default'); 
            } else {
              setErrorMessage('Les informations ne sont pas correctes.');
            }
          
            // Réinitialiser le formulaire et indiquer que la soumission est terminée
            setStatus({ success: true });
            setSubmitting(false);
          } catch (error) {
            console.error('Erreur lors de l envoi des données :', error);
          
            // En cas d'erreur, mettez à jour l'état errorMessage
            setErrorMessage('Une erreur s est produite lors de l envoi des données.');
          
            // Indiquer que la soumission est terminée
            setSubmitting(false);
          }
          
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="account-connect">Account</InputLabel>
                  <OutlinedInput
                    id="account-connect"
                    type="text"
                    value={values.account}
                    name="account"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter account"
                    fullWidth
                    error={Boolean(touched.account && errors.account)}
                  />
                  {touched.account && errors.account && (
                    <FormHelperText error id="standard-weight-helper-text-account-connect">
                      {errors.account}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user-connect">User</InputLabel>
                  <OutlinedInput
                    id="user-connect"
                    type="text"
                    value={values.user}
                    name="user"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter user"
                    fullWidth
                    error={Boolean(touched.user && errors.user)}
                  />
                  {touched.user && errors.user && (
                    <FormHelperText error id="standard-weight-helper-text-user-connect">
                      {errors.user}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
              {errorMessage !== null && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {errorMessage}
                </Alert>
              )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Connect
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
