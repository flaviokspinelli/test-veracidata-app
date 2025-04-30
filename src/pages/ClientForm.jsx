import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';

const ClientForm = () => {
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const { getOptions, createCustomer, editCustomer, getCustomer, deleteCustomer, options } = useCustomer();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFields({ ...fields, [field]: value });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    Object.keys(options?.actions.POST).forEach((item) => {
      if (options?.actions.POST[item].required && !options?.actions.POST[item].read_only) {
        if (!fields[item]) {
          formIsValid = false;
          errors[item] = 'Campo obrigatório.';
        }
      }
    });

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      let res;
      if (id) {
        res = await editCustomer(id, fields);
      } else {
        res = await createCustomer(fields);
      }

      if (res.status === 201) {
        setSnackbarMessage('Cliente criado com sucesso.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        navigate(`/customers`);
      } else if (res.status === 200 && id) {
        setSnackbarMessage('Cliente editado com sucesso.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        navigate(`/customers`);
      } else if (res.response.status === 400) {
        if (res.response.data?.detail) {
          setSnackbarMessage(res.response.data.detail);
          setSnackbarSeverity('error');
        } else {
          let errors = {};
          Object.keys(res.response.data).forEach((key) => {
            errors[key] = res.response.data[key][0];
          });
          setErrors(errors);
        }
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Ops! Ocorreu um erro inesperado. Tente novamente. Se o erro persistir, entre em contato com o suporte.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleDelete = async () => {
    const res = await deleteCustomer(fields.id);

    if (res.status === 204) {
      setSnackbarMessage(`${fields.name} foi removido com sucesso!`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate(`/customers`);
    } else {
      setSnackbarMessage(`Não foi possível excluir ${fields.name}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }

    setOpenDialog(false);
  };

  const getData = async () => {
    await getOptions();
    if (id) {
      const res = await getCustomer(id);
      setFields(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <h1 className="fs-6 text-uppercase fw-semibold my-4">{!id ? 'Criar cliente' : `Editar ${fields?.name}`}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={6}>
                <TextField
                  label={options?.actions.POST.name.label}
                  fullWidth
                  variant="outlined"
                  name="name"
                  value={fields?.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors?.name}
                  helperText={errors?.name}
                  required={options?.actions.POST.name.required}
                  InputProps={{
                    readOnly: options?.actions.POST.name.read_only,
                  }}
                  InputLabelProps={{
                    shrink: fields?.name
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={options?.actions.POST.email.label}
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={fields?.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={!!errors?.email}
                  helperText={errors?.email}
                  required={options?.actions.POST.email.required}
                  InputProps={{
                    readOnly: options?.actions.POST.email.read_only,
                  }}
                  InputLabelProps={{
                    shrink: fields?.email
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} className="mt-3">
              <Grid size={6}>
                <TextField
                  label={options?.actions.POST.phone.label}
                  fullWidth
                  variant="outlined"
                  name="phone"
                  value={fields?.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={!!errors?.phone}
                  helperText={errors?.phone}
                  required={options?.actions.POST.phone.required}
                  InputProps={{
                    readOnly: options?.actions.POST.phone.read_only,
                  }}
                  InputLabelProps={{
                    shrink: fields?.phone
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={options?.actions.POST.birthday.label}
                  fullWidth
                  variant="outlined"
                  name="birthday"
                  type="date"
                  value={fields?.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  error={!!errors?.birthday}
                  helperText={errors?.birthday}
                  required={options?.actions.POST.birthday.required}
                  InputProps={{
                    readOnly: options?.actions.POST.birthday.read_only,
                  }}
                  InputLabelProps={{
                    shrink: fields?.birthday
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} className="mt-3">
          <Grid item>
            {id ? (
              <Button color="error" variant="outlined" onClick={() => setOpenDialog(true)}>
                Eliminar
              </Button>
            ) : null}
          </Grid>
          <Grid item xs className="d-flex justify-content-end gap-4">
            <Button color="secondary" variant="outlined" onClick={() => navigate(`/customers`)}>
              Cancelar
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {!id ? 'Criar' : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Eliminar cliente</DialogTitle>
        <DialogContent>
          <p>
            Tem certeza de que deseja excluir <b>{fields?.name}</b>?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Não
          </Button>
          <Button onClick={handleDelete} color="error">
            Sim
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClientForm;
