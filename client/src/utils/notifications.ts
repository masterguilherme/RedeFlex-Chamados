import { toast, ToastOptions } from 'react-toastify';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

// Configurações padrão para os toasts
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Função para mostrar mensagem de sucesso
export const showSuccess = (message: string = SUCCESS_MESSAGES.CREATE, options?: ToastOptions): void => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Função para mostrar mensagem de erro
export const showError = (message: string = ERROR_MESSAGES.SERVER_ERROR, options?: ToastOptions): void => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Função para mostrar mensagem de informação
export const showInfo = (message: string, options?: ToastOptions): void => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Função para mostrar mensagem de aviso
export const showWarning = (message: string, options?: ToastOptions): void => {
  toast.warning(message, { ...defaultOptions, ...options });
};

// Função para mostrar mensagem de confirmação
export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};

// Função para mostrar mensagem de erro da API
export const showApiError = (error: any): void => {
  if (error.message) {
    showError(error.message);
  } else if (error.errors) {
    Object.values(error.errors).forEach((messages: any) => {
      messages.forEach((message: string) => {
        showError(message);
      });
    });
  } else {
    showError(ERROR_MESSAGES.SERVER_ERROR);
  }
};

// Função para mostrar mensagem de sucesso da API
export const showApiSuccess = (message?: string): void => {
  showSuccess(message || SUCCESS_MESSAGES.CREATE);
};

// Função para mostrar mensagem de carregamento
export const showLoading = (message: string = 'Carregando...'): void => {
  toast.info(message, {
    ...defaultOptions,
    autoClose: false,
    closeOnClick: false,
    draggable: false,
  });
};

// Função para fechar mensagem de carregamento
export const hideLoading = (): void => {
  toast.dismiss();
}; 