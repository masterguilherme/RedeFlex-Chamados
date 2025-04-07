import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TicketContext = createContext({});

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os chamados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTicket = async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar o chamado');
      console.error(err);
      return null;
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      setTickets([...tickets, response.data]);
      return response.data;
    } catch (err) {
      setError('Erro ao criar o chamado');
      console.error(err);
      throw err;
    }
  };

  const updateTicket = async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      setTickets(tickets.map(ticket => 
        ticket.id === id ? response.data : ticket
      ));
      return response.data;
    } catch (err) {
      setError('Erro ao atualizar o chamado');
      console.error(err);
      throw err;
    }
  };

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(tickets.filter(ticket => ticket.id !== id));
    } catch (err) {
      setError('Erro ao excluir o chamado');
      console.error(err);
      throw err;
    }
  };

  const getTicketComments = async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar os comentários');
      console.error(err);
      return [];
    }
  };

  const addComment = async (ticketId, commentData) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
      return response.data;
    } catch (err) {
      setError('Erro ao adicionar o comentário');
      console.error(err);
      throw err;
    }
  };

  const getTicketHistory = async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/history`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar o histórico');
      console.error(err);
      return [];
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        error,
        loadTickets,
        getTicket,
        createTicket,
        updateTicket,
        deleteTicket,
        getTicketComments,
        addComment,
        getTicketHistory
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket deve ser usado dentro de um TicketProvider');
  }
  return context;
} 