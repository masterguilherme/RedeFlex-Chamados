import React, { createContext, useContext, useState } from 'react';
import { commentService } from '../services/api';
import { handleApiError } from '../utils/helpers';

const CommentContext = createContext(null);

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createComment = async (solicitationId, commentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await commentService.create(solicitationId, commentData);
      setComments((prev) => [response, ...prev]);
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (solicitationId, commentId) => {
    try {
      setLoading(true);
      setError(null);
      await commentService.delete(solicitationId, commentId);
      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setCommentsList = (commentsList) => {
    setComments(commentsList);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    comments,
    loading,
    error,
    createComment,
    deleteComment,
    setCommentsList,
    clearError,
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComment deve ser usado dentro de um CommentProvider');
  }
  return context;
};

export default CommentContext; 