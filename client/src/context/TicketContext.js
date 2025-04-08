import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TicketContext = createContext();

export const useTicket = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir query string com os filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(`/api/tickets?${queryParams.toString()}`);
      setTickets(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      setError(error.response?.data?.message || 'Erro ao buscar tickets');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ticket ${id}:`, error);
      setError(error.response?.data?.message || 'Erro ao buscar ticket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/tickets', ticketData);
      
      // Atualizar a lista de tickets
      setTickets(prevTickets => [...prevTickets, response.data]);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      setError(error.response?.data?.message || 'Erro ao criar ticket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id, ticketData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tickets/${id}`, ticketData);
      
      // Atualizar a lista de tickets
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === id ? response.data : ticket
        )
      );
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar ticket ${id}:`, error);
      setError(error.response?.data?.message || 'Erro ao atualizar ticket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/tickets/${id}`);
      
      // Atualizar a lista de tickets
      setTickets(prevTickets => 
        prevTickets.filter(ticket => ticket.id !== id)
      );
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir ticket ${id}:`, error);
      setError(error.response?.data?.message || 'Erro ao excluir ticket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export default TicketContext; 