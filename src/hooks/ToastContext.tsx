import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Toast } from '../components/Toast';


type ToastOptions = {
  duration?: number;
  position?: 'top' | 'bottom';
  type: 'success' | 'error' | 'warning' | 'info';
};

type ToastData = {
  message: string;
} & ToastOptions;

type ToastContextType = {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: () => void;
};

// ✅ Provide default functions to avoid undefined access
const ToastContext = createContext<ToastContextType>({
  showToast: () => { },
  hideToast: () => { },
});

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageId = Date.now();
  const showToast = useCallback((message: string, options: ToastOptions = { type: 'success' }) => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
    setToast({ message, ...options });

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, options.duration || 3000);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast?.message &&
        <Toast message={toast?.message} options={toast || {}} key={messageId} />
      }
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
