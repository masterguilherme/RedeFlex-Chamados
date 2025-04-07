import React, { createContext, useContext, useState } from 'react';
import { attachmentService } from '../services/api';
import { handleApiError } from '../utils/helpers';
import { UPLOAD } from '../utils/constants';

const AttachmentContext = createContext(null);

export const AttachmentProvider = ({ children }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadAttachment = async (solicitationId, file) => {
    try {
      setLoading(true);
      setError(null);

      // Validar tamanho do arquivo
      if (file.size > UPLOAD.MAX_FILE_SIZE) {
        throw new Error(`O arquivo deve ter no máximo ${UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      // Validar tipo do arquivo
      if (!UPLOAD.ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido');
      }

      const response = await attachmentService.upload(solicitationId, file);
      setAttachments((prev) => [response, ...prev]);
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAttachment = async (solicitationId, attachmentId) => {
    try {
      setLoading(true);
      setError(null);
      await attachmentService.delete(solicitationId, attachmentId);
      setAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== attachmentId)
      );
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setAttachmentsList = (attachmentsList) => {
    setAttachments(attachmentsList);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    attachments,
    loading,
    error,
    uploadAttachment,
    deleteAttachment,
    setAttachmentsList,
    clearError,
  };

  return (
    <AttachmentContext.Provider value={value}>
      {children}
    </AttachmentContext.Provider>
  );
};

export const useAttachment = () => {
  const context = useContext(AttachmentContext);
  if (!context) {
    throw new Error('useAttachment deve ser usado dentro de um AttachmentProvider');
  }
  return context;
};

export default AttachmentContext; 