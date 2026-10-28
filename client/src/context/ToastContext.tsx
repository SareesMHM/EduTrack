import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import Toast, { ToastItem } from '../components/common/Toast';

interface ToastApi { success: (m: string) => void; error: (m: string) => void }
const ToastContext = createContext<ToastApi>({ success: () => {}, error: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((type: ToastItem['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, type, message }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 4500);
  }, []);
  const api = { success: (m: string) => push('success', m), error: (m: string) => push('error', m) };
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => <Toast key={t.id} item={t} onClose={() => setItems((x) => x.filter((i) => i.id !== t.id))} />)}
      </div>
    </ToastContext.Provider>
  );
}
