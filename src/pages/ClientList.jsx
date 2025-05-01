import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Visibility, Delete } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import Search from '../components/Search';
import CustomPagination from '../components/CustomPagination';

const Customers = () => {
  const { customers, getCustomers, deleteCustomer, loading } = useCustomer();
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const searchText = params.get('search') || '';
  const page = params.get('page') ? parseInt(params.get('page')) : 1;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    getCustomers(page, searchText);
  }, [page, searchText]);

  const openDeleteDialog = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    const res = await deleteCustomer(selectedCustomer.id);
    getCustomers(page, searchText);
    if (res.status === 204) {
      setSnackbarMessage(`${selectedCustomer.name} foi removido com sucesso!`);
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage(`Não foi possível excluir ${selectedCustomer.name}`);
      setSnackbarSeverity('error');
    }
    setOpenDialog(false);
    setSelectedCustomer(null);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
        CLIENTES
      </Typography>

      <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/customers/create')}
          >
            Adicionar cliente
          </Button>
        </Grid>
        <Grid item>
          <Search />
        </Grid>
      </Grid>

      {loading === 'get_customers' ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={24} sx={{ mr: 1 }} />
          Carregando...
        </Box>
      ) : (
        <>
          {customers?.results.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell align="right"><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/customers/${item.id}/`)}
                        >
                          {!item.is_admin ? <Edit /> : <Visibility />}
                        </IconButton>
                        <IconButton
                          color="error"
                          disabled={item.is_admin}
                          onClick={() => openDeleteDialog(item)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Card>
              <CardContent>
                {searchText.length > 0 ?
                  <Typography align="center">
                    Nenhum resultado encontrado para <b>{searchText}</b>
                  </Typography>
                : 
                  <Grid container justifyContent='center' textAlign='center'>
                    <Grid>
                      <Typography align="center" mt={1} mb={1}>
                        Nenhum cliente cadastrado. Crie seu primeiro cliente.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => navigate('/customers/create')}
                      >
                        Adicionar cliente
                      </Button>
                    </Grid>
                  </Grid>
                }
              </CardContent>
            </Card>
          )}
        </>
      )}

      {customers && (customers.count / 10) > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <CustomPagination currentPage={page} totalPages={customers.count / 10} maxPagesToShow={5} />
        </Box>
      )}

      {/* Dialog de confirmação */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Eliminar cliente</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir <strong>{selectedCustomer?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Não</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
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
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Customers;
