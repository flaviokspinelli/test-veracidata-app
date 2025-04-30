import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFields({ ...fields, [field]: value });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields['username']) {
      formIsValid = false;
      errors['username'] = 'Campo obrigatório.';
    } else {
      const lastAt = fields.username.lastIndexOf('@');
      const lastDot = fields.username.lastIndexOf('.');
      if (
        !(
          lastAt < lastDot &&
          lastAt > 0 &&
          fields.username.indexOf('@@') === -1 &&
          lastDot > 2 &&
          fields.username.length - lastDot > 2
        )
      ) {
        formIsValid = false;
        errors['username'] = 'E-mail inválido.';
      }
    }

    if (!fields['password']) {
      formIsValid = false;
      errors['password'] = 'Campo obrigatório.';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const res = await login(fields.username, fields.password);

      if (res.status === 200) {
        toast.dismiss();
        navigate('/customers');
      } else if (res.response.status === 401) {
        if (res.response.data?.detail) toast.error(res.response.data.detail);
        else {
          let errors = {};
          Object.keys(res.response.data).forEach((key) => {
            errors[key] = res.response.data[key][0];
          });
          toast.error(errors);
        }
      } else {
        toast.error('Ops! Ocorreu um erro inesperado. Tente novamente. Se o erro persistir, entre em contato com o suporte.');
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card
        elevation={6}
        sx={{
          width: '100%',
          py: 4,
          px: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Bem-vindo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Faça login para continuar
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="E-mail"
              name="username"
              margin="normal"
              value={fields.username || ''}
              onChange={(e) => handleChange('username', e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              margin="normal"
              value={fields.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  Aguarde <CircularProgress size={18} sx={{ ml: 1, color: 'white' }} />
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
