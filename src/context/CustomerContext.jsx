import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

const Customer = ({ children }) => {
  const [options, setOptions] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(null);

  const getOptions = async (id) => {
    try {
      const res = await axios.options(`/api/customers/`);
      setOptions(res.data);
      return res;
    } catch (error) {
      setOptions(null);
      return error;
    }
  };

  const getCustomers = async (page=1, search='') => {
    setLoading('get_customers');
    try {
      const res = await axios.get(`/api/customers/?page=${page}&search=${search}`);  
      setCustomers(res.data);
      setLoading(null);
      return res;
    } catch (error) {
      setLoading(null);
      return error;
    }
  };

  const getCustomer = async (id) => {
    setLoading('get_customer');
    try {
      const res = await axios.get(`/api/customers/${id}/`);
      setCustomer(res.data);
      setLoading(null);
      return res;
    } catch (error) {
      setCustomer(null);
      setLoading(null);
      return error;
    }
  };

  const deleteCustomer = async (id) => {
    setLoading('delete_customer');
    try {
      const res = await axios.delete(`/api/customers/${id}/`);
      setLoading(null);
      return res;
    } catch (error) {
      setLoading(null);
      return error;
    }
  };

  const createCustomer = async (data) => {
    setLoading('create_customers');
    try {
      const res = await axios.post(`/api/customers/`, data);
      setLoading(null);
      return res;
    } catch (error) {
      setLoading(null);
      return error;
    }
  }

  const editCustomer = async (id, data) => {
    setLoading('create_user');
    try {
      const res = await axios.patch(`/api/customers/${id}/`, data);
      setLoading(null);
      return res;
    } catch (error) {
      setLoading(null);
      return error;
    }
  }

  return (
    <CustomerContext.Provider
      value={{
        options,
        customers,
        customer,
        loading,
        getOptions,
        getCustomers,
        getCustomer,
        deleteCustomer,
        createCustomer,
        editCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default Customer;